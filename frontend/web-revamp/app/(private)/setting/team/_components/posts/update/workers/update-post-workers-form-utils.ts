import { z } from "zod";

export const FORM_ID = 'update-post-workers-form';

export enum FORM_FIELD {
  WORKERS = 'workers',
}

export const formSchema = z.object({
  [FORM_FIELD.WORKERS]: z.array(z.number()),
})