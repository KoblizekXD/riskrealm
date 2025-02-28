"use client";

import type { User } from "@/lib/schemas";
import { claimStreak } from "@/lib/supabase/actions";
import { streakCalculator } from "@/lib/util";
import { Gift, TicketsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MyDialog from "./dialog";

export default function DailyRewards({ user }: { user: User }) {
  const [open, setOpen] = useState(true);
  const streak = user.streak + 1;

  return (
    <MyDialog
      open={open}
      trigger={
        <div className="rounded-lg bg-red-500 font-semibold text-white flex gap-x-2 duration-500 transition-colors p-2 hover:bg-white/30 cursor-pointer select-none">
          Daily rewards
          <Gift />
        </div>
      }
      title="Daily rewards"
      description="Login daily to get free rewards! 🔥">
      <h2 className="text-center font-semibold">
        You currently have {user.streak} days of streak.
      </h2>
      <div className="flex gap-x-2 mt-2">
        <div className="basis-48 flex flex-col gap-y-3 justify-center items-center bg-[#030712] shadow-xl rounded-lg h-36">
          <TicketsIcon size={36} />
          <span className="font-semibold">Day {streak}</span>
          <span className="text-amber-400 font-semibold">
            {streakCalculator(streak)} Tickets
          </span>
        </div>
        <div className="basis-48 flex flex-col gap-y-3 justify-center items-center bg-[#030712] shadow-xl rounded-lg h-36">
          <TicketsIcon size={36} />
          <span className="font-semibold">Day {user.streak + 2}</span>
          <span className="text-amber-400 font-semibold">
            {streakCalculator(streak + 1)} Tickets
          </span>
        </div>
        <div className="basis-48 flex flex-col gap-y-3 justify-center items-center bg-[#030712] shadow-xl rounded-lg h-36">
          <TicketsIcon size={36} />
          <span className="font-semibold">Day {user.streak + 3}</span>
          <span className="text-amber-400 font-semibold">
            {streakCalculator(streak + 2)} Tickets
          </span>
        </div>
      </div>
      <button
        onClick={() => {
          claimStreak().then(() => {
            toast("Successfully claimed your daily rewards!");
            setOpen(false);
          });
        }}
        type="button"
        className="bg-blue-500 cursor-pointer hover:scale-105 w-fit self-center px-4 mt-4 transition-transform font-semibold rounded-md p-1">
        Claim
      </button>
    </MyDialog>
  );
}
