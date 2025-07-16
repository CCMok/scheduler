import 'server-only'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { RegisterRequest, registerRequestSchema } from '../models/register-request';
import prisma from '../../_general/managers/database-manager';
import { ServerMessage } from '../../_general/enums/server-message';
import { encrypt } from '../../_general/managers/bcrypt-manager';
import { DEFAULT_ROLE } from '../../role/constants/role-constant';
import { setSession } from '../../_general/managers/session-manager';
import { tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';

export const register = async (request: RegisterRequest): Promise<ServerResponse> => {
  const parsedRequest = registerRequestSchema.parse(request);

  const encryptedPassword = await encrypt(parsedRequest.password)

  const createResult = await createUser(parsedRequest, encryptedPassword)
  if (!createResult.isSuccess) {
    return handleQueryError(createResult.error)
  }

  await setSession(createResult.data)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const createUser = async (request: RegisterRequest, encryptedPassword: string) =>
  await tryCatchQuery(async () =>
    await prisma.user.create({
      data: {
        email: request.email,
        password: encryptedPassword,
        name: request.name,
        role: {
          connect: { enum: DEFAULT_ROLE },
        },
      },
      include: {
        role: true,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServerResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = error.meta?.target as string[] | undefined;

    if (target?.includes('email')) {
      return {
        status: ServerResponseStatus.BAD_REQUEST,
        message: ServerMessage.ALREADY_USED.replaceAll('{0}', '電郵地址'),
      }
    }
  }

  throw error;
}