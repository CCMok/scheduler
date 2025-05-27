'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput, rosterFilterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormFieldDepartmentId from "./form-field-department-id"
import FormFieldOrganizationId from "./form-field-organization-id"
import { useRosterFilterForm } from "./roster-filter-form-hook"
import FormSubmitButton from "@/components/form/form-submit-button"

export default function RosterFilterForm() {
  const { defaultOrganizationId, defaultDepartmentId } = useRosterFilterForm();

  const form = useForm({
    resolver: zodResolver(rosterFilterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
    },
  })

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
          <FormFieldOrganizationId />
          <FormFieldDepartmentId />
        </div>

        <FormSubmitButton>確認</FormSubmitButton>
      </form>
    </Form>
  )
}