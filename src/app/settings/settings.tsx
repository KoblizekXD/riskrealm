"use client";

import type { User } from "@/lib/schemas";
import { updateUserDetails } from "@/lib/supabase/actions";
import { ArrowLeft, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Settings({ user }: { user: User }) {
  return (
    <main className="flex items-center justify-center py-12 bg-[#191023] min-h-screen w-full">
      <div className="h-screen p-6 flex flex-col gap-y-2 w-1/2 bg-[#151520] shadow-2xl rounded-lg">
        <div className="flex w-full items-center">
          <h1 className="flex items-center gap-x-2 font-bold text-3xl">
            <SettingsIcon size={32} />
            Options
          </h1>
          <Link
            className="ml-auto text-blue-500 underline flex items-center"
            href="/"
          >
            <ArrowLeft size={18} />
            Home
          </Link>
        </div>
        <p className="text-white/50">Edit your user settings here.</p>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const data = {
              email: formData.get("email") as string,
              password: formData.get("password") as string,
              username: formData.get("username") as string,
            };

            const res = await updateUserDetails(data.username, data.email, data.password);
            if (typeof res === "string") {
              toast.error(res);
            } else {
              toast.success("User details updated successfully.");
            }
          }}
          className="flex h-full flex-col gap-y-4"
        >
          <label className="flex flex-col gap-y-1">
            <span className="text-white font-bold text-lg">Username</span>
            <input
              name="username"
              type="text"
              className="input border border-black rounded-md p-2 bg-[#151520]/50"
              defaultValue={user.username}
            />
          </label>
          <label className="flex flex-col gap-y-1">
            <span className="text-white font-bold text-lg">Email</span>
            <input
              name="email"
              type="text"
              className="input border border-black rounded-md p-2 bg-[#151520]/50"
              defaultValue={user.email}
            />
          </label>
          <label className="flex flex-col gap-y-1">
            <span className="text-white font-bold text-lg">Password</span>
            <input
              name="password"
              type="password"
              className="input border border-black rounded-md p-2 bg-[#151520]/50"
              placeholder="New password"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 shadow-md mt-auto hover:scale-105 transition-transform cursor-pointer self-center p-2 rounded-xl w-1/3 text-white font-bold"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
}
