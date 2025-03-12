import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import RussianRoulette from "./russianroulette";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <RussianRoulette user={user} />;
}
