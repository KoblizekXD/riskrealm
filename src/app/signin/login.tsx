"use client";

import "@/app/globals.css";
import { login } from "@/lib/supabase/actions";
import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

export default function SignInPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (error) {
      console.log(error);

      toast(error, {
        position: "top-center",
        icon: <XCircle className="stroke-red-500" />,
        className: "class",
        style: {
          backgroundColor: "#11111B",
          color: "#FFFFFF",
          border: "0",
        },
      });
    }
  }, [error]);

  return (
    <main
      className={
        "flex from-[#1e1e2e] to-[#181825] bg-linear-to-br justify-center items-center min-h-screen"
      }>
      <div className="lg:w-1/4 z-10 lg:bg-[#181825] lg:shadow-lg lg:flex-none flex-1 rounded-md flex flex-col p-4">
        <form
          className="flex flex-col"
          action={(fd) => {
            startTransition(async () => {
              const res = await login(fd, "/");
              if (res) {
                console.log(res instanceof ZodError);

                if (res instanceof ZodError) {
                  setError(res.errors.map((err) => err.message).join("\n"));
                } else setError(res);
              }
            });
          }}>
          <h1 className={"font-extrabold text-2xl"}>Sign in to Risk Realm</h1>
          <label className={"mt-4"}>
            <span>Email</span>
            <input
              required
              type={"email"}
              name={"email"}
              className={
                "block bg-[#11111b] rounded-sm w-full p-2 mt-1 outline-hidden"
              }
            />
          </label>
          <label className={"mt-4"}>
            <span>Password</span>
            <input
              required
              type={"password"}
              name={"password"}
              className={
                "block bg-[#11111b] rounded-sm w-full p-2 mt-1 outline-hidden"
              }
            />
          </label>
          <button
            type={"submit"}
            disabled={isPending}
            className={
              "bg-blue-600 disabled:brightness-50 cursor-pointer font-semibold text-white rounded-sm flex items-center justify-center gap-x-2 p-2 mt-4"
            }>
            {isPending && <Loader2 className="animate-spin" />}
            Continue
          </button>
        </form>
        <div className="flex my-2 text-center items-center">
          <hr className="flex-1 border-[#cdd6f4]" />
          <span className="px-2 text-[#cdd6f4]">or</span>
          <hr className="flex-1 border-[#cdd6f4]" />
        </div>
        <div className={"flex flex-col gap-y-2"}>
          {/* {Object.values(providerMap).map((provider) => (
            <form
              className="text-center bg-[#11111b] flex rounded-md"
              key={provider.name}
              action={async (fd) => {}}
            >
              <button
                type={"submit"}
                className={
                  "flex-1 hover:text-black h-full p-2 flex justify-center items-center gap-x-2 hover:bg-white transition-colors"
                }
              >
                <Image
                  width={32}
                  height={32}
                  alt="e"
                  src={`https://raw.githubusercontent.com/nextauthjs/next-auth/refs/heads/main/docs/public/img/providers/${provider.id}.svg`}
                />
                Continue with {provider.name}
              </button>
            </form>
          ))} */}
        </div>
        <Link
          className="mt-2 text-center text-emerald-500 underline"
          href={"/signup"}>
          Not a member yet?
        </Link>
      </div>
      <div
        className={
          "fixed invisible lg:visible w-full -translate-y-16 h-full rotate-2"
        }
      />
    </main>
  );
}
