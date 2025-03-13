"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { luckiestGuy } from "../not-logged";
import type { User as UserType } from "@/lib/schemas";
import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import { canClaimStreak} from "@/lib/supabase/actions";
import {
  CandlestickChart,
  ChartCandlestick,
  ExternalLink,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import aboutHonza from "../assets/aboutHonza.png";
import aboutJakub from "../assets/aboutJakub.jpg";
import aboutJarin from "../assets/aboutJarin.jpg";




export function Content() {
  return (
    <><div className="flex flex-col items-center px-6 py-10 md:px-12">
    <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-12">
      <div className="w-full md:w-1/2">
        <Image
          src={aboutHonza.src}
          alt="Honza"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
        <h3 className="text-3xl font-bold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4">
          Jan Prokůpek
        </h3>
        <p className="text-[#D4AF37] text-sm md:text-base">
          Arch user (if you didn't know, he will tell you). Only member of the team who knows what he's doing. He's the one who made the whole backend. Hatsune Miku enjoyer. Laravel hater.
        </p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row-reverse items-center md:space-x-8 mb-12">
      <div className="w-full md:w-1/2">
        <Image
          src={aboutJakub.src}
          alt="Jakub"
          width={600}
          height={400}
          className="rounded-lg shadow-lg ml-auto"
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
        <h3 className="text-3xl font-bold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4">
          Jakub Málek
        </h3>
        <p className="text-[#D4AF37] text-sm md:text-base">
        Certified gym rat, gambler at heart and petrol enjoyer. Professional hater of rainbow users and fridges on wheels.
        </p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-12">
      <div className="w-full md:w-1/2">
        <Image
          src={aboutJarin.src}
          alt="Jarin"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
        <h3 className="text-3xl font-bold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4">
          Jaroslav Rašovský
        </h3>
        <p className="text-[#D4AF37] text-sm md:text-base">
        Stock investor (portfolio is -20 % at the moment). Rich experience in gambling makes him a valuable member of the Risk Realm team. He likes web development too, i guess.

        </p>
      </div>
    </div>
  </div></>
  );
}



export function AboutUsNotLogged() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
          <div className="flex flex-col items-center">
          <header className="md:h-20 bg-[#151520] shadow-lg flex flex-col items-center w-full justify-between px-2 md:px-6 md:flex-row">
          <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0 border-b-3 border-[#ce9aff] pb-2 md:pb-0 md:border-b-0">
            <div className="text-4xl md:text-2xl font-bold text-[#d4af37]">
              Risk Realm
            </div>
          </div>
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0">
              Sign In
            </button>
        </header>
        <main
  className={`relative text-center flex-grow p-4 lg:p-8 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px] transition-all duration-300`}>
  
  <h1
    className={`${luckiestGuy.className} text-4xl md:text-8xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4 pt-6 md:pt-10`}>
    Meet our team!
  </h1>

  <Link
    href="/"
    className="mb-6 bg-[#D4AF37] text-black font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#FFD700]">
    Back to Homepage
  </Link>
  <Content />
  
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

export function AboutUsLogged({ user }: { user: UserType }) {
  
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [tickets, setTickets] = useState(user.tickets);

  const formatNumber = (num: number) => num.toLocaleString("en-US");
 

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
      <Navbar isOpen={isNavOpen} toggleNav={() => setIsNavOpen(!isNavOpen)} />
      <div className="flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-2 md:px-6">
          <div className={"flex items-center space-x-2 md:space-x-4"}>
            <button
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform">
              <Menu />
            </button>
            <Link href={"/"} className="text-2xl -translate-y-[1px] md:text-2xl font-bold text-[#d4af37]">
              Risk Realm
            </Link>
          </div>

          <div className="flex items-center">
            <MyDialog
              title="Menu"
              className="w-[90vw]"
              trigger={
                <div className="cursor-pointer hover:scale-105 transition-transform p-1 border-gray-500 bg-black border rounded-md md:hidden z-40">
                  <Menu size={32} className="stroke-white" />
                </div>
              }>
              <div className="flex flex-col gap-y-2">
                <div className="rounded gap-x-3 flex justify-start items-center bg-[#11111b] h-fit p-2">
                  Balance:
                  <span>{formatNumber(user.tickets)} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
                <p className="text-sm text-gray-300">
                  Signed in as {user.email}
                </p>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/settings"}>
                  <Settings size={16} />
                  Options
                </Link>
                <Link
                  className="font-semibold brightness-50 gap-x-2 flex items-center"
                  href={"/trade"}>
                  <ChartCandlestick size={16} />
                  Trade gems
                </Link>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/signout"}>
                  <ExternalLink size={16} />
                  Sign-out
                </Link>
              </div>
            </MyDialog>

            <div className="h-full gap-x-2 items-center hidden md:flex">
              {streakClaimable && (
                <DailyRewards setTickets={setTickets} user={user} />
              )}
              <Tooltip
                content={
                  <div className="flex flex-col gap-y-2">
                    RiskRealm uses 2 types of currencies:
                    <span> - Tickets 🎫</span>
                    <span> - Gems 💎</span>
                  </div>
                }>
                <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
                  <span>{formatNumber(tickets)} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
              </Tooltip>
              <Popover
                trigger={
                  <button
                    type="button"
                    className="font-semibold hover:bg-white/30 p-2 flex items-center gap-x-2 rounded-lg transition-colors cursor-pointer">
                    <User size={28} color="#ce9aff" />
                    <span>{user.username}</span>
                  </button>
                }>
                <div className="rounded gap-y-2 flex flex-col bg-[#11111B] p-4">
                  <h2 className="font-semibold">My profile</h2>
                  <p className="text-sm text-gray-300">
                    Signed in as {user.email}
                  </p>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/settings"}>
                    <Settings size={16} />
                    Options
                  </Link>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/settings"}>
                    <CandlestickChart size={16} />
                    Trade gems
                  </Link>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/signout"}>
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
          }`}>
            <h1
    className={`${luckiestGuy.className} text-4xl md:text-8xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4 pt-6 md:pt-10`}>
    Meet our team!
  </h1>
          <Content />
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

