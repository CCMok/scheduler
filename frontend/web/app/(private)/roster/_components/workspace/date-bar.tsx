'use client'

import {
  Children,
  createContext,
  isValidElement,
  use,
  type ComponentProps,
  type ReactNode,
  type ThHTMLAttributes,
} from 'react'
import { addDays, format, getDay, parse, startOfWeek } from 'date-fns'
import { zhHK } from 'date-fns/locale'
import { X } from 'lucide-react'
import { Calendar } from '@/external/shadcn/components/ui/calendar'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { cn } from '@/external/shadcn/libs/utils'
import { useWorkspaceStore } from './workspace-store-provider'
import {
  timeslotsToDates,
  toggleWeekdayInMonth,
} from '@/libs/roster/workspace/date-presets'

const MonthDateContext = createContext<Date | null>(null)
const WeekdayColumnContext = createContext(0)

function timeslotToDate(name: string): Date | null {
  const parsed = parse(name, 'PP', new Date(), { locale: zhHK })
  if (!Number.isNaN(parsed.getTime())) return parsed
  const fallback = new Date(name)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

function columnIndexToWeekday(columnIndex: number): number {
  return getDay(addDays(startOfWeek(new Date(), { locale: zhHK }), columnIndex))
}

function WeekdayHeader({
  children,
  className,
  style,
  'aria-label': weekdayLabel,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  const month = use(MonthDateContext)
  const columnIndex = use(WeekdayColumnContext)
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const setTimeslotsFromDates = useWorkspaceStore((s) => s.setTimeslotsFromDates)

  return (
    <th className={className} style={style} scope="col" {...props}>
      <button
        type="button"
        className={cn(
          'inline-flex size-full items-center justify-center rounded-md px-0.5 py-1',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        aria-label={
          weekdayLabel
            ? `選取或取消本月全部${weekdayLabel}`
            : '選取或取消本月該星期'
        }
        disabled={month == null}
        onClick={() => {
          if (month == null) return
          setTimeslotsFromDates(
            toggleWeekdayInMonth(
              timeslotsToDates(timeslots),
              month,
              columnIndexToWeekday(columnIndex),
            ),
          )
        }}
      >
        {children}
      </button>
    </th>
  )
}

function WeekdaysRow({
  children,
  ...props
}: { children?: ReactNode } & ComponentProps<'tr'>) {
  let columnIndex = 0
  return (
    <thead>
      <tr {...props}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          // Week number header (unused here) has no weekday aria-label pattern from DayPicker weekdays
          const index = columnIndex
          columnIndex += 1
          return (
            <WeekdayColumnContext key={index} value={index}>
              {child}
            </WeekdayColumnContext>
          )
        })}
      </tr>
    </thead>
  )
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
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      <Calendar
        mode="multiple"
        numberOfMonths={2}
        className="rounded-md border border-border/80 bg-background/50"
        selected={selected}
        onSelect={(dates) => {
          setTimeslotsFromDates(dates ?? [])
        }}
        locale={zhHK}
        classNames={{
          weekday: cn(
            'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
            'p-0',
          ),
        }}
        components={{
          Month: ({ calendarMonth, displayIndex: _displayIndex, ...props }) => (
            <MonthDateContext value={calendarMonth.date}>
              <div {...props} />
            </MonthDateContext>
          ),
          Weekdays: WeekdaysRow,
          Weekday: WeekdayHeader,
        }}
      />
      <div
        className={cn(
          'flex min-h-40 min-w-52 flex-1 flex-col gap-1.5 rounded-md border border-border/80 bg-background/50 p-2.5',
          'lg:max-w-xs',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            已選{' '}
            <span className="tabular-nums text-foreground">
              {timeslots.length}
            </span>{' '}
            日
          </p>
          <CustomButton
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            disabled={timeslots.length === 0}
            onClick={() => setTimeslotsFromDates([])}
          >
            清除
          </CustomButton>
        </div>

        {timeslots.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            點日曆選日；點星期標題可整月選／取消該曜日。
          </p>
        ) : (
          <ul
            role="list"
            className="flex max-h-56 flex-1 flex-col gap-0.5 overflow-auto pr-0.5"
          >
            {timeslots.map((t) => {
              const date = timeslotToDate(t.name)
              const weekday = date
                ? format(date, 'EEE', { locale: zhHK })
                : null

              return (
                <li
                  key={t.id}
                  className="flex items-center gap-1.5 rounded-sm px-1.5 py-1 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{t.name}</p>
                    {weekday ? (
                      <p className="text-[11px] text-muted-foreground">
                        {weekday}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex size-6 shrink-0 items-center justify-center rounded-sm',
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
