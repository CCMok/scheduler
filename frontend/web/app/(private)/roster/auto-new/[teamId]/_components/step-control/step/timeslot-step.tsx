'use client'

import { Calendar } from "@/external/shadcn/components/ui/calendar";
import { zhHK } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { ChevronRight, X } from "lucide-react";
import { formatDate } from "@/libs/_general/date/date-utils";
import { useAutoNewRosterStore } from "./store/auto-new-roster-store-provider";

export default function TimeslotStep() {
  const nextStep = useAutoNewRosterStore(state => state.nextStep)
  const timeslots = useAutoNewRosterStore(state => state.timeslots)
  const setTimeslots = useAutoNewRosterStore(state => state.setTimeslots)
  return (
    <div className='space-y-4'>
      <div className='flex flex-col lg:flex-row items-center lg:items-stretch gap-6'>
        <div>
          <Calendar
            mode='multiple'
            numberOfMonths={2}
            className="rounded-lg border shadow-sm bg-card"
            selected={timeslots.map((timeslot) => new Date(timeslot.name))}
            onSelect={(timeslots) => {
              if (!timeslots) {
                setTimeslots([])
                return
              }
              setTimeslots(timeslots
                .toSorted((a, b) => a.getTime() - b.getTime())
                .map((timeslot, i) => ({
                  id: i,
                  name: formatDate(timeslot)
                }))
              )
            }}
            locale={zhHK}
          />
        </div>
        <div className='w-full lg:w-100 space-y-2'>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              已選擇 {timeslots.length} 個時段
            </span>
            <CustomButton
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setTimeslots([])}
            >
              清除全部
            </CustomButton>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>時段</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeslots.map((timeslot) => (
                <TableRow key={timeslot.id}>
                  <TableCell>{timeslot.name}</TableCell>
                  <TableCell>
                    <CustomButton
                      variant="ghost"
                      size='icon-sm'
                      onClick={() => setTimeslots(timeslots.filter((t) => t.id !== timeslot.id))}
                    >
                      <X />
                    </CustomButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className='flex'>
        <CustomButton
          className='ml-auto'
          disabled={timeslots.length === 0}
          onClick={(e) => {
            e.preventDefault()
            nextStep()
          }}
        >
          下一步
          <ChevronRight />
        </CustomButton>
      </div>
    </div>
  )
}