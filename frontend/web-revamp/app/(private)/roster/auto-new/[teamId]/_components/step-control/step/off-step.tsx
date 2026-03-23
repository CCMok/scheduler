'use client'

import { use, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Worker } from "@/external/prisma/generated/client"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/external/shadcn/components/ui/field"
import { Checkbox } from "@/external/shadcn/components/ui/checkbox"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import { ChevronLeft, Plus, WandSparkles, X } from "lucide-react"
import { isNil } from "lodash"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/external/shadcn/components/ui/tooltip"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/external/shadcn/components/ui/dialog"
import LoadingButton from "@/components/_general/_custom/button/loading-button"
import { autoCreateRosterAction } from "@/libs/roster/create/auto/auto-create-roster-action"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { useAutoNewRosterStore } from "./store/auto-new-roster-store-provider"
import StepSkeleton from "../step-skeleton"
import { Param } from "../../param"

export default function OffStep({
  workersPromise,
}: Readonly<{
  workersPromise: Promise<Worker[]>;
}>) {
  const workers = use(workersPromise)

  const nextStep = useAutoNewRosterStore(state => state.nextStep)
  const previousStep = useAutoNewRosterStore(state => state.previousStep)
  const timeslots = useAutoNewRosterStore(state => state.timeslots)
  const offs = useAutoNewRosterStore(state => state.offs)
  const setOffs = useAutoNewRosterStore(state => state.setOffs)
  const setInitialRoster = useAutoNewRosterStore(state => state.setInitialRoster)
  const setModifiedRoster = useAutoNewRosterStore(state => state.setModifiedRoster)

  const [workerId, setWorkerId] = useState<number | undefined>(undefined)
  const [selectedTimeslotIds, setSelectedTimeslotIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { teamId: teamIdString } = useParams<Param>()
  const teamId = Number.parseInt(teamIdString)
  if (Number.isNaN(teamId)) {
    console.info('Invalid teamId', teamIdString)
    return <StepSkeleton />
  }

  const submit = async () => {
    const response = await autoCreateRosterAction({
      teamId,
      timeslots,
      offs,
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    setInitialRoster(response.data)
    setModifiedRoster(response.data)
    toast.success('編排成功')
    nextStep()
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
                placeHolder="選擇職員"
              />
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">
                    選擇時段
                  </FieldLegend>
                  <FieldGroup className='gap-3'>
                    {timeslots.map((timeslot) => (
                      <Field key={timeslot.id} orientation="horizontal">
                        <Checkbox
                          id={timeslot.id.toString()}
                          name={timeslot.name}
                          checked={selectedTimeslotIds.includes(timeslot.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimeslotIds([...selectedTimeslotIds, timeslot.id])
                              return
                            }
                            setSelectedTimeslotIds(selectedTimeslotIds.filter((t) => t !== timeslot.id))
                          }}
                        />
                        <FieldLabel htmlFor={timeslot.id.toString()} className='font-normal'>
                          {timeslot.name}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <CustomButton
                className='ml-auto'
                variant='outline'
                disabled={isNil(workerId) || !selectedTimeslotIds.length}
                onClick={(e) => {
                  e.preventDefault()
                  if (isNil(workerId)) return
                  setOffs([...offs, { workerId, timeslotIds: selectedTimeslotIds }])
                  setWorkerId(undefined)
                  setSelectedTimeslotIds([])
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
                      <TableCell>{off.timeslotIds.length} 個時段</TableCell>
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
                      {off.timeslotIds.map((timeslotId) => (
                        <p key={timeslotId}>{timeslots.find((timeslot) => timeslot.id === timeslotId)?.name}</p>
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
            previousStep()
          }}
        >
          <ChevronLeft />
          上一步
        </CustomButton>
        <Dialog>
          <DialogTrigger asChild>
            <CustomButton className='ml-auto'>
              <WandSparkles />
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
                <CustomButton variant="outline">返回</CustomButton>
              </DialogClose>
              <LoadingButton
                isLoading={isSubmitting}
                onClick={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  await submit()
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