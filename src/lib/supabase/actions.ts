"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError, z } from "zod";
import { loginSchema, type signUpSchema } from "../schemas";
import { removeAttrFromObject } from "../util";
import { createClient } from "./server";

export async function login(
  formData: FormData,
  navigateTo?: string
): Promise<undefined | string | ZodError<z.infer<typeof loginSchema>>> {
  const supabase = await createClient();

  const data = loginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!data.success) {
    return data.error;
  }

  const { error } = await supabase.auth.signInWithPassword(data.data);

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  if (navigateTo) redirect(navigateTo);
}

export async function signup(
  formData: FormData,
  navigateTo?: string
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
