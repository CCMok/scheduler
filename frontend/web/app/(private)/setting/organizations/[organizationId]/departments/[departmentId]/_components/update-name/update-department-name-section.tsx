'use client'

import { Department } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input"
import { UpdateDepartmentNameRequest } from "@/libs/department/models/update-department-name-request"
import { updateDepartmentNameAction } from "@/libs/department/actions/update-department-name-action"
import { ServiceResponse } from "@/libs/_general/models/service-response"
import { use } from "react"
import { notFound } from "next/navigation"

type Props = {
  departmentPromise: Promise<Department | undefined>;
}

export default function UpdateDepartmentNameSection({
  departmentPromise,
}: Readonly<Props>) {
  const department = use(departmentPromise);
  if (!department) notFound();

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