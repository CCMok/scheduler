import 'server-only'
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { UpdatePasswordRequest, updatePasswordRequestSchema } from '../models/update-password-request';
import { getSession } from '../../_general/managers/session-manager';
import { isNil } from 'lodash';
import prisma from '../../_general/managers/database-manager';
import { compare, hash } from 'bcryptjs';
import { ServerMessage } from '../../_general/enums/server-message';
import { SALT_ROUNDS } from '../../_general/constants/bcrypt-constant';

export const updatePassword = async (request: UpdatePasswordRequest): Promise<ServerResponse> => {
  const parsedRequest = updatePasswordRequestSchema.parse(request)

  const userId = await getUserId();
  if (isNil(userId)) return {
    status: ServerResponseStatus.UNAUTHORIZED,
  }

  const isSameWithPreviousPassword = await checkSameWithPreviousPassword(userId, parsedRequest.password)
  if (isSameWithPreviousPassword) return {
    status: ServerResponseStatus.BAD_REQUEST,
    message: ServerMessage.NOT_MATCH.replaceAll('{0}', '舊密碼'),
  }

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  await update(userId, encryptedPassword)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

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

const update = async (id: number, password: string) =>
  await prisma.user.update({
    where: { id },
    data: { password },
  })
