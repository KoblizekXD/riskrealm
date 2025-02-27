import { getUser } from "@/lib/supabase/actions";
import Blackjack from "./blackjack";
import { redirect } from "next/navigation";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Blackjack user={user} />;
}
