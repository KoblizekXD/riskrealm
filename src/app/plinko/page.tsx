import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import Plinko from "./plinko";

export default async function Game() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Plinko />;
}
