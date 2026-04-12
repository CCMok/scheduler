import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { UpdateUserNameRequest, updateUserNameRequestSchema } from './update-user-name-request'
import { createSession, getSession } from '@/libs/_general/session/session-manager'

export const updateUserName = tryCatch(async (request: UpdateUserNameRequest): Promise<ServiceResponse> => {
  const parsedRequest = updateUserNameRequestSchema.parse(request)

  const session = await getSession();
  if (!session) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const user = await getUser(session.userId);
  if (!user) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  if (user.name === parsedRequest.name) return {
    isSuccess: false,
    message: '名稱沒有更改',
  }

  const savedUser = await saveEntity(session.userId, parsedRequest.name);

  // update session with new data
  await createSession(savedUser);

  return {
    isSuccess: true,
  }
})

const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  })
}

const saveEntity = async (id: number, name?: string) => {
  return await prisma.user.update({
    where: { id },
    data: { name: name ?? null },
  })
}
