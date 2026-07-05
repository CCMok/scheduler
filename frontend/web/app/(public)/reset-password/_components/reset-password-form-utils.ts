import { Message } from "@/libs/_general/service/message";
import { z } from "zod";

export const FORM_ID = 'reset-password-form';

export enum FORM_FIELD {
  EMAIL = 'email',
}

export const formSchema = z.object({
  [FORM_FIELD.EMAIL]: z.email(Message.FORMAT_NOT_VALID),
})