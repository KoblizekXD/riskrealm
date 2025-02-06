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

export interface User {
  id: string;
  username: string;
  tickets: number;
  email: string;
  gems: number;
  description?: string;
  avatar_url?: string;
  created_at: string;
  streak: number;
}
