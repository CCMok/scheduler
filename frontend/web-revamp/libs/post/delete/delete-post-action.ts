'use server'

import { deletePost } from "./delete-post-service"

export const deletePostAction = async (id: number) =>
  await deletePost(id)