import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignInPage from "./login";

export default async function SignIn() {
  const client = await createClient();

  if ((await client.auth.getUser()).data.user !== null) return redirect("/");

  return <SignInPage />;
}
