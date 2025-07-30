'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput, arrangeRosterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { useMemo, useState } from "react"
import useArrangeRosterForm from "./arrange-roster-form-hook"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"
import RosterFilter from "../filter/roster-filter"
import { getDefaultDepartmentIdInOrganizations, getDefaultOrganizationId } from "./arrange-roster-form-utils"
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant"
import WarningDialog from "@/components/dialog/warning-dialog"
import ArrangeRosterFormDependencyHandler from "./arrange-roster-form-dependency-handler"

export default function ArrangeRosterForm() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);
  const organizations = useArrangeRosterFilterStore(state => state.organizations);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { defaultOrganizationId, defaultDepartmentId } = useMemo(() => {
    const defaultOrganizationId = getDefaultOrganizationId(organizations);
    const defaultDepartmentId = getDefaultDepartmentIdInOrganizations(organizations);

    return {
      defaultOrganizationId,
      defaultDepartmentId,
    };
  }, [organizations]);

  const form = useForm({
    resolver: zodResolver(arrangeRosterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
      days: DEFAULT_DAYS,
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

  const onAlertDialogContinue = async () => await submit(form.getValues())

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ArrangeRosterFormDependencyHandler />
        <RosterFilter />
        <WarningDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要重新編排值班表嗎?'
          description='重新編排將會覆蓋現有的值班表，沒有儲存的資料將會遺失，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form>
  )
}