import { RegisterFormInput } from "@/libs/client/register/models/register-form-input";
import { z } from "zod";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>

export const getRegisterRequest = ({ 
  email,
  password,
}: RegisterFormInput): RegisterRequest => ({
  email,
  password,
})