import { z } from "zod";

export const FORM_ID = 'update-post-workers-form';

export enum FORM_FIELD {
  WORKERS = 'workers',
}

/** Ordered worker ids — index 0 is most preferred. */
export const formSchema = z.object({
  [FORM_FIELD.WORKERS]: z.array(z.number()),
})
