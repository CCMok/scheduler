'use server';

import { DeleteRosterHistoryRequest } from "../models/delete-roster-history-request";
import { deleteRosterHistoryService } from "../services/delete-roster-history-service";

export const deleteRosterHistoryAction = async (request: DeleteRosterHistoryRequest) =>
  await deleteRosterHistoryService(request)