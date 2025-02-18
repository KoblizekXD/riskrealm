"use client";

import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import type { User as UserType } from "@/lib/schemas";
import { canClaimStreak } from "@/lib/supabase/actions";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";


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
    <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#D4AF37] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#CFAF4A] transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-[#FFD700] mb-2">
        {title}
      </h3>
      <p className="text-[#D4AF37] text-sm md:text-base">{description}</p>
    </div>
  );
}



export default function LoggedInPage({ user }: { user: UserType }) {
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  function Navbar({ isOpen }: { isOpen: boolean }) {
    return (
      <div
        className={`fixed left-0 top-0 h-screen bg-[#151520] shadow-lg border-r-2 border-[#18181B] transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "hidden"
        }`}
      >
        <div className="p-4">
            <div className="flex items-center space-x-2 md:space-x-4 justify-between">
              <h2 className="text-2xl font-bold text-[#d4af37] border-b-2 border-[#d4af37]">Risk Realm</h2>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform "
                >
                  X
                </button>
            </div>
          </div>
          
          <ul className="p-4">
            <li className="mb-2">
              <Link href="/" className="text-[#D4AF37] hover:text-[#FFD700]">
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/games" className="text-[#D4AF37] hover:text-[#FFD700]">
                Games
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/profile" className="text-[#D4AF37] hover:text-[#FFD700]">
                Profile
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/settings" className="text-[#D4AF37] hover:text-[#FFD700]">
                Settings
              </Link>
            </li>
          </ul>
        </div>
    );
  }

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
      <Navbar isOpen={isNavOpen} />
      <div className="flex flex-col items-center">
        
      <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-2 md:px-6">
  <div className={`flex items-center space-x-2 md:space-x-4`}>
    <button
      onClick={() => setIsNavOpen(!isNavOpen)}
      className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform"
    >
      ☰
    </button>
    <div className="text-2xl md:text-2xl font-bold text-[#d4af37]">
      Risk Realm
    </div>
  </div>


  <div className="flex items-center">
    <MyDialog
      title="Menu"
      className="w-[90vw]"
      trigger={
        <div className="cursor-pointer hover:scale-105 transition-transform p-1 border-gray-500 bg-black border rounded-md md:hidden z-40">
          <Menu size={32} className="stroke-white" />
        </div>
      }
    >
      <div className="flex flex-col gap-y-2">
        <div className="rounded gap-x-3 flex justify-start items-center bg-[#11111b] h-fit p-2">
          Balance:
          <span>{user.tickets} 🎫</span>
          <span>{user.gems} 💎</span>
        </div>
        <p className="text-sm text-gray-300">Signed in as {user.email}</p>
        <Link
          className="font-semibold gap-x-2 flex items-center"
          href={"/settings"}
        >
          <Settings size={16} />
          Options
        </Link>
        <Link
          className="font-semibold gap-x-2 flex items-center"
          href={"/signout"}
        >
          <ExternalLink size={16} />
          Sign-out
        </Link>
      </div>
    </MyDialog>

    <div className="h-full gap-x-2 items-center hidden md:flex">
      {streakClaimable && <DailyRewards user={user} />}
      <Tooltip
        content={
          <div className="flex flex-col gap-y-2">
            RiskRealm uses 2 types of currencies:
            <span> - Tickets 🎫</span>
            <span> - Gems 💎</span>
          </div>
        }
      >
        <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
          <span>{user.tickets} 🎫</span>
          <span>{user.gems} 💎</span>
        </div>
      </Tooltip>
      <Popover
        trigger={
          <button
            type="button"
            className="font-semibold hover:bg-white/30 p-2 flex items-center gap-x-2 rounded-lg transition-colors cursor-pointer"
          >
            <User size={28} color="#ce9aff" />
            <span>{user.username}</span>
          </button>
        }
      >
        <div className="rounded gap-y-2 flex flex-col bg-[#11111B] p-4">
          <h2 className="font-semibold">My profile</h2>
          <p className="text-sm text-gray-300">
            Signed in as {user.email}
          </p>
          <Link
            className="font-semibold gap-x-2 flex items-center"
            href={"/settings"}
          >
            <Settings size={16} />
            Options
          </Link>
          <Link
            className="font-semibold gap-x-2 flex items-center"
            href={"/signout"}
          >
            <ExternalLink size={16} />
            Sign-out
          </Link>
        </div>
      </Popover>
    </div>
  </div>
</header>
        <main
          className={`relative text-center flex-grow p-4 lg:p-8 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px] transition-all duration-300 ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}
        >
          <h1
            className={
              "md:text-4xl self-start font-extrabold mb-4 pt-6 md:pt-10 px-4"
            }
          >
            Welcome back, {user.username}!
          </h1>
          <p
            className={`${orbitron.className} self-start px-4 text-[#D4AF37] drop-shadow-[0_0_10px_#CFAF4A] text-base md:text-2xl text-center mb-4 md:mb-8 max-w-4xl font-semibold"`}
          >
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
              <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:shadow-[0px_0px_14px_#CFAF4A] transition transform cursor-pointer text-center">
                <h3 className="text-lg md:text-2xl font-bold text-[#FFD700] mb-2">
                  idk yet
                </h3>
                <p className="text-[#D4AF37] text-sm md:text-base">
                  ignore this for now
                </p>
              </div>

              <div className="bg-[#18181b] border border-[#28282b] px-2 py-24 md:px-6 text-[#b090b5] rounded-xl shadow-lg hover:shadow-[0px_0px_14px_#CFAF4A] transition transform cursor-pointer text-center">
                <h3 className="text-lg md:text-2xl font-bold text-[#FFD700] mb-2">
                  idk yet
                </h3>
                <p className="text-[#D4AF37] text-sm md:text-base">
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

      <footer className="h-16 flex mt-auto items-center justify-center border-t border-gray-800 bg-[#181825]">
        <p className="text-[#D4AF37] text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
        </p>
      </footer>
    </div>
  );
}