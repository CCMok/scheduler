'use server'

import { UpdateDepartmentConstraintRequest } from "../models/update-department-constraint-request"
import { updateDepartmentConstraintService } from "../services/update-department-constraint-service"

export const updateDepartmentConstraintAction = async (request: UpdateDepartmentConstraintRequest) => 
  await updateDepartmentConstraintService(request)