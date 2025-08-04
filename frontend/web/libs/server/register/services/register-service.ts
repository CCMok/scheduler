import 'server-only'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { RegisterRequest, registerRequestSchema } from '../models/register-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { DEFAULT_ROLE } from '../../role/constants/role-constant';
import { setSession } from '../../_general/managers/session-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { hash } from 'bcryptjs';
import { SALT_ROUNDS } from '../../_general/constants/bcrypt-constant';
import { serviceWrapper } from '../../_general/services/general-service';

export const register = async (request: RegisterRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = registerRequestSchema.parse(request);

    const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

    const createResult = await createUser(parsedRequest, encryptedPassword)
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    await setSession(createResult.data)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const createUser = async (request: RegisterRequest, password: string) =>
  await tryCatchQuery(async () =>
    await prisma.user.create({
      data: {
        email: request.email,
        password,
        name: request.name,
        role: {
          connect: { enum: DEFAULT_ROLE },
        },
      },
      include: { role: true },
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('email')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '電郵地址'),
      }
    }
  }

  throw error;
}