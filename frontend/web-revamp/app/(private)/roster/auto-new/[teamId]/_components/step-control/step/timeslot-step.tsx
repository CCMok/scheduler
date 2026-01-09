'use client'

import { Calendar } from "@/external/shadcn/components/ui/calendar";
import { useState } from "react";
import { zhHK } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { format } from "date-fns";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { X } from "lucide-react";

export default function TimeslotStep() {
  const [selectedTimeslots, setSelectedTimeslots] = useState<Date[]>([])
  // TODO validate array empty
  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      <div>
        <Calendar
          mode='multiple'
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
          selected={selectedTimeslots}
          onSelect={(timeslot) => setSelectedTimeslots(timeslot ?? [])}
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
  )
}