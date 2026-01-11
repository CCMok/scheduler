'use client'

import NextButton from "../next-button"
import BackButton from "../back-button"
import { Dispatch, SetStateAction, use, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Worker } from "@/external/prisma/generated/client"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/external/shadcn/components/ui/field"
import { Checkbox } from "@/external/shadcn/components/ui/checkbox"
import { format } from "date-fns"
import { zhHK } from "date-fns/locale"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import { Plus, X } from "lucide-react"
import { isNil } from "lodash"
import { WorkerOff } from "../worker-off"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/external/shadcn/components/ui/tooltip"

export default function WorkerOffStep({
  setStep,
  workersPromise,
  timeslots,
  workerOffs,
  setWorkerOffs,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  workersPromise: Promise<Worker[]>;
  timeslots: Date[];
  workerOffs: WorkerOff[];
  setWorkerOffs: Dispatch<SetStateAction<WorkerOff[]>>;
}>) {
  const workers = use(workersPromise)
  const [workerId, setWorkerId] = useState<number | undefined>(undefined)
  const [selectedTimeslots, setSelectedTimeslots] = useState<Date[]>([])
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-120'>
          <Card>
            <CardHeader>
              <CardTitle>新增休息時段</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <Combobox
                value={workerId}
                setValue={setWorkerId}
                options={workers.filter((worker) => !workerOffs.some((wo) => wo.workerId === worker.id))}
                getOptionValue={(worker) => worker.id}
                getOptionDisplay={(worker) => worker.name}
                isOptional={false}
                placeHolder="選擇職員"
              />
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">
                    選擇時段
                  </FieldLegend>
                  <FieldGroup className='gap-3'>
                    {timeslots.map((timeslot) => (
                      <Field key={timeslot.toISOString()} orientation="horizontal">
                        <Checkbox
                          id={timeslot.toISOString()}
                          name={timeslot.toISOString()}
                          checked={selectedTimeslots.includes(timeslot)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimeslots([...selectedTimeslots, timeslot])
                              return
                            }
                            setSelectedTimeslots(selectedTimeslots.filter((t) => t !== timeslot))
                          }}
                        />
                        <FieldLabel htmlFor={timeslot.toISOString()} className='font-normal'>
                          {format(timeslot, 'PP', { locale: zhHK })}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <CustomButton
                className='ml-auto'
                variant='outline'
                disabled={isNil(workerId) || !selectedTimeslots.length}
                onClick={(e) => {
                  e.preventDefault()
                  if (isNil(workerId)) return
                  setWorkerOffs([...workerOffs, { workerId, timeslots: selectedTimeslots }])
                  setWorkerId(undefined)
                  setSelectedTimeslots([])
                }}
              >
                <Plus />
                新增
              </CustomButton>
            </CardContent>
          </Card>
        </div>
        <div className='w-full lg:w-100 space-y-2'>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              已選擇 {workerOffs.length} 位職員
            </span>
            <CustomButton
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setWorkerOffs([])}
            >
              清除全部
            </CustomButton>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>職員</TableHead>
                <TableHead>時段</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workerOffs.map((workerOff) => (
                <Tooltip key={workerOff.workerId}>
                  <TooltipTrigger asChild>
                    <TableRow>
                      <TableCell>{workers.find((worker) => worker.id === workerOff.workerId)?.name}</TableCell>
                      <TableCell>{workerOff.timeslots.length} 個時段</TableCell>
                      <TableCell>
                        <CustomButton
                          variant="ghost"
                          size='icon-sm'
                          onClick={() => setWorkerOffs(workerOffs.filter((wo) => wo.workerId !== workerOff.workerId))}
                        >
                          <X />
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className='space-y-1'>
                      {workerOff.timeslots.map((timeslot) => (
                        <p key={timeslot.toISOString()}>{format(timeslot, 'PP', { locale: zhHK })}</p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className='flex'>
        <BackButton
          onClick={(e) => {
            e.preventDefault()
            setStep((step) => step - 1)
          }}
        />
        <NextButton
          onClick={(e) => {
            e.preventDefault()
            // TODO
          }}
        />
      </div>
    </>
  )
}