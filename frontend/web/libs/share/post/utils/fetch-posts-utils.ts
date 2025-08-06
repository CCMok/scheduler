import { Post } from "@/external/prisma-generated"
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action"
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "../../../client/_general/constants/sonnar-constant"

export const fetchPosts = async (departmentId: number, onRoute: (path: string) => void): Promise<Post[]> => {
  const request: GetPostsRequest = {
    departmentId,
  }

  const response = await getPostsAction(request)

  const uiResponse = handleServiceResponse(response, onRoute)
  if (!uiResponse.isSuccess) {
    toast.error(uiResponse.message.title, {
      ...SONNER_DEFAULT_OPTIONS,
      description: uiResponse.message.content,
    })

    return []
  }

  return uiResponse.data
}