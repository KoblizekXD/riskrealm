"use client";

import type { User } from "@/lib/schemas";
import { getGemLeaderboard, getTicketLeaderboard } from "@/lib/supabase/actions";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

export default function LeaderboardsPage() {
  const [type, setType] = useState<"Gems" | "Tickets">("Tickets");

  return (
    <main className="h-screen w-full flex items-center justify-center bg-[#191022]">
      <div className="p-20 gap-y-4 rounded w-[90%] h-[90%] bg-[#151520] border border-black flex flex-col">
        <h1 className="text-4xl font-bold">Leaderboards</h1>
        <button
          className="bg-gray-800 cursor-pointer shadow rounded-md py-2 px-4 w-fit"
          type="button"
          onClick={() => {
            if (type === "Gems") setType("Tickets");
            else setType("Gems");
          }}
        >
          {type}
        </button>
        <div className="flex-1">
          {type === "Gems" ? <GemsLeaderboard /> : <TicketLeaderboard />}
        </div>
        <Link href={"/"} className="flex items-center text-blue-500 underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}

function TicketLeaderboard() {
  const [data, setData] = useState<User[] | undefined>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    startTransition(async () => {
      const dt = await getTicketLeaderboard();
      if (typeof dt !== "string") setData(dt);
      else setError(dt);
    });
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      {isPending ? (
        <p className="flex items-center self-center">
          <LoaderCircle className="animate-spin" />
          <span className="ml-2">Loading...</span>
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        data?.map((user) => (
          <div key={user.id} className="flex justify-between">
            <p>{user.username}</p>
            <p>{Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(user.tickets)} 🎫</p>
          </div>
        ))
      )}
    </div>
  );
}

function GemsLeaderboard() {
  const [data, setData] = useState<User[] | undefined>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    startTransition(async () => {
      const dt = await getGemLeaderboard();
      if (typeof dt !== "string") setData(dt);
      else setError(dt);
    });
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      {isPending ? (
        <p className="flex items-center self-center">
          <LoaderCircle className="animate-spin" />
          <span className="ml-2">Loading...</span>
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        data?.map((user) => (
          <div key={user.id} className="flex justify-between">
            <p>{user.username}</p>
            <p>{Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(user.gems)} 💎</p>
          </div>
        ))
      )}
    </div>
  );
}
