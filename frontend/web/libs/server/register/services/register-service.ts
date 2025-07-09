import 'server-only'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { RegisterRequest, registerRequestSchema } from '../models/register-request';
import prisma from '../../_general/managers/database-manager';
import { ServerMessage } from '../../_general/enums/server-message';
import { encrypt } from '../../_general/managers/bcrypt-manager';
import { DEFAULT_ROLE } from '../../role/constants/role-constant';
import { isNil } from 'lodash';
import { setSession } from '../../_general/managers/session-manager';
import { Role } from '@/libs/share/_general/enums/role';

export const register = async (request: RegisterRequest): Promise<ServerResponse> => {
  const parsedRequest = registerRequestSchema.parse(request);

  const user = await findUser(parsedRequest.email)
  if (user) return {
    status: ServerResponseStatus.BAD_REQUEST,
    message: ServerMessage.ALREADY_EXISTS.replaceAll('{0}', '電郵地址'),
  }

  const encryptedPassword = await encrypt(parsedRequest.password)

  const roleId = await findRoleId(DEFAULT_ROLE)
  if (isNil(roleId)) {
    console.error('Role not found. DEFAULT_ROLE_ENUM=', DEFAULT_ROLE)
    return {
      status: ServerResponseStatus.INTERNAL_ERROR,
    }
  }

  const userRole = await createUser(parsedRequest, encryptedPassword, roleId)

  await setSession(userRole)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const findUser = async (email: string) => (
  await prisma.user.findUnique({
    where: { email },
  })
)

const findRoleId = async (roleEnum: Role): Promise<number | undefined> => {
  const role = await prisma.role.findUnique({
    where: {
      enum: roleEnum,
    },
    select: {
      id: true,
    },
  })

  return role?.id;
}

const createUser = async (request: RegisterRequest, encryptedPassword: string, roleId: number) => (
  await prisma.user.create({
    data: {
      email: request.email,
      password: encryptedPassword,
      name: request.name,
      roleId,
    },
    include: {
      role: true,
    }
  })
)