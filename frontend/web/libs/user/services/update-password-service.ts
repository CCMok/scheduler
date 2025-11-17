import 'server-only'
import { UpdatePasswordRequest, updatePasswordRequestSchema } from '../models/update-password-request';
import { getSession, setSession } from '../../access/managers/session-manager';
import { isNil } from 'lodash';
import prisma from '../../_general/managers/database-manager';
import { compare, hash } from 'bcryptjs';
import { SALT_ROUNDS } from '../../_general/constants/bcrypt-constant';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';
import { verifyToken } from '@/libs/_general/managers/jwt-manager';
import { UserWithRole } from '../models/user-dao';

export const updatePasswordService = tryCatch(async (
  request: UpdatePasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updatePasswordRequestSchema.parse(request)

  const userId = await getUserId(parsedRequest.token);
  if (isNil(userId)) return {
    status: ServiceResponseStatus.UNAUTHORIZED,
  }

  const user = await getUser(userId);
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const isSameWithPreviousPassword = await compare(parsedRequest.password, user.password)
  if (isSameWithPreviousPassword) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_MATCH.replaceAll('{0}', '舊密碼'),
  }

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  await execute(userId, encryptedPassword)

  if (parsedRequest.token) {
    await setSession(user)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const getUserId = async (token?: string): Promise<number | undefined> => {
  if (token) {
    const payload = await verifyToken(token);
    return payload?.userId;
  }

  const session = await getSession();
  return session?.userId;
}

const getUser = async (userId: number): Promise<UserWithRole | null> => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  })
}

const execute = async (id: number, password: string) =>
  await prisma.user.update({
    where: { id },
    data: { password },
  })
