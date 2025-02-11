"use client";

import { ArrowDown } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const luckiestGuy = Orbitron({
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
    <div className="bg-[#18181b] border border-[#28282b] px-4 py-12 md:px-6 md:py-24 text-[#D4AF37] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-[#FFD700] mb-2">
        {title}
      </h3>
      <p className="text-[#D4AF37] text-sm md:text-base">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#d0bfff] flex flex-col overflow-hidden">
      <div className="flex flex-col items-center">
        <header className="md:h-20 bg-[#151520] shadow-lg flex flex-col items-center w-full justify-between px-2 md:px-6 md:flex-row">
          <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0 border-b-3 border-[#ce9aff] pb-2 md:pb-0 md:border-b-0">
            <div className="text-4xl md:text-2xl font-bold text-[#d4af37]">
              Risk Realm
            </div>
          </div>
          <nav className="flex flex-col items-center space-x-2 md:space-x-6 md:flex-row">
            <button
              type="button"
              className="text-[#D4AF37] text-lg hover:text-[#FFD700] hover:scale-115 transition transform cursor-pointer mt-2 md:mt-0">
              Home
            </button>
            <button
              type="button"
              className="text-[#D4AF37] text-lg hover:text-[#FFD700] hover:scale-115 transition transform cursor-pointer mt-1 md:mt-0">
              Games
            </button>
            <Link href="/aboutus" passHref>
              <button
                type="button"
                className="text-[#D4AF37] text-lg hover:text-[#FFD700] hover:scale-115 transition transform cursor-pointer mt-1 mb-2 md:mt-0 md:mb-0">
                About Us
              </button>
            </Link>
          </nav>
          <div>
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0">
              Sign In
            </button>
          </div>
        </header>

        <main className="relative text-center flex-grow p-4 md:p-8 flex flex-col items-center overflow-y-auto w-full">
          <h1
            className={`${luckiestGuy.className} text-4xl md:text-8xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4 pt-6 md:pt-10`}>
            Welcome to Risk Realm
          </h1>

          <p
            className={`${luckiestGuy.className} text-[#D4AF37] drop-shadow-[0_0_10px_#CFAF4A] text-base md:text-2xl text-center mb-4 md:mb-8 max-w-4xl font-semibold`}>
            Your One-Stop Destination for Thrilling Games and Big Wins
          </p>

          <p className="text-[#CFAF4A] text-sm md:text-lg text-center mb-4 md:mb-8 max-w-3xl">
            At Risk Realm, we bring the excitement of the casino floor right to
            your fingertips. Whether you’re a seasoned player or a casual gamer,
            we’ve got something for everyone:
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-x-4 w-full md:w-md *:py-2 *:px-4">
            <button
              onClick={() => router.push("/signin")}
              type="button"
              className="basis-[50%] bg-[#D4AF37] hover:bg-[#d4bf37] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-[0px_0px_15px_#FFD700] font-semibold md:px-6 cursor-pointer hover:scale-105 transition transform w-full md:w-auto">
              Play Now
            </button>
            <Link
              href={"#more"}
              type="button"
              className="basis-[50%] bg-[#D4AF37] hover:bg-[#d4bf37] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-[0px_0px_15px_#FFD700] font-semibold md:px-6 cursor-pointer hover:scale-105 transition transform w-full md:w-auto">
              Learn more
            </Link>
          </div>

          <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
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
        </main>
        <Link
          href={"#more"}
          className="mt-auto border-2 mb-6 h-fit w-fit rounded-full animate-bounce">
          <ArrowDown className="m-1" />
        </Link>
      </div>

      <div className="text-center flex flex-col items-center gap-y-9 mt-8 h-screen">
        <h1
          id="more"
          className="mt-8 text-xl md:text-2xl text-center mb-4 max-w-3xl bg-gradient-to-r from-[#FFD700] to-[#f5a802] text-transparent bg-clip-text font-semibold">
          Why Choose Risk Realm?
        </h1>

        <h2 className="text-lg md:text-xl text-[#ce9aff]">
          💎 Exclusive Bonuses & Promotions 💎
        </h2>
        <p className="text-[#7c5083] text-center max-w-3xl text-xs md:text-sm mb-4">
          Get rewarded with generous welcome bonuses, free spins, and exciting
          offers.
        </p>
        <h2 className="text-lg md:text-xl text-[#ce9aff]">
          📱 Play Anywhere, Anytime 📱
        </h2>
        <p className="text-[#7c5083] text-center max-w-3xl text-xs md:text-sm mb-4">
          Enjoy seamless gaming on any device—desktop, tablet, or mobile.
        </p>
        <h2 className="text-lg md:text-xl text-[#ce9aff]">
          🌟 24/7 Support 🌟
        </h2>
        <p className="text-[#7c5083] text-center max-w-3xl text-xs md:text-sm mb-4">
          Our dedicated support team is here to help, no matter the time.
        </p>
      </div>

      <footer className="h-16 flex items-center justify-center border-t border-[#28282b] bg-[#171020]">
        <p className="text-[#D4AF37] text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
        </p>
      </footer>
    </div>
  );
}
