"use client";

import type { User } from "@/lib/schemas";
import { createTransaction, getStockPrice, getUser } from "@/lib/supabase/actions";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TradePage({ user }: { user: User }) {
  const [userData, setUserData] = useState<User>(user);
  const [stockPrice, setStockPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setStockPrice(await getStockPrice());
    })();
  }, []);

  return (
    <div className="w-full flex items-center justify-center h-screen bg-[#191022]">
      <div className="shadow flex flex-col gap-y-4 p-20 rounded w-[90%] h-[90%] bg-[#151520] border border-black">
        <Link className="flex items-center text-blue-500 underline" href={"/"}>
          <ArrowLeftIcon />
          Back to home
        </Link>
        <h1 className="text-4xl font-bold">Trading</h1>
        <h2 className="text-xl font-semibold">
          You are eligible to trade your gems for tickets here.
        </h2>
        <p className="text-lg font-medium">You have {userData.gems} 💎 gems.</p>
        <p className="text-lg font-medium">
          You have {userData.tickets} 🎫 tickets.
        </p>
        <p className="text-lg font-medium">Current stock price is: {stockPrice}</p>
        <form onSubmit={async (form) => {
          form.preventDefault();
          const fd = new FormData(form.currentTarget);

          const gems = fd.get("gems") as string;
          const result = await createTransaction(Number.parseInt(gems));
          if (result === undefined) {
            alert("Transaction failed");
          } else {
            setStockPrice(result);
            const user = await getUser();
            if (!user) return;
            setUserData(user);
          }
        }} className="flex gap-x-4 items-center">
          <input
            name="gems"
            type="number"
            placeholder="Amount of gems"
            className="p-2 rounded border border-black"
          />
          <button type="submit" className="p-2 hover:scale-105 transition-transform cursor-pointer bg-[#3f0e40] text-white rounded">
            Trade
          </button>
        </form>
      </div>
    </div>
  );
}
