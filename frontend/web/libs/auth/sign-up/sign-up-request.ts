import { emptyToUndefinedString } from "@/libs/_general/string/string-utils";
import z from "zod";

export const signUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  name: emptyToUndefinedString,
})

export type SignUpRequest = z.infer<typeof signUpRequestSchema>