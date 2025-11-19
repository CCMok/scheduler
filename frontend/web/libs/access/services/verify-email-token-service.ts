import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { VerifyEmailTokenRequest, verifyEmailTokenRequestSchema } from '../models/verify-email-token-request';
import { VerifyEmailTokenResponse } from '../models/verify-email-token-response';
import { verifyToken } from '@/libs/_general/managers/jwt-manager';
import prisma from '@/libs/_general/managers/database-manager';
import { setSession } from '../managers/session-manager';
import { UserExcludePasswordWithRole } from '@/libs/user/models/user-dao';

export const verifyEmailTokenService = tryCatch(async (
  request: VerifyEmailTokenRequest,
): Promise<ServiceResponse<VerifyEmailTokenResponse>> => {
  const parsedRequest = verifyEmailTokenRequestSchema.parse(request);

  const payload = await verifyToken(parsedRequest.token)
  if (!payload) {
    console.log('Invalid token.')
    return {
      status: ServiceResponseStatus.OK,
      data: {
        isVerified: false,
      },
    }
  }

  const user = await getUser(payload.userId);
  if (!user) {
    console.log('User not found. userId=', payload.userId)
    return {
      status: ServiceResponseStatus.OK,
      data: {
        isVerified: false,
      },
    }
  }

  await updateUser(payload.userId);
  await setSession(user);

  return {
    status: ServiceResponseStatus.OK,
    data: {
      isVerified: true,
    },
  }
})

const getUser = async (id: number): Promise<UserExcludePasswordWithRole | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
    },
    omit: {
      password: true,
    },
  })
}

const updateUser = async (id: number): Promise<void> => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isEmailVerified: true,
    },
  })
}