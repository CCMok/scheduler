'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { useParams, useRouter } from "next/navigation";
import { PATH } from '@/libs/share/_general/utils/path';
import { Param } from '@/libs/share/_general/enums/param';
import { Id } from '@/libs/server/_general/models/id';
import { CreateDepartmentFormInput, createDepartmentFormInputSchema } from '@/libs/client/department/models/create-department-form-input';
import CreateDepartmentFields from './create-department-fields';
import { createDepartmentAction } from '@/libs/server/department/actions/create-department-action';

export default function CreateDepartmentButton() {
  const form = useForm({
    resolver: zodResolver(createDepartmentFormInputSchema),
    defaultValues: {
      name: '',
    },
  })

  const router = useRouter();

  const params = useParams();
  const orgId = Number(params[Param.ORG_ID]);

  if (isNaN(orgId)) {
    console.error(`orgId is not found. orgId: ${orgId}`)
    return <></>
  }

  const submit = async (input: CreateDepartmentFormInput): Promise<ServiceResponse<Id>> => {
    return await createDepartmentAction({
      organizationId: orgId,
      name: input.name,
    })
  }

  const onSuccess = (id: Id) => {
    router.push(PATH.setting.organizations.departments.build(orgId, id))
  }

  return (
    <CreateDialog
      entityName="部門"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreateDepartmentFields />
    </CreateDialog>
  )
}