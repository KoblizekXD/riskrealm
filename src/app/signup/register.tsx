"use client";

import { providerMap } from "@/lib/auth";
import { login } from "@/lib/supabase/actions";
import { LoaderCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

export default function Register() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (error) {
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
        "min-h-screen md:h-screen lg:bg-black from-[#1e1e2e] to-[#181825] bg-linear-to-br flex justify-center p-16 items-center"
      }
    >
      <div
        className={"w-full h-full z-10 flex flex-col gap-x-2 lg:flex-row p-2"}
      >
        <div className="flex-1 flex justify-center flex-col items-center">
          <h1 className={"text-4xl mt-12 font-extrabold text-center"}>
            Let&#39;s start your journey here!
          </h1>
          <h2
            className={
              "text-2xl mt-4 font-extrabold text-center text-[#bac2de]"
            }
          >
            Start today and get a chance to win
            <span className={"text-emerald-500"}> big</span>
          </h2>
          <h3 className="font-semibold text-center mt-4">
            You will be rewarded with
            <span
              className={
                "from-yellow-300 text-transparent to-yellow-600 bg-linear-to-r bg-clip-text font-bold"
              }
            >
              {" "}
              500 tickets{" "}
            </span>
            by registering.
          </h3>
          <form
            action={(fd: FormData) => {
              if (!fd.get("age-required")) {
                toast(
                  "You must comply with the age requirement in order to register."
                );
                return;
              }
              startTransition(async () => {
                const res = await login(fd, "/");
                if (res) {
                  if (res instanceof ZodError) {
                    setError(res.errors.map((err) => err.message).join("\n"));
                  } else setError(res);
                }
              });
            }}
            className={"mt-24 lg:w-[70%] flex flex-col gap-y-4"}
          >
            <label className={"mt-4 font-semibold"}>
              <span>Username</span>
              <input
                required
                type={"text"}
                maxLength={32}
                minLength={3}
                name={"full_name"}
                className={
                  "block border-[#313244] border bg-[#11111b] rounded-sm w-full p-2 mt-1 outline-hidden"
                }
              />
            </label>
            <label className={"mt-4 font-semibold"}>
              <span>Email</span>
              <input
                required
                type={"email"}
                name={"email"}
                className={
                  "block border-[#313244] border bg-[#11111b] rounded-sm w-full p-2 mt-1 outline-hidden"
                }
              />
            </label>
            <label className={"mt-4 font-semibold"}>
              <span>Password</span>
              <input
                required
                type={"password"}
                name={"password"}
                className={
                  "block border-[#5d5e6e] border bg-[#11111b] rounded-sm w-full p-2 mt-1 outline-hidden"
                }
              />
            </label>
            <label className={"flex gap-x-4"}>
              <input name="age-required" required type={"checkbox"} />
              <span>
                I&#39;m <span className="font-semibold">18 years</span> or
                older, have read our Terms Of Service,
                <br />
                or{" "}
                <span className="font-semibold">
                  was granted explicit permission to use
                </span>
              </span>
            </label>
            <button
              type={"submit"}
              className={
                "bg-transparent border hover:text-black hover:bg-white transition-colors font-semibold text-white rounded-sm flex items-center justify-center gap-x-2 p-2 mt-4"
              }
            >
              {isPending && <LoaderCircle className={"animate-spin"} />}
              Sign me up!
            </button>
          </form>
        </div>
        <div
          className={
            "flex select-none lg:flex-col items-center gap-x-2 gap-y-2 py-4"
          }
        >
          <div className="flex-1 border border-[#cdd6f4] rounded-sm" />
          or
          <div className="flex-1 border border-[#cdd6f4] rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-y-8 justify-center items-center">
          {Object.values(providerMap).map((provider) => (
            <form
              className="text-center hover:bg-white hover:text-black transition-colors border flex rounded-md"
              key={provider.name}
              action={() => {}}
            >
              <button
                type={"submit"}
                disabled
                className={
                  "flex-1 flex gap-x-2 items-center w-full h-full py-2 px-6"
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
          ))}
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className={
              "bg-transparent border px-12 text-xl hover:text-black hover:bg-white transition-colors font-semibold text-white rounded-sm flex items-center justify-center gap-x-2 p-2 mt-4"
            }
          >
            I&#39;m already registered!
          </button>
        </div>
      </div>
      <div
        className={
          "fixed invisible lg:visible texl-5xl w-full brightness-[30%] -translate-y-16 select-none h-full -rotate-2"
        }
      />
    </main>
  );
}
