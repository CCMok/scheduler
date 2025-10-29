'use client'

import FormSubmitButton from '@/components/_general/form/form-submit-button'
import BasicFilter from "./basic/basic-filter"
import OffFilter from "./off/off-filter"
import FormRootMessage from '@/components/_general/form/form-root-message'
import { BrushCleaning, CalendarSync } from "lucide-react"
import CustomButton from '@/components/_general/button/custom-button'
import { useFormContext } from 'react-hook-form'
import { useArrangeRosterStore } from '../store/arrange-roster-store-provider'

export default function RosterFilter() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);
  const { reset } = useFormContext();

  return (
    <div className='space-y-4'>
      <BasicFilter />
      <OffFilter />

      <div className='flex justify-end gap-2'>
        <CustomButton variant='secondary' onClick={() => reset()}>
          <BrushCleaning />
          清除條件
        </CustomButton>

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