import { z } from "zod";

const env = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: z
      .string({
        required_error: "NEXT_PUBLIC_SUPABASE_URL is required, but was missing",
      })
      .url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string({
      required_error:
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is required, but was missing",
    }),
    NODE_ENV: z.enum(["development", "production", "test"]),
  })
  .parse(process.env);

export default env;
