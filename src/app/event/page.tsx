import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Event from "./event";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Event user={user} />;
}
