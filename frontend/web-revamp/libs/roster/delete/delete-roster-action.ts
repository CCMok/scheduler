'use server'

import { deleteRoster } from "./delete-roster-service";

export const deleteRosterAction = async (id: number) =>
  await deleteRoster(id)