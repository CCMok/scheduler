'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput, arrangeRosterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DEFAULT_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant"
import { useRosterStore } from "@/components/store/roster/roster-store-provider"
import { useMemo, useState } from "react"
import ArrangeRosterFormAlertDialog from "./arrange-roster-form-alert-dialog"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"
import useArrangeRosterForm from "./arrange-roster-form-hook"

export default function ArrangeRosterForm({ children }: Readonly<ChildrenProps>) {
  const { organizations, isGenerated } = useRosterStore(state => state);

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
      dayCount: DEFAULT_DAY_COUNT,
      offs: [],
    },
  })

  const { submit } = useArrangeRosterForm({ setError: form.setError });

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
        {children}
        <ArrangeRosterFormAlertDialog isOpen={isAlertDialogOpen} setIsOpen={setIsAlertDialogOpen} />
      </form>
    </Form>
  )
}