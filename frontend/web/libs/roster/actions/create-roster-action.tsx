'use server'

import { CreateRosterRequest } from "../models/create-roster-request"
import { createRosterService } from "../services/create-roster-service"

export const createRosterAction = async (request: CreateRosterRequest) => 
  await createRosterService(request)