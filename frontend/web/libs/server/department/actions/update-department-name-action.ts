'use server'

import { UpdateDepartmentNameRequest } from "../models/update-department-name-request"
import { updateDepartmentNameService } from "../services/update-department-name-service"

export const updateDepartmentNameAction = async (request: UpdateDepartmentNameRequest) => 
  await updateDepartmentNameService(request)