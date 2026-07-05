import { z } from "zod";

export const FORM_ID = 'update-post-status-form';

export enum FORM_FIELD {
  STATUS = 'status',
}

export const formSchema = z.object({
  [FORM_FIELD.STATUS]: z.boolean(),
})