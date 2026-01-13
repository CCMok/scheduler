'use client'

import { Dispatch, SetStateAction, use, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Worker } from "@/external/prisma/generated/client"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/external/shadcn/components/ui/field"
import { Checkbox } from "@/external/shadcn/components/ui/checkbox"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import { ChevronLeft, Plus, Sparkles, X } from "lucide-react"
import { isNil } from "lodash"
import { Off } from "../off"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/external/shadcn/components/ui/tooltip"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/external/shadcn/components/ui/dialog"
import LoadingButton from "@/components/_general/_custom/button/loading-button"
import { autoCreateRosterAction } from "@/libs/roster/create/auto-create-roster-action"
import { toast } from "sonner"
import { Roster } from "@/libs/roster/roster"
import { useParams } from "next/navigation"
import { formatDate } from "@/libs/_general/date/date-utils"

export default function OffStep({
  setStep,
  workersPromise,
  timeslots,
  offs,
  setOffs,
  setRoster,
  setModifiedRoster,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  workersPromise: Promise<Worker[]>;
  timeslots: Date[];
  offs: Off[];
  setOffs: Dispatch<SetStateAction<Off[]>>;
  setRoster: Dispatch<SetStateAction<Roster | undefined>>;
  setModifiedRoster: Dispatch<SetStateAction<Roster | undefined>>;
}>) {
  const workers = use(workersPromise)
  const [workerId, setWorkerId] = useState<number | undefined>(undefined)
  const [selectedTimeslots, setSelectedTimeslots] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { teamId } = useParams<{ teamId: string }>()

  const onSubmit = async () => {
    const response = await autoCreateRosterAction({
      teamId: Number(teamId),
      timeslots: timeslots.map((timeslot) => formatDate(timeslot)),
      offs: offs.map((off) => ({
        workerId: off.workerId,
        timeslots: off.timeslots.map((timeslot) => formatDate(timeslot)),
      })),
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    setRoster(response.data)
    setModifiedRoster(response.data)
    toast.success('編排成功')
    setStep((step) => step + 1)
  }

  return (
    <div className='space-y-4'>
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
                options={workers.filter((worker) => !offs.some((wo) => wo.workerId === worker.id))}
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
                          {formatDate(timeslot)}
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
                  setOffs([...offs, { workerId, timeslots: selectedTimeslots }])
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
              已選擇 {offs.length} 位職員
            </span>
            <CustomButton
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setOffs([])}
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
              {offs.map((off) => (
                <Tooltip key={off.workerId}>
                  <TooltipTrigger asChild>
                    <TableRow>
                      <TableCell>{workers.find((worker) => worker.id === off.workerId)?.name}</TableCell>
                      <TableCell>{off.timeslots.length} 個時段</TableCell>
                      <TableCell>
                        <CustomButton
                          variant="ghost"
                          size='icon-sm'
                          onClick={() => setOffs(offs.filter((wo) => wo.workerId !== off.workerId))}
                        >
                          <X />
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className='space-y-1'>
                      {off.timeslots.map((timeslot) => (
                        <p key={timeslot.toISOString()}>{formatDate(timeslot)}</p>
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
        <CustomButton
          onClick={(e) => {
            e.preventDefault()
            setStep((step) => step - 1)
          }}
        >
          <ChevronLeft />
          上一步
        </CustomButton>
        <Dialog>
          <DialogTrigger asChild>
            <CustomButton className='ml-auto'>
              <Sparkles />
              編排
            </CustomButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>編排值班表</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <p>確定後系統將自動編排值班表。</p>
            <DialogFooter>
              <DialogClose asChild>
                <CustomButton variant="outline">取消</CustomButton>
              </DialogClose>
              <LoadingButton
                isLoading={isSubmitting}
                onClick={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  await onSubmit()
                  setIsSubmitting(false)
                }}
              >
                確定
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}