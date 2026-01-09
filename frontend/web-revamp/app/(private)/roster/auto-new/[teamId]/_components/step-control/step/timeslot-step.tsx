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
  selectedTimeslots,
  setSelectedTimeslots,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  selectedTimeslots: Date[],
  setSelectedTimeslots: (timeslots: Date[]) => void,
}>) {
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div>
          <Calendar
            mode='multiple'
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
            selected={selectedTimeslots}
            onSelect={(timeslots) => setSelectedTimeslots(timeslots?.toSorted((a, b) => a.getTime() - b.getTime()) ?? [])}
            locale={zhHK}
          />
        </div>
        <div className='w-120 space-y-2'>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              已選擇 {selectedTimeslots.length} 個時段
            </span>
            <CustomButton
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setSelectedTimeslots([])}
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
              {selectedTimeslots.map((timeslot) => (
                <TableRow key={timeslot.toISOString()}>
                  <TableCell>{format(timeslot, 'PP', { locale: zhHK })}</TableCell>
                  <TableCell>
                    <CustomButton
                      variant="ghost"
                      size='icon-sm'
                      onClick={() => setSelectedTimeslots(selectedTimeslots.filter((t) => t !== timeslot))}
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
          disabled={selectedTimeslots.length === 0}
          onClick={(e) => {
            e.preventDefault()
            setStep((step) => step + 1)
          }}
        />
      </div>
    </>
  )
}