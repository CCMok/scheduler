'use server';

import { deleteRosterHistoryService } from "../services/delete-roster-history-service";

export const deleteRosterHistoryAction = async (id: number) =>
  await deleteRosterHistoryService(id)