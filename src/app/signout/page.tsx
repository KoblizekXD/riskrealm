import { signOut } from "@/lib/supabase/actions";

export default async function SignOut() {
  await signOut(true);
  return <h1>Well, this is awkward.</h1>;
}
