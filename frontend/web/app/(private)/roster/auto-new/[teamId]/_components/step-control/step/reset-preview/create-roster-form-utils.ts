import { Message } from "@/libs/_general/service/message";
import { z } from "zod";

export const FORM_ID = 'create-roster-form';

export enum FORM_FIELD {
  NAME = 'name',
}

export const formSchema = z.object({
  [FORM_FIELD.NAME]: z.string().min(1, Message.REQUIRED),
})

export type FormInput = z.infer<typeof formSchema>;