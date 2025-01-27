import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});