'use server';

import { actionWrapper } from "../../_general/actions/general-action";
import { GetWorkersRequest } from "../models/get-workers-request";
import { getWorkers } from "../services/get-workers-service";

export const getWorkersAction = async (request: GetWorkersRequest) =>
  await actionWrapper(async () => await getWorkers(request)); 