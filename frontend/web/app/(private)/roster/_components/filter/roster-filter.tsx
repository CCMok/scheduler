'use client'

import FormSubmitButton from '@/components/_general/form/form-submit-button'
import BasicFilter from "./basic/basic-filter"
import OffFilter from "./off/off-filter"
import { useArrangeRosterStore } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider"
import FormRootMessage from '@/components/_general/form/form-root-message'
import { CalendarSync } from "lucide-react"

export default function RosterFilter() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);

  return (
    <div className='space-y-4'>
      <BasicFilter />
      <OffFilter />

      <div className='flex justify-end'>
        <FormSubmitButton
          icon={<CalendarSync />}
        >
          {isGenerated ? '重新編排' : '確認'}
        </FormSubmitButton>
      </div>

      <FormRootMessage />
    </div>
  )
}