import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";

export const getPostsRequestSchema = z.object({
  departmentId: idSchema,
});

export type GetPostsRequest = z.infer<typeof getPostsRequestSchema>;

export const getGetPostsRequest = (formInput: PostSettingFormInput): GetPostsRequest => {  
  return {
    departmentId: Number(formInput.departmentId),
  };
}