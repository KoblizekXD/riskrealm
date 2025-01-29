"use client";

import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import { User } from "lucide-react";

export const luckiestGuy = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});

function SimpleCard({ description, title }: { description: string; title: string }) {
  return (
    <div className="bg-gradient-to-r select-none from-gray-800 to-gray-700 px-4 py-28 md:px-8 rounded-xl shadow-lg hover:scale-105 transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-purple-400 mb-2">{title}</h3>
      <p className="text-gray-300 text-sm md:text-base">{description}</p>
    </div>
  );
}

export default function LoggedInPage() {
  return (
    <div className="min-h-screen md:min-h-screen lg:bg-black from-[#1e1e2e] to-[#181825] bg-gradient-to-br text-[#cdd6f4] flex flex-col overflow-hidden">
      <div className="h-screen flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg flex items-center w-full justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-lg md:text-2xl font-bold text-white">Risk Realm</div>
          </div>
          <nav className="flex items-center space-x-3 md:space-x-6">
            <button type="button" className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Home</button>
            <button type="button" className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Games</button>
            <button type="button" className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">About Us</button>
          </nav>
          <div className="h-full">
            <button type="button" className="h-full text-black font-semibold py-1 px-3 md:px-4 cursor-pointer">
              <User size={40} color="white" />
            </button>
          </div>
        </header>

        <main className="relative text-center flex-grow p-4 md:p-8 flex flex-col items-center overflow-y-auto">
          <h1 className={`${luckiestGuy.className} text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#7e02bc]  via-[#B200D8] to-[#D600F0] text-transparent bg-clip-text mb-4 pt-6 md:pt-10`}>Welcome back, Player!</h1>
          <p className={`${luckiestGuy.className} font-semibold text-base md:text-2xl text-center mb-4 md:mb-8 max-w-4xl bg-gradient-to-r from-[#6eff26] to-[#1fb20c] text-transparent bg-clip-text font-semibold`}>Ready to make some money?</p>

          <div className="mt-6 md:mt-10 w-3/4 px-4 overflow-hidden relative min-h-[500px]">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">Just for you:</h2>
            <div className="p-4 w-full overflow-hidden relative min-h-[500px]">
              <motion.div
                className="flex space-x-6 w-[200%]"
                initial={{ x: "0%" }}
                animate={{ x: "-100%" }}
                transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
              >
                {[...Array(2)].flatMap(() => [
                  <SimpleCard key="1" title="🎰 Slots 🎰" description="Spin the reels on our wide selection of classic and modern slot games!" />, 
                  <SimpleCard key="2" title="🃏 Cards 🃏" description="Test your skills and strategies in thrilling card games with competitive odds!" />,
                  <SimpleCard key="3" title="💰🧰 Cases 🧰💰" description="Open cases, win big, and feel the adrenaline rush of every drop!" />,
                  <SimpleCard key="4" title="⚪️ Roulette 🔴" description="Spin the roulette and pray for the best!" />
                ])}
              </motion.div>
            </div>
          </div>

          <div className="mt-6 md:mt-10 w-full px-4">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">Trending right now:</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
              <SimpleCard title="idk yet" description="idk" />
              <SimpleCard title="idk yet" description="idk" />
            </div>
          </div>

          <div className="mt-6 md:mt-10 w-full px-4">
            <h2 className="text-left text-2xl md:text-3xl font-bold text-gray-300 mb-4">Most played:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SimpleCard title="🎰 Slots 🎰" description="Spin the reels on our wide selection of classic and modern slot games!" />
              <SimpleCard title="🃏 Cards 🃏" description="Test your skills and strategies in thrilling card games with competitive odds!" />
              <SimpleCard title="💰🧰 Cases 🧰💰" description="Open cases, win big, and feel the adrenaline rush of every drop!" />
              <SimpleCard title="💰🎁 Daily rewards 🎁💰" description="Gamble and login every day to gain maximum bonus!" />
            </div>
          </div>
        </main>
      </div>
      <footer className="h-16 flex items-center justify-center border-t border-gray-800 bg-[#181825]">
        <p className="text-gray-400 text-xs md:text-sm">© 2025 Risk Realm. All Rights Reserved. Gamble until zero.</p>
      </footer>
    </div>
  );
}
