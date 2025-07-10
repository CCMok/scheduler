'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput, arrangeRosterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { useMemo, useState } from "react"
import ArrangeRosterFormAlertDialog from "./arrange-roster-form-alert-dialog"
import useArrangeRosterForm from "./arrange-roster-form-hook"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"
import RosterFilter from "../filter/roster-filter"

export default function ArrangeRosterForm() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);
  const organizations = useArrangeRosterFilterStore(state => state.organizations);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { defaultOrganizationId, defaultDepartmentId } = useMemo(() => {
    const firstOrganization = organizations?.[0];
    const orgId = firstOrganization?.id?.toString() ?? '';
    const deptId = firstOrganization?.departments?.[0]?.id?.toString() ?? '';

    return {
      defaultOrganizationId: orgId,
      defaultDepartmentId: deptId,
    };
  }, [organizations]);

  const form = useForm({
    resolver: zodResolver(arrangeRosterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
      days: [],
      offs: [],
    },
  })

  const { submit } = useArrangeRosterForm({ setError: form.setError, getValues: form.getValues });

  const onSubmit = async (input: ArrangeRosterFormInput) => {
    if (isGenerated) {
      setIsAlertDialogOpen(true);
      return;
    }

    await submit(input);
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RosterFilter />
        <ArrangeRosterFormAlertDialog isOpen={isAlertDialogOpen} setIsOpen={setIsAlertDialogOpen} />
      </form>
    </Form>
  )
}