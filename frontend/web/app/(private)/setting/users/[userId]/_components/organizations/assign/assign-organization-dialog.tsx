'use client'

import CustomButton from "@/components/_general/button/custom-button";
import FormDialog from "@/components/_general/dialog/form-dialog";
import { UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Organization } from "@/external/prisma-generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserOrganizationFormInput, createUserOrganizationFormInputSchema } from "@/app/(private)/setting/users/[userId]/_components/organizations/assign/create-user-organization-form-input";
import AssignOrganizationFields from "./assign-organization-fields";
import { useRouter } from "next/navigation";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { createUserOrganizationAction } from "@/libs/user-organization/actions/create-user-organization-action";

type Props = {
  organizations: Organization[];
  userId: number;
}

export default function AssignOrganizationDialog({
  organizations,
  userId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createUserOrganizationFormInputSchema),
    defaultValues: {
      organizationId: undefined,
    },
  })

  const router = useRouter()

  const submit = async (input: CreateUserOrganizationFormInput): Promise<ServiceResponse> => {
    return await createUserOrganizationAction({
      userId,
      organizationId: input.organizationId,
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
      title='指派機構'
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