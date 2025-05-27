'use client'

import LoadingButton from "@/components/button/loading-button"
import ComboBox from "@/components/combobox/combobox"
import FormItemCustom from "@/components/form/form-item-custom"
import { Form, FormField } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput, rosterFilterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { getDefaultDepartmentId, getDefaultOrganizationId } from "./roster-filter-form-utils"
import { useEffect, useMemo } from "react"

type Props = {
  organizationDepartments: OrganizationDepartments[],
}

export default function RosterFilterForm({
  organizationDepartments,
}: Readonly<Props>) {
  const defaultOrganizationId = useMemo(
    () => getDefaultOrganizationId(organizationDepartments),
    [organizationDepartments]
  )

  const defaultDepartmentId = useMemo(
    () => getDefaultDepartmentId(organizationDepartments, defaultOrganizationId),
    [organizationDepartments, defaultOrganizationId]
  )

  const form = useForm({
    resolver: zodResolver(rosterFilterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
    },
  })

  const organizationId = useWatch({
    control: form.control,
    name: 'organizationId',
    defaultValue: defaultOrganizationId,
  })

  const departments = useMemo(() => {
    const organization = organizationDepartments.find(org => org.id.toString() === organizationId)
    return organization ? organization.departments : []
  }, [organizationDepartments, organizationId])

  useEffect(() => {
    const departmentId = departments.length ? departments[0].id.toString() : ''
    form.setValue('departmentId', departmentId)
  }, [departments, form])

  const onSubmit = async (input: RosterFilterFormInput) => {
    console.log(input)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex space-x-4'>
          <FormField
            control={form.control}
            name='organizationId'
            render={({ field }) => (
              <FormItemCustom label='機構'>
                <ComboBox
                  value={field.value}
                  items={organizationDepartments}
                  getValue={item => item.id.toString()}
                  getDisplayName={item => item.name}
                  onSelect={value => form.setValue('organizationId', value)}
                />
              </FormItemCustom>
            )}
          />
          <FormField
            control={form.control}
            name='departmentId'
            render={({ field }) => (
              <FormItemCustom label='部門'>
                <ComboBox
                  value={field.value}
                  items={departments}
                  getValue={item => item.id.toString()}
                  getDisplayName={item => item.name}
                  onSelect={value => form.setValue('departmentId', value)}
                />
              </FormItemCustom>
            )}
          />
        </div>
        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          提交
        </LoadingButton>
      </form>
    </Form>
  )
}