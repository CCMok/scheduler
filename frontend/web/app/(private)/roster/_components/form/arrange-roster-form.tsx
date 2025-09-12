'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput, arrangeRosterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useArrangeRosterStore } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider"
import { useState } from "react"
import useArrangeRosterFormSubmit from "./arrange-roster-form-submit"
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider"
import RosterFilter from "../filter/roster-filter"
import { getDefaultDepartmentIdInOrganizations, getDefaultOrganizationId } from "../../../../../libs/client/organization/utils/organization-utils"
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant"
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog'
import ArrangeRosterFormDependencyHandler from "./arrange-roster-form-dependency-handler"

export default function ArrangeRosterForm() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);
  const organizations = useArrangeRosterFilterStore(state => state.organizations);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(arrangeRosterFormInputSchema),
    defaultValues: {
      organizationId: getDefaultOrganizationId(organizations),
      departmentId: getDefaultDepartmentIdInOrganizations(organizations),
      days: DEFAULT_DAYS,
      offs: [],
    },
  })

  const { submit } = useArrangeRosterFormSubmit({ setError: form.setError });

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
        <ConfirmDialog
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