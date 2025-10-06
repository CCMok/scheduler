'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreateOrganizationFormInput, createOrganizationFormInputSchema } from '@/libs/client/organization/models/create-organization-form-input';
import { Id } from '@/libs/server/_general/models/id';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import CreateOrganizationFields from './create-organization-fields';
import { createOrganizationAction } from '@/libs/server/organization/actions/create-organization-action';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';

export default function CreateOrganizationButton() {
  const form = useForm({
    resolver: zodResolver(createOrganizationFormInputSchema),
    defaultValues: {
      name: '',
    },
  })

  const router = useRouter();
      
  const submit = async (input: CreateOrganizationFormInput): Promise<ServiceResponse<Id>> => {
    return await createOrganizationAction({
      name: input.name,
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <CreateDialog
      entityName="組織"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreateOrganizationFields />
    </CreateDialog>
  )
}