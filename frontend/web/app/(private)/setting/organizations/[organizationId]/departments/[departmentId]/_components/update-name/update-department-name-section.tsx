'use client'

import { Department } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input"
import { UpdateDepartmentNameRequest } from "@/libs/department/models/update-department-name-request"
import { updateDepartmentNameAction } from "@/libs/department/actions/update-department-name-action"
import { ServiceResponse } from "@/libs/_general/models/service-response"

type Props = {
  department: Department;
}

export default function UpdateDepartmentNameSection({
  department,
}: Readonly<Props>) {
  const submit = async (input: UpdateNameFormInput): Promise<ServiceResponse> => {
    const request: UpdateDepartmentNameRequest = {
      id: department.id,
      name: input.name,
    }

    return await updateDepartmentNameAction(request)
  }

  return (
    <UpdateNameLayout
      entityName="部門"
      originalName={department.name}
      submit={submit}
    />
  )
}