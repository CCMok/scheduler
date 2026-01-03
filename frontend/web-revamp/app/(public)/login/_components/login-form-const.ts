import { Message } from "@/libs/_general/service/message";
import { z } from "zod";

export const FORM_ID = 'login-form';

export enum FORM_FIELD {
  EMAIL = 'email',
  PASSWORD = 'password',
}

export const formSchema = z.object({
  [FORM_FIELD.EMAIL]: z.email(Message.FORMAT_NOT_VALID),
  [FORM_FIELD.PASSWORD]: z.string().min(1, Message.REQUIRED),
})