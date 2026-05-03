import { z } from "zod";

export const FORM_ID = 'update-worker-posts-form';

export enum FORM_FIELD {
  POSTS = 'posts',
}

export const formSchema = z.object({
  [FORM_FIELD.POSTS]: z.array(z.number()),
})