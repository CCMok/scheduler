import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';

export const getMaxHistoryCount = async (departmentId: number): Promise<number | undefined> => {
  const organization = await prisma.organization.findFirst({
    where: {
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