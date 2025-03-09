import { redirect } from "next/navigation";
import Roulette from "./roulette";
import { getUser } from "@/lib/supabase/actions";

export default async function Game() {
  const user = await getUser();
  
  if (!user) redirect("/signin");

  return <Roulette />;
}
