'use client'

import { Calendar } from "@/external/shadcn/components/ui/calendar";
import { zhHK } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { format } from "date-fns";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { X } from "lucide-react";
import NextButton from "../next-button";
import { Dispatch, SetStateAction } from "react";

export default function TimeslotStep({
  setStep,
  timeslots,
  setTimeslots,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  timeslots: Date[],
  setTimeslots: (timeslots: Date[]) => void,
}>) {
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-6'>
        <Calendar
          mode='multiple'
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
          selected={timeslots}
          onSelect={(timeslots) => setTimeslots(timeslots?.toSorted((a, b) => a.getTime() - b.getTime()) ?? [])}
          locale={zhHK}
        />
        <div className='w-100 space-y-2'>
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
                <TableRow key={timeslot.toISOString()}>
                  <TableCell>{format(timeslot, 'PP', { locale: zhHK })}</TableCell>
                  <TableCell>
                    <CustomButton
                      variant="ghost"
                      size='icon-sm'
                      onClick={() => setTimeslots(timeslots.filter((t) => t !== timeslot))}
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
        <NextButton
          disabled={timeslots.length === 0}
          onClick={(e) => {
            e.preventDefault()
            setStep((step) => step + 1)
          }}
        />
      </div>
    </>
  )
}