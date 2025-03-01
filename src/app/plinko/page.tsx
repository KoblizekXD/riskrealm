
import '../globals.css'


import { Plinko } from './game/game'

export default async function Game() {
  //const user = await getUser();

  //if (!user) redirect("/signin");

  return <Plinko />;
}
