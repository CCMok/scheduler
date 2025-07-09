import { RegisterFormInput } from "@/libs/client/register/models/register-form-input";
import { z } from "zod";
import { emptyToUndefinedString } from "../../_general/models/optional-string";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: emptyToUndefinedString,
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>

export const getRegisterRequest = ({
  email,
  password,
  name,
}: RegisterFormInput): RegisterRequest => ({
  email,
  password,
  name,
})