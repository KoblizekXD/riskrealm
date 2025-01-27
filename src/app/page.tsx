import { getUser } from "@/lib/supabase/actions";

export default async function Home() {
  const user = await getUser();
  
  return JSON.stringify(user, null, 2);
}
