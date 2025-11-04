import 'server-only'
import { UpdateUserNameRequest, updateUserNameRequestSchema } from '../models/update-user-name-request';
import { getSession, refreshSession } from '../../access/managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const updateUserNameService = tryCatch(async (
  request: UpdateUserNameRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateUserNameRequestSchema.parse(request)

  const session = await getSession();
  if (!session) return {
    status: ServiceResponseStatus.UNAUTHORIZED,
  }

  await execute(session.userId, parsedRequest.name)

  await refreshSession({
    ...session,
    name: parsedRequest.name,
  })

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (id: number, name?: string) =>
  await prisma.user.update({
    where: { id },
    data: { name: name ?? null },
  })
