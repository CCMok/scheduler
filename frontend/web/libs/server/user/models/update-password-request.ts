import { z } from "zod";
import { UpdatePasswordFormInput } from "@/libs/client/user/models/update-pasword-form-input";

export const updatePasswordRequestSchema = z.object({
  password: z.string().min(1),
})

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;

export const getUpdatePasswordRequest = (formInput: UpdatePasswordFormInput): UpdatePasswordRequest => ({
  password: formInput.password,
})