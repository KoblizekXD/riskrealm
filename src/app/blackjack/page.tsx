import Blackjack from './blackjack';
import { getUser } from "@/lib/supabase/actions";

export default async function Game() {
    const user = await getUser();
    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <Blackjack user={user} />
    );
}