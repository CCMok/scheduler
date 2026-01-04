import { z } from "zod";

export const sessionSchema = z.object({
  userId: z.number(),
  email: z.string(),
  name: z.string().optional(),
})

export type Session = z.infer<typeof sessionSchema>