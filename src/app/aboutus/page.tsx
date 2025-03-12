import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { AboutUsLogged, AboutUsNotLogged } from "./aboutus";

export default async function Game() {
  const user = await getUser();

  if (!user) return <AboutUsNotLogged />;

  return <AboutUsLogged user={user} />;
}
