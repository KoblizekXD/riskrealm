import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Slots from "./slots";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Slots user={user} />;
}
