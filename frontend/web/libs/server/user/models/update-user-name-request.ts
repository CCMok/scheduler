import { z } from "zod";
import { emptyToUndefinedString } from "../../_general/models/optional-string";
import { UpdateUserNameFormInput } from "@/libs/client/user/models/update-user-name-form-input";

export const updateUserNameRequestSchema = z.object({
  name: emptyToUndefinedString,
})

export type UpdateUserNameRequest = z.infer<typeof updateUserNameRequestSchema>

export const getUpdateUserNameRequest = ({
  name,
}: UpdateUserNameFormInput): UpdateUserNameRequest => ({
  name,
})