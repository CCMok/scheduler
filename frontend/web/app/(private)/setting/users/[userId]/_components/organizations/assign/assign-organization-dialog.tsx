'use client'

import CustomButton from "@/components/_general/button/custom-button";
import FormDialog from "@/components/_general/dialog/form-dialog";
import { UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Organization } from "@/external/prisma-generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserOrganizationFormInput, createUserOrganizationFormInputSchema } from "@/libs/client/user-organization/models/create-user-organization-form-input";
import AssignOrganizationFields from "./assign-organization-fields";
import { useParams, useRouter } from "next/navigation";
import { Param } from "@/libs/share/_general/enums/param";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "@/libs/share/_general/enums/service-response-status";
import { createUserOrganizationAction } from "@/libs/server/user-organization/actions/create-user-organization-action";

type Props = {
  organizations: Organization[];
}

export default function AssignOrganizationDialog({
  organizations,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createUserOrganizationFormInputSchema),
    defaultValues: {
      organizationId: '',
    },
  })

  const router = useRouter()

  const params = useParams()
  const userId = Number(params[Param.USER_ID])
  if (isNaN(userId)) {
    console.error(`userId is not found. userId: ${userId}`)
    return <></>
  }

  const submit = async (input: CreateUserOrganizationFormInput): Promise<ServiceResponse> => {
    const organizationId = Number(input.organizationId)
    if (isNaN(organizationId)) {
      return {
        status: ServiceResponseStatus.INTERNAL_ERROR,
      }
    }

    return await createUserOrganizationAction({
      userId,
      organizationId,
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <FormDialog
      form={form}
      submit={submit}
      onSuccess={onSuccess}
      title={'指派組織'}
      renderTrigger={onClick => (
        <CustomButton onClick={onClick}>
          <UserRoundPlus />
          指派組織
        </CustomButton>
      )}
    >
      <AssignOrganizationFields organizations={organizations} />
    </FormDialog>
  )
}