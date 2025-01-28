import { getUser } from "@/lib/supabase/actions";
import LandingPage from "./not-logged";
import LoggedInPage from "./logged";

export default async function Home() {
  const user = await getUser();

  if (!user) return <LandingPage />;

  else return <LoggedInPage />

    


  }

