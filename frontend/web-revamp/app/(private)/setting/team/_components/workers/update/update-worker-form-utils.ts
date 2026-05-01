import { z } from "zod";

export const FORM_ID = 'update-worker-form';

export enum FORM_FIELD {
  NAME = 'name',
}

export const formSchema = z.object({
  [FORM_FIELD.NAME]: z.string(),
})