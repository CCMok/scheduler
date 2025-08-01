'use client'

import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action";
import useServerResponseHandler from "../../_general/hooks/server-response-handler-hook";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response";
import { ClientMessage } from "../../_general/models/client-message";
import { Post } from "@/external/prisma-generated";

export const useFetchPosts = (
  onSuccess: (response: SuccessResponse<Post[]>) => void | Promise<void>,
  onError: (response: ServerResponse<Post[]>, clientMessage: ClientMessage) => void | Promise<void>,
) => {
  const { handleServerResponse } = useServerResponseHandler();

  const fetchPosts = async (request: GetPostsRequest) => {
    const response = await getPostsAction(request)
    await handleServerResponse(response, onSuccess, onError)
  }

  return { fetchPosts }
}