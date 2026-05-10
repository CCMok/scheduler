import { z } from "zod";

export const FORM_ID = 'update-worker-status-form';

export enum FORM_FIELD {
  STATUS = 'status',
}

export const formSchema = z.object({
  [FORM_FIELD.STATUS]: z.boolean(),
})