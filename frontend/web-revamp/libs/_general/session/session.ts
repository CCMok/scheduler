import { z } from "zod";

export const sessionPayloadSchema = z.object({
  userId: z.number(),
  email: z.string(),
  name: z.string().optional(),
  role: z.number(),
})

export type SessionPayload = z.infer<typeof sessionPayloadSchema>