'use client'

import { Organization } from "@/external/prisma-generated"
import { updateOrganizationNameAction } from "@/libs/organization/actions/update-organization-name-action"
import { UpdateOrganizationNameRequest } from "@/libs/organization/models/update-organization-name-request"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input"
import { ServiceResponse } from "@/libs/_general/models/service-response"

type Props = {
  organization: Organization;
}

export default function UpdateOrganizationNameSection({
  organization,
}: Readonly<Props>) {
  const submit = async (input: UpdateNameFormInput): Promise<ServiceResponse> => {
    const request: UpdateOrganizationNameRequest = {
      id: organization.id,
      name: input.name,
    }

    return await updateOrganizationNameAction(request)
  }

  return (
    <UpdateNameLayout
      entityName="機構"
      originalName={organization.name}
      submit={submit}
    />
  )
}