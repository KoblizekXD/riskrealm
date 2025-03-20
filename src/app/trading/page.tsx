import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { TradePage } from "./trade-page";

export default async function TradingWrapper() {
  const user = await getUser();
  
    if (!user) redirect("/signin");

    return <TradePage user={user} />
}