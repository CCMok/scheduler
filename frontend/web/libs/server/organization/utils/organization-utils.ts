import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';
import { getOrgIdFilter } from '../../access/utils/data-access-utils';

export const getMaxHistoryCount = async (deptId: number): Promise<number | undefined> => {
  const id = await getOrgIdFilter(undefined);

  const entity = await prisma.organization.findFirst({
    where: {
      id,
      departments: {
        some: {
          id: deptId,
        },
      },
    },
    select: {
      maxHistoryCount: true,
    }
  })

  return isNil(entity?.maxHistoryCount) ? undefined : entity.maxHistoryCount;
}