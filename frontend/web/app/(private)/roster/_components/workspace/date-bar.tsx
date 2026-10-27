'use client'

import { Calendar } from '@/external/shadcn/components/ui/calendar'
import { zhHK } from 'date-fns/locale'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { useWorkspaceStore } from './workspace-store-provider'
import { timeslotsToDates } from '@/libs/roster/workspace/date-presets'

export default function DateBar() {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const setTimeslotsFromDates = useWorkspaceStore((s) => s.setTimeslotsFromDates)

  const selected = timeslotsToDates(timeslots)

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
      <Calendar
        mode="multiple"
        numberOfMonths={2}
        className="rounded-lg border bg-card shadow-sm"
        selected={selected}
        onSelect={(dates) => {
          setTimeslotsFromDates(dates ?? [])
        }}
        locale={zhHK}
      />
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          已選 {timeslots.length} 日
        </p>
        <CustomButton
          type="button"
          variant="ghost"
          onClick={() => setTimeslotsFromDates([])}
        >
          清除日期
        </CustomButton>
        <ul className="max-h-48 overflow-auto text-sm">
          {timeslots.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
