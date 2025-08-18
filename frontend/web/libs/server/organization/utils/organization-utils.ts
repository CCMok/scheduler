import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';
import { getAccessibleOrganizationIdsService } from '../../access/services/access-service';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { AccessResponse } from '../../access/models/access-response';

export const getMaxHistoryCount = async (departmentId: number): Promise<number | undefined> => {
  const accessResponse = await getAccessibleOrganizationIdsService();
  if (accessResponse.status !== ServiceResponseStatus.OK) return;

  const idFilter = getIdFilter(accessResponse.data);

  const organization = await prisma.organization.findFirst({
    where: {
      id: idFilter,
      departments: {
        some: {
          id: departmentId,
        },
      },
    },
    select: {
      maxHistoryCount: true,
    }
  })

  return isNil(organization?.maxHistoryCount) ? undefined : organization.maxHistoryCount;
}

const getIdFilter = (accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) return;

  return { in: accessResponse.ids }
}