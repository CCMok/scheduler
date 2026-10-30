'use server'

import { revalidatePath } from 'next/cache'
import { CreateRosterRequest } from "./create-roster-request";
import { createRoster } from "./create-roster-service";
import { ROUTE } from '@/libs/_general/route/route-config'

export const createRosterAction = async (request: CreateRosterRequest) => {
  const response = await createRoster(request)
  if (response.isSuccess) {
    revalidatePath(ROUTE.private.roster.base())
  }
  return response
}
