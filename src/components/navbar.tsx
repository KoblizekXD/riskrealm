"use client";

import Link from "next/link";

interface NavbarProps {
  isOpen: boolean;
  toggleNav: () => void;
}

export default function Navbar({ isOpen, toggleNav }: NavbarProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#151520] shadow-lg border-r-2 border-[#18181B] transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "hidden"
      }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#d4af37] border-b-2 border-[#d4af37]">
            Risk Realm
          </h2>
          <button
            type="button"
            onClick={toggleNav}
            className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform">
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
          <Link href="/event" className="text-[#D4AF37] hover:text-[#FFD700]">
            Event
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
