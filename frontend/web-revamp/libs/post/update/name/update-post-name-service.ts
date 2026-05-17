import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessPost } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { UpdatePostNameRequest, updatePostNameRequestSchema } from './update-post-name-request'

export const updatePostName = tryCatch(async (request: UpdatePostNameRequest): Promise<ServiceResponse> => {
  const parsedRequest = updatePostNameRequestSchema.parse(request)

  const canAccess = await checkCanAccessPost(parsedRequest.id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const post = await getPost(parsedRequest.id)
  if (!post) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
  }

  if (post.name === parsedRequest.name) return {
    isSuccess: false,
    message: `名稱${Message.NOT_CHANGE}`,
  }

  return await saveEntity(parsedRequest);
})

const getPost = async (id: number) => {
  return await prisma.post.findUnique({
    where: { id },
  })
}

const saveEntity = async (request: UpdatePostNameRequest): Promise<ServiceResponse> => {
  try {
    await prisma.post.update({
      where: { id: request.id },
      data: { name: request.name },
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION, () => ({
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '名稱'),
      })],
    ]))
  }

  return {
    isSuccess: true,
  }
}