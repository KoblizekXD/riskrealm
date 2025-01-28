import { getUser } from "@/lib/supabase/actions";
import LandingPage from "./not-logged";

export default async function Home() {
  const user = await getUser();

  if (!user) return <LandingPage />;
}
