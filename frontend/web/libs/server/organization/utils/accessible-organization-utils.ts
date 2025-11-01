import 'server-only'
import { getSession } from "../../_general/managers/session-manager";
import { getAccessibleOrganizationService } from '../services/get-accessible-organization-service';
import { ServiceResponseStatus } from '../../_general/models/service-response';

export const filterAccessibleOrganization = async <T>(
  entities: T[], 
  getOrganizationId: (entity: T) => number,
): Promise<T[]> => {
  const session = await getSession()
  if (!session) return []

  const accessibleResponse = await getAccessibleOrganizationService(session.userId, session.roleEnum);
  if (accessibleResponse.status !== ServiceResponseStatus.OK) return []

  const accessibleOrganization = accessibleResponse.data
  
  const filteredEntities = entities.filter(entity => {
    if (accessibleOrganization.accessAll) return true
    const organzationId = getOrganizationId(entity)
    return accessibleOrganization.ids.includes(organzationId)
  })
  
  return filteredEntities
}