import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Register from "./register";

export default async function SignUp() {
  const client = await createClient();

  if ((await client.auth.getUser()).data.user !== null) return redirect("/");

  return <Register />;
}
