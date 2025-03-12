import "../globals.css";
import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

import { Plinko } from "./game/game";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Plinko user={user} />;
}
