"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError, z } from "zod";
import type { User, loginSchema, signUpSchema } from "../schemas";
import { removeAttrFromObject } from "../util";
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
