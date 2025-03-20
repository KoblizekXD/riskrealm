"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError, z } from "zod";
import type { User, loginSchema, signUpSchema } from "../schemas";
import { removeAttrFromObject, streakCalculator } from "../util";
import { createClient } from "./server";

export async function login(
  formData: FormData,
  navigateTo?: string,
): Promise<undefined | string | ZodError<z.infer<typeof loginSchema>>> {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  if (navigateTo) redirect(navigateTo);
}

export async function signup(
  formData: FormData,
  navigateTo?: string,
): Promise<undefined | string | ZodError<z.infer<typeof signUpSchema>>> {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

  const { error } = await supabase.auth.signUp({
    ...removeAttrFromObject(data, "username"),
    options: {
      data: {
        username: data.username,
      },
    },
  });

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  if (navigateTo) redirect(navigateTo);
}

export async function signOut(navigateTo?: boolean) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  if (navigateTo) {
    redirect("/signin");
  }
}

export async function getUser(): Promise<User | undefined> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) return;

  const res = await supabase
    .from("users")
    .select("*")
    .eq("id", user.data.user.id)
    .single();
  if (res.error) return;

  return {
    ...res.data,
    email: user.data.user.email,
  };
}

export async function canClaimStreak(): Promise<boolean> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return false;

  const res = await supabase
    .from("users")
    .select("streak_claimed")
    .eq("id", user.data.user.id)
    .single();

  const lastClaimed = res.data?.streak_claimed as string | null;
  if (lastClaimed === null) return true;

  const lastClaimedDate = new Date(lastClaimed);
  const today = new Date();

  if (today.getTime() - lastClaimedDate.getTime() >= 86400000) {
    return true;
  }
  return false;
}

export async function claimStreak() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return false;

  if ((await canClaimStreak()) === false) return false;
  const data = (
    await supabase
      .from("users")
      .select("streak, tickets")
      .eq("id", user.data.user.id)
      .single()
  ).data as { streak: number; tickets: number };

  await supabase
    .from("users")
    .update({
      streak: data.streak + 1,
      streak_claimed: new Date().toISOString(),
      tickets: data.tickets + streakCalculator(data.streak + 1),
    })
    .eq("id", user.data.user.id);
  return true;
}

export async function updateBalance(balance: number) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return false;

  await supabase
    .from("users")
    .update({ tickets: balance })
    .eq("id", user.data.user.id);
}

export async function updateUserDetails(username: string | null, email: string | null, password: string | null): Promise<string | undefined> {
  const supabase = await createClient();

  const res = await supabase.auth.updateUser({
    ...(email && { email }),
    ...(password && { password }),
  });

  if (res.error) {
    return res.error.message;
  }

  const user = await supabase.auth.getUser();
  if (username) {
    const res = await supabase.from("users").update({ username }).eq("id", user.data.user?.id).single();

    if (res.error) {
      return res.error.message;
    }
  }
}

export async function updateGems(gems: number) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return false;

  await supabase
    .from("users")
    .update({ gems: gems })
    .eq("id", user.data.user.id);
}

export async function getStockPrice(): Promise<number | undefined> {
  const supabase = await createClient();
  const res = await supabase.from("transactions").select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (res.error) {
    return undefined;
  }

  return res.data[0].new_price;
}

export async function createTransaction(gem_count: number): Promise<number | undefined> {
  const user = await getUser();

  if (!user) return;

  const ppu = await getStockPrice();
  if (!ppu) return;

  if (user.gems < gem_count) return;

  const supabase = await createClient();

  await supabase.from("transactions").insert({
    gem_count,
    ppu: ppu,
    new_price: (Math.random() + 0.5) * ppu
  });

  updateGems(user.gems - gem_count);
  
  updateBalance(user.tickets + (gem_count * ppu));

  return getStockPrice();
}