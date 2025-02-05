"use client";

import Tooltip from "@/components/tooltip";
import type { User as UserType } from "@/lib/schemas";
import { User } from "lucide-react";
import { Orbitron } from "next/font/google";
export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});
function SimpleCard({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-[#be89ff] mb-2">
        {title}
      </h3>
      <p className="text-gray-300 text-sm md:text-base">{description}</p>
    </div>
  );
}

function LargeCard({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-[#be89ff] mb-2">
        {title}
      </h3>
      <p className="text-gray-300 text-sm md:text-base">{description}</p>
    </div>
  );
}

export default function LoggedInPage({ user }: { user: UserType }) {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#030712] text-[#d0bfff] flex flex-col overflow-hidden">
      <div className="flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] flex items-center w-full justify-between px-2 md:px-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-lg md:text-2xl font-bold text-[#ce9aff]">
              Risk Realm
            </div>
          </div>
          <nav className="flex items-center space-x-2 md:space-x-6">
            <button
              type="button"
              className="text-[#d0bfff] text-sm md:text-lg hover:text-[#ce9aff] hover:scale-115 transition transform cursor-pointer">
              Home
            </button>
            <button
              type="button"
              className="text-[#d0bfff] text-sm md:text-lg hover:text-[#ce9aff] hover:scale-115 transition transform cursor-pointer">
              Games
            </button>
            <button
              type="button"
              className="text-[#d0bfff] text-sm md:text-lg hover:text-[#ce9aff] hover:scale-115 transition transform cursor-pointer">
              About Us
            </button>
          </nav>
          <div className="h-full gap-x-2 flex items-center">
            <Tooltip content={
              <div className="flex flex-col gap-y-2">
                RiskRealm uses 2 types of currencies:
                <span> - Tickets 🎫</span>
                <span> - Gems 💎</span>
              </div>}>
              <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
                <span>{user.tickets} 🎫</span>
                <span>{user.gems} 💎</span>
              </div>
            </Tooltip>
            <button
              type="button"
              className="font-semibold hover:bg-white/30 p-2 flex items-center gap-x-2 rounded-lg transition-colors cursor-pointer">
              <User size={40} color="#ce9aff" />
              <span>{user.username}</span>
            </button>
          </div>
        </header>
        <main className="relative text-center flex-grow p-4 md:p-8 flex flex-col items-center overflow-y-auto">
          <h1
            className={"md:text-4xl self-start font-extrabold mb-4 pt-6 md:pt-10"}>
            Welcome back, {user.username}!
          </h1>
          <p
            className={`${orbitron.className} self-start text-[#be89ff] drop-shadow-[0_0_10px_#be89ff] text-base md:text-2xl text-center mb-4 md:mb-8 max-w-4xl font-semibold"`}>
            Ready to make some money?
          </p>
          <div className="mt-6 md:mt-10 w-full px-4">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">
              Just for you:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SimpleCard
                title="🎰 Slots 🎰"
                description="Spin the reels on our wide selection of classic and modern slot games!"
              />
              <SimpleCard
                title="🃏 Cards 🃏"
                description="Test your skills and strategies in thrilling card games with competitive odds!"
              />
              <SimpleCard
                title="💰🧰 Cases 🧰💰"
                description="Open cases, win big, and feel the adrenaline rush of every drop!"
              />
              <SimpleCard
                title="⚪️ Roulette 🔴"
                description="Spin the roulette and pray for the best!"
              />
            </div>
          </div>
          <div className="mt-6 md:mt-10 w-full px-4">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">
              Trending right now:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 h-150">
              <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
                <h3 className="text-lg md:text-2xl font-bold text-[#be89ff] mb-2">
                  idk yet
                </h3>
                <p className="text-gray-300 text-sm md:text-base">
                  ignore this for now
                </p>
              </div>

              <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
                <h3 className="text-lg md:text-2xl font-bold text-[#be89ff] mb-2">
                  idk yet
                </h3>
                <p className="text-gray-300 text-sm md:text-base">
                  ignore this for now
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-10 w-full px-4">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">
              Most played:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SimpleCard
                title="🎰 Slots 🎰"
                description="Spin the reels on our wide selection of classic and modern slot games!"
              />
              <SimpleCard
                title="🃏 Cards 🃏"
                description="Test your skills and strategies in thrilling card games with competitive odds!"
              />
              <SimpleCard
                title="💰🧰 Cases 🧰💰"
                description="Open cases, win big, and feel the adrenaline rush of every drop!"
              />
              <SimpleCard
                title="💰🎁 Daily rewards 🎁💰"
                description="Gamble and login every day to gain maximum bonus!"
              />
            </div>
          </div>
        </main>
      </div>

      <footer className="h-16 flex items-center justify-center border-t border-gray-800 bg-[#181825]">
        <p className="text-gray-400 text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
        </p>
      </footer>
    </div>
  );
}
