'use client'

import FormSubmitButton from "@/components/form/form-submit-button"
import BasicFilter from "./basic/basic-filter"
import OffFilter from "./off/off-filter"
import { useRosterStore } from "@/components/store/roster/roster-store-provider"
import FormRootMessage from "@/components/form/form-root-message"
import { CalendarSync } from "lucide-react"

export default function RosterFilter() {
  const { isGenerated } = useRosterStore(state => state);

  return (
    <div className='space-y-4'>
      <BasicFilter />
      <OffFilter />

      <div className='flex justify-end'>
        <FormSubmitButton
          icon={<CalendarSync />}
        >
          {isGenerated ? '重新生成' : '確認'}
        </FormSubmitButton>
      </div>

      <FormRootMessage />
    </div>
  )
}