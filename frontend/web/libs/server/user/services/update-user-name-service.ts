import 'server-only'
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { UpdateUserNameRequest, updateUserNameRequestSchema } from '../models/update-user-name-request';
import { getSession, refreshSession } from '../../_general/managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';

export const updateUserName = async (request: UpdateUserNameRequest): Promise<ServerResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updateUserNameRequestSchema.parse(request)

    const session = await getSession();
    if (!session) return {
      status: ServerResponseStatus.UNAUTHORIZED,
    }

    await update(session.userId, parsedRequest.name)

    await refreshSession({
      ...session,
      name: parsedRequest.name,
    })

    return {
      status: ServerResponseStatus.OK,
      data: {},
    }
  })

const update = async (id: number, name?: string) =>
  await prisma.user.update({
    where: { id },
    data: { name: name ?? null },
  })
