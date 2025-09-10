import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { UpdateUserNameRequest, updateUserNameRequestSchema } from '../models/update-user-name-request';
import { getSession, refreshSession } from '../../_general/managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';

export const updateUserNameService = async (request: UpdateUserNameRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
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
