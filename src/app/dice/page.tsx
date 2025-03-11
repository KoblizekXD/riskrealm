import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Dice from "./dice";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Dice user={user} />;
}
