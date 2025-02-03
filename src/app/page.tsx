import { getUser } from "@/lib/supabase/actions";
import LoggedInPage from "./logged";
import LandingPage from "./not-logged";

export default async function Home() {
  const user = await getUser();

  if (!user) return <LandingPage />;
  return <LoggedInPage user={user} />;
}
