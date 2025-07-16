'use client'

import { Form, FormField } from "@/external/shadcn/components/ui/form"
import { OrganizationSettingNameFormInput, organizationSettingNameFormInputSchema } from "@/libs/client/organization/models/organization-setting-name-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/external/shadcn/components/ui/card"
import CustomFormItem from "@/components/form/custom-form-item"
import FormSubmitButton from "@/components/form/form-submit-button"
import { Save } from "lucide-react"
import { Organization } from "@/external/prisma-generated"
import ComboBox from "@/components/combobox/combobox"
import OrganizationNameField from "./organization-name-field"
import { getDefaultOrganizationId } from "@/app/(private)/roster/_components/form/arrange-roster-form-utils"
import { ClientMessageContent, ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum"
import FormRootMessage from "@/components/form/form-root-message"

type Props = {
  organizations: Organization[];
}

export default function OrganizationSettingNameForm({
  organizations,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(organizationSettingNameFormInputSchema),
    defaultValues: {
      organizationId: getDefaultOrganizationId(organizations),
      name: '',
    }
  })

  const onSubmit = async (input: OrganizationSettingNameFormInput) => {
    const organizationId = form.getValues('organizationId')
    const isSameName = organizations.some(organization =>
      organization.id.toString() === organizationId
      && organization.name === input.name
    )

    if (isSameName) {
      form.setError('root', { 
        type: ClientMessageTitle.INPUT_ERROR,
        message: ClientMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
      });

      return;
    }

    // TODO
    // request server action

    // handle success / error
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>組織名稱</CardTitle>
            <CardDescription>
              這是您的組織在 Scheduler 中的可見名稱。例如: 您公司的名稱。
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap space-x-4 space-y-4'>
            <FormField
              control={form.control}
              name='organizationId'
              render={({ field }) => (
                <CustomFormItem>
                  <ComboBox
                    value={field.value}
                    options={organizations}
                    getValue={option => option.id.toString()}
                    getDisplayName={option => option.name}
                    onValueChange={value => form.setValue('organizationId', value)}
                    isFormField
                  />
                </CustomFormItem>
              )}
            />

            <OrganizationNameField organizations={organizations} />
          </CardContent>
          <CardFooter className='flex space-x-4'>
            <FormRootMessage />
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}