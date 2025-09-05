'use client'

import { Department } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/client/setting/models/update-name-form-input"
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import { UpdateDepartmentNameRequest } from "@/libs/server/department/models/update-department-name-request"
import { updateDepartmentNameAction } from "@/libs/server/department/actions/update-department-name-action"

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