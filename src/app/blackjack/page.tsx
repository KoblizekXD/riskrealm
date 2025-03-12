import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Blackjack from "./blackjack";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Blackjack user={user} />;
}
