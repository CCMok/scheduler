'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput, rosterFilterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import DepartmentIdFormField from "./department-id-form-field"
import OrganizationIdFormField from "./organization-id-form-field"
import { useRosterFilterForm } from "./roster-filter-form-hook"
import FormSubmitButton from "@/components/form/form-submit-button"
import { DEFAULT_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant"
import DayCountFormField from "./day-count-form-field"
import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"

export default function RosterFilterForm() {
  const { defaultOrganizationId, defaultDepartmentId } = useRosterFilterForm();

  const form = useForm({
    resolver: zodResolver(rosterFilterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
      dayCount: DEFAULT_DAY_COUNT,
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
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-wrap space-x-4 space-y-4'>
            <OrganizationIdFormField />
            <DepartmentIdFormField />
            <DayCountFormField />
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <FormSubmitButton>確認</FormSubmitButton>
        </div>
      </form>
    </Form>
  )
}