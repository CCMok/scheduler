import { z } from "zod";
import { idSchema } from "@/libs/_general/models/id";

export const sendEmailVerificationRequestSchema = z.object({
  userId: idSchema,
})

export type SendEmailVerificationRequest = z.infer<typeof sendEmailVerificationRequestSchema>