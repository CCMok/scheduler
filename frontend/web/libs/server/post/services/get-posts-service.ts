import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { getSession } from "../../_general/managers/session-manager";
import { Role } from "@/libs/share/_general/enums/role";
import { Post } from "@/external/prisma-generated";

export const getPosts = async (request: GetPostsRequest): Promise<ServerResponse<Post[]>> => {
  const parsedRequest = getPostsRequestSchema.parse(request);
  
  const sessionPayload = await getSession();
  if (!sessionPayload) {
    return {
      status: ServerResponseStatus.UNAUTHORIZED,
    };
  }

  const whereClause: any = {};

  // Filter by department if provided (required)
  if (parsedRequest.departmentId) {
    whereClause.departmentId = parsedRequest.departmentId;
  } else {
    // No department selected, return empty array
    return {
      status: ServerResponseStatus.OK,
      data: [],
    };
  }

  // Filter by organization through department relationship
  if (parsedRequest.organizationId) {
    whereClause.department = {
      organizationId: parsedRequest.organizationId,
    };
  }

  // Apply session-based access control
  if (sessionPayload.roleEnum !== Role.SYSTEM_ADMIN) {
    whereClause.department = {
      ...whereClause.department,
      organization: {
        userOrganizations: {
          some: {
            userId: sessionPayload.userId,
          },
        },
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    include: {
      department: {
        include: {
          organization: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return {
    status: ServerResponseStatus.OK,
    data: posts,
  };
}; 