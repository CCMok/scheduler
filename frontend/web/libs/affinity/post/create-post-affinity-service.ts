import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  CreatePostAffinityRequest,
  createPostAffinityRequestSchema,
} from './create-post-affinity-request'

export const createPostAffinity = tryCatch(async (
  request: CreatePostAffinityRequest,
): Promise<ServiceResponse<{ id: number }>> => {
  const parsed = createPostAffinityRequestSchema.parse(request)
  const postIds = [...new Set(parsed.postIds)]

  if (postIds.length < 2) {
    return { isSuccess: false, message: '至少選擇兩個職位' }
  }

  const canAccess = await checkCanAccessTeam(parsed.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, teamId: true },
  })
  if (posts.length !== postIds.length) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職位') }
  }
  if (posts.some((p) => p.teamId !== parsed.teamId)) {
    return { isSuccess: false, message: '職位不屬於同一團隊' }
  }

  const created = await prisma.postAffinity.create({
    data: {
      teamId: parsed.teamId,
      members: {
        create: postIds.map((postId) => ({ postId })),
      },
    },
    select: { id: true },
  })

  return { isSuccess: true, data: created }
})
