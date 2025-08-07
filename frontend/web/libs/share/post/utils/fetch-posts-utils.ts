import { Post } from "@/external/prisma-generated"
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action"
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"

export const fetchPosts = async (departmentId: number, onRoute: (path: string) => void): Promise<Post[]> => {
  const request: GetPostsRequest = {
    where: { departmentId },
    orderBy: [{ field: 'name' }],
  }

  const response = await getPostsAction(request)

  const uiResponse = handleServiceResponse(response, onRoute)
  if (!uiResponse.isSuccess) {
    console.error(`Failed to fetch posts. message title: ${uiResponse.message.title}, content: ${uiResponse.message.content}`)
    return []
  }

  return uiResponse.data
}