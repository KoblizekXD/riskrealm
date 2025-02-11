"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { luckiestGuy } from "../not-logged";

function SimpleCard({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="bg-[#18181b] border border-[#28282b] px-4 py-12 md:px-6 md:py-24 text-[#b090b5] rounded-xl shadow-lg hover:scale-105 hover:shadow-[0px_0px_14px_#ce9aff] transition transform cursor-pointer text-center">
      <h3 className="text-lg md:text-2xl font-bold text-[#be89ff] mb-2">
        {title}
      </h3>
      <p className="text-[#75507b] text-sm md:text-base">{description}</p>
    </div>
  );
}

export default function AboutUs() {
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
          <Link href="/" passHref>
              <button
                type="button"
                className="text-[#D4AF37] text-lg hover:text-[#FFD700] hover:scale-115 transition transform cursor-pointer mt-1 mb-2 md:mt-0 md:mb-0">
                Home
              </button>
            </Link>
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

        <h1
          className={`${luckiestGuy.className} text-4xl md:text-8xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4 pt-6 md:pt-10`}>
          Meet our team!
        </h1>

        <div className="flex flex-col items-center px-6 py-10 md:px-12">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-12">
            <div className="w-full md:w-1/2">
              <Image
                src="/path.jpg"
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
                urna eget ligula laoreet volutpat sit amet nec justo. Integer
                feugiat sapien nec feugiat pretium. Sed vestibulum cursus orci
                sit amet suscipit.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center md:space-x-8 mb-12">
            <div className="w-full md:w-1/2">
              <Image
                src="/path.jpg"
                alt="Jakub"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
              <h3 className="text-3xl font-bold text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] mb-4">
                Jakub Málek
              </h3>
              <p className="text-[#D4AF37] text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
                urna eget ligula laoreet volutpat sit amet nec justo. Integer
                feugiat sapien nec feugiat pretium. Sed vestibulum cursus orci
                sit amet suscipit.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-12">
            <div className="w-full md:w-1/2">
              <Image
                src="/path.jpg"
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
                urna eget ligula laoreet volutpat sit amet nec justo. Integer
                feugiat sapien nec feugiat pretium. Sed vestibulum cursus orci
                sit amet suscipit.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="h-16 flex items-center justify-center border-t border-[#28282b] bg-[#171020]">
        <p className="text-[#D4AF37] text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
        </p>
      </footer>
    </div>
  );
}
