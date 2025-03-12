"use client";

import Link from "next/link";
import { JSX } from "react";
import { FaHome, FaCalendarAlt, FaGamepad, FaUser, FaCog, FaTimes } from "react-icons/fa";

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
            <FaTimes />
          </button>
        </div>
      </div>

      <ul className="w-full space-y-4 pl-4">
        <NavItem href="/" icon={<FaHome />} text="Home" />
        <NavItem href="/event" icon={<FaCalendarAlt />} text="Event" />
        <NavItem href="/games" icon={<FaGamepad />} text="Games" />
        <NavItem href="/profile" icon={<FaUser />} text="Profile" />
        <NavItem href="/settings" icon={<FaCog />} text="Settings" />
      </ul>
    </div>
  );
}

function NavItem({ href, icon, text }: { href: string; icon: JSX.Element; text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 text-lg text-[#D4AF37] hover:text-[#FFD700] transition-colors p-2 w-full rounded-lg hover:bg-[#222]">
        <span className="text-xl">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
}

