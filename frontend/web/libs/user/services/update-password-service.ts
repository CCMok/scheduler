import 'server-only'
import { UpdatePasswordRequest, updatePasswordRequestSchema } from '../models/update-password-request';
import { getSession } from '../../access/managers/session-manager';
import { isNil } from 'lodash';
import prisma from '../../_general/managers/database-manager';
import { compare, hash } from 'bcryptjs';
import { SALT_ROUNDS } from '../../_general/constants/bcrypt-constant';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';

export const updatePasswordService = tryCatch(async (
  request: UpdatePasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updatePasswordRequestSchema.parse(request)

  const userId = await getUserId();
  if (isNil(userId)) return {
    status: ServiceResponseStatus.UNAUTHORIZED,
  }

  const isSameWithPreviousPassword = await checkSameWithPreviousPassword(userId, parsedRequest.password)
  if (isSameWithPreviousPassword) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_MATCH.replaceAll('{0}', '舊密碼'),
  }

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  await execute(userId, encryptedPassword)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const getUserId = async (): Promise<number | undefined> => {
  const session = await getSession();
  return session?.userId;
}

const checkSameWithPreviousPassword = async (userId: number, password: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  })

  if (!user) return false;

  return await compare(password, user.password)
}

const execute = async (id: number, password: string) =>
  await prisma.user.update({
    where: { id },
    data: { password },
  })
