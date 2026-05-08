import { Message } from "@/libs/_general/service/message";
import { z } from "zod";

export const FORM_ID = 'create-worker-name-form';

export enum FORM_FIELD {
  NAME = 'name',
  POSTS = 'posts',
}

export const formSchema = z.object({
  [FORM_FIELD.NAME]: z.string().min(1, Message.REQUIRED),  
  [FORM_FIELD.POSTS]: z.array(z.number()),
})