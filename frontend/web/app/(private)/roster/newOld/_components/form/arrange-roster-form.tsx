'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { ArrangeRosterFormInput, arrangeRosterFormInputSchema, arrangeRosterFormInputStorageSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import useArrangeRosterFormSubmit from "./arrange-roster-form-submit"
import RosterFilter from "../filter/roster-filter"
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant"
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog'
import ArrangeRosterFormDependencyHandler from "./arrange-roster-form-dependency-handler"
import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { useArrangeRosterStore } from "../store/arrange-roster-store-provider"
import { useArrangeRosterFilterStore } from "../filter/store/arrange-roster-filter-store-provider"
import { getDefaultDepartmentIdInOrganizations, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils"

export default function ArrangeRosterForm() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);
  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  const setByPassDependencyReset = useArrangeRosterFilterStore(state => state.setByPassDependencyReset);

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

  useEffect(() => {
    const subscription = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        localStorage.setItem(LocalStorageKey.ARRANGE_ROSTER_FORM, JSON.stringify(values))
      },
    })
    return () => subscription()
  }, [form])

  const firstRendered = useRef<boolean>(false)

  useEffect(() => {
    if (firstRendered.current) return
    firstRendered.current = true

    const localStorageValueString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_FORM)
    if (!localStorageValueString) return

    const localStorageValue = JSON.parse(localStorageValueString)
    const deserialized = {
      ...localStorageValue,
      days: localStorageValue.days.map((day: string) => new Date(day)),
    }

    const parseResult = arrangeRosterFormInputStorageSchema.safeParse(deserialized)
    if (!parseResult.success) {
      console.error("Invalid localStorage value", parseResult.error.format())
      return
    }

    setByPassDependencyReset(true)
    form.reset(parseResult.data, { keepDefaultValues: true })

    setTimeout(() => {
      setByPassDependencyReset(false)
    }, 0)
  }, [form, setByPassDependencyReset])

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