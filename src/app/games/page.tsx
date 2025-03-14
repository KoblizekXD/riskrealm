import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Games from "./games";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Games user={user} />;
}
