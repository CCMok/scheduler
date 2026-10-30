'use client'

import { format, parse } from 'date-fns'
import { zhHK } from 'date-fns/locale'
import { X } from 'lucide-react'
import { Calendar } from '@/external/shadcn/components/ui/calendar'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { cn } from '@/external/shadcn/libs/utils'
import { useWorkspaceStore } from './workspace-store-provider'
import { timeslotsToDates } from '@/libs/roster/workspace/date-presets'

function timeslotToDate(name: string): Date | null {
  const parsed = parse(name, 'PP', new Date(), { locale: zhHK })
  if (!Number.isNaN(parsed.getTime())) return parsed
  const fallback = new Date(name)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

export default function DateBar() {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const setTimeslotsFromDates = useWorkspaceStore((s) => s.setTimeslotsFromDates)

  const selected = timeslotsToDates(timeslots)

  const removeTimeslot = (timeslotId: number) => {
    setTimeslotsFromDates(
      timeslotsToDates(timeslots.filter((t) => t.id !== timeslotId)),
    )
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
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
      <div
        className={cn(
          'flex min-h-48 min-w-56 flex-1 flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm',
          'lg:max-w-xs',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">
            已選{' '}
            <span className="tabular-nums text-foreground">
              {timeslots.length}
            </span>{' '}
            日
          </p>
          <CustomButton
            type="button"
            variant="ghost"
            disabled={timeslots.length === 0}
            onClick={() => setTimeslotsFromDates([])}
          >
            清除全部
          </CustomButton>
        </div>

        {timeslots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            點左方日曆加入值班日。
          </p>
        ) : (
          <ul
            role="list"
            className="flex max-h-64 flex-1 flex-col gap-1 overflow-auto pr-0.5"
          >
            {timeslots.map((t) => {
              const date = timeslotToDate(t.name)
              const weekday = date
                ? format(date, 'EEE', { locale: zhHK })
                : null

              return (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-md border border-border/80 bg-background px-2 py-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    {weekday ? (
                      <p className="text-xs text-muted-foreground">{weekday}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex size-7 shrink-0 items-center justify-center rounded-md',
                      'text-muted-foreground hover:bg-accent hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                    aria-label={`移除 ${t.name}`}
                    onClick={() => removeTimeslot(t.id)}
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
