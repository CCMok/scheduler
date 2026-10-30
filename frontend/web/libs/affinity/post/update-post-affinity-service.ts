import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  UpdatePostAffinityRequest,
  updatePostAffinityRequestSchema,
} from './update-post-affinity-request'

export const updatePostAffinity = tryCatch(async (
  request: UpdatePostAffinityRequest,
): Promise<ServiceResponse> => {
  const parsed = updatePostAffinityRequestSchema.parse(request)
  const postIds = [...new Set(parsed.postIds)]

  if (postIds.length < 2) {
    return { isSuccess: false, message: '至少選擇兩個職位' }
  }

  const affinity = await prisma.postAffinity.findUnique({
    where: { id: parsed.id },
    select: { id: true, teamId: true },
  })
  if (!affinity) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職位搭配組') }
  }

  const canAccess = await checkCanAccessTeam(affinity.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, teamId: true },
  })
  if (posts.length !== postIds.length) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職位') }
  }
  if (posts.some((p) => p.teamId !== affinity.teamId)) {
    return { isSuccess: false, message: '職位不屬於同一團隊' }
  }

  await prisma.$transaction(async (tx) => {
    await tx.postAffinityMember.deleteMany({ where: { postAffinityId: parsed.id } })
    await tx.postAffinityMember.createMany({
      data: postIds.map((postId) => ({
        postAffinityId: parsed.id,
        postId,
      })),
    })
  })

  return { isSuccess: true }
})
