import 'server-only'
import { RegisterRequest, registerRequestSchema } from '../models/register-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { hash } from 'bcryptjs';
import { SALT_ROUNDS } from '../../_general/constants/bcrypt-constant';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';
import { DEFAULT_ROLE } from '../../role/enums/role';
import { RegisterResponse } from '../models/register-response';
import { sendVerificationEmail } from '../utils/email-verification-utils';

export const registerService = tryCatch(async (
  request: RegisterRequest,
): Promise<ServiceResponse<RegisterResponse>> => {
  const parsedRequest = registerRequestSchema.parse(request);

  const encryptedPassword = await hash(parsedRequest.password, SALT_ROUNDS)

  const createResult = await createUser(parsedRequest, encryptedPassword)
  if (!createResult.isSuccess) {
    return handleQueryError(createResult.error)
  }

  const emailSent = await sendVerificationEmail(createResult.data)
  if (!emailSent) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {
      userId: createResult.data.id,
    },
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
        isEmailVerified: false,
      },
      include: {
        role: true,
      },
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<RegisterResponse> => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('email')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: MessageContent.ALREADY_USED.replaceAll('{0}', '電郵地址'),
      }
    }
  }

  throw error;
}