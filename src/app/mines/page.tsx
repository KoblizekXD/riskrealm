import MinesGame from './mines';
import { getUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";


export default async function Game() {
    const user = await getUser();

  if (!user) redirect("/signin");
    return <MinesGame user={user}/>
        

}
