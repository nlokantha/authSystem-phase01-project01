import { z } from "zod";


export const updateUserSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  content:z.string().min(2).max(100).optional()
}).strict();
