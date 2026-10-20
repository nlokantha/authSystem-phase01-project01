import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(72),
  name:z.string().trim().min(1).max(100).optional()
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password:z.string().min(1).max(72)
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional()
}).default({})
