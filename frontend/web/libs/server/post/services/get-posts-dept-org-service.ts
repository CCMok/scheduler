import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { GetPostsDeptOrgRequest, getPostsDeptOrgRequestSchema } from '../models/get-posts-dept-org-request';
import { PostDeptOrg } from '../models/post-dao';
import { getAccessibleDepartmentIdsService } from '../../access/services/data-access-service';
import { AccessResponse } from '../../access/models/access-response';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';

export const getPostsService = async (request: GetPostsDeptOrgRequest): Promise<ServiceResponse<PostDeptOrg[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsDeptOrgRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleDepartmentIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse

    const posts = await findPosts(parsedRequest, accessServiceResponse.data);

    return {
      status: ServiceResponseStatus.OK,
      data: posts,
    };
  })

const findPosts = async (request: GetPostsDeptOrgRequest, accessResponse: AccessResponse): Promise<PostDeptOrg[]> => {
  const posts = await prisma.post.findMany({
    where: {
      ...(isNil(request.where?.deptId) ? {} : { departmentId: request.where.deptId }),
      ...(isNil(request.where?.orgId) ? {} : { department: { organizationId: request.where.orgId } }),
    },
    include: {
      department: {
        include: { organization: true },
      }
    }
  })

  if (accessResponse.canAccessAll) return posts

  return posts.filter(post => accessResponse.ids.includes(post.departmentId))
}