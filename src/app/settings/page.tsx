import { getUser } from "@/lib/supabase/actions";
import Settings from "./settings";
import { redirect } from "next/navigation";

export default async function SettingsWrapper() {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <Settings user={user} />;
}