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
import { ServiceResponse, ServiceResponseStatus } from "@/libs/server/_general/models/service-response";
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
      console.error(`organizationId is not a number. organizationId: ${input.organizationId}`)
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
      title={'指派機構'}
      renderTrigger={onClick => (
        <CustomButton onClick={onClick}>
          <UserRoundPlus />
          指派機構
        </CustomButton>
      )}
    >
      <AssignOrganizationFields organizations={organizations} />
    </FormDialog>
  )
}