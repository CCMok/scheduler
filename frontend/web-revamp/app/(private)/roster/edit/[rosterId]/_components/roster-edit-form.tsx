'use client'

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import { use, useMemo, useState } from "react"
import { OffPerTimeslot, parseRosterItems, RosterItem, RosterJoin, toOffsPerWorker } from "@/libs/roster/roster"
import { Post, RosterTimeslot, Worker } from "@/external/prisma/generated/client"
import { useAppForm } from "@/components/_general/form/utils/form-utils"
import { FORM_FIELD, FORM_ID, formSchema } from "./roster-edit-form-utils"
import { revalidateLogic } from "@tanstack/react-form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/external/shadcn/components/ui/dialog"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import { updateRosterAction } from "@/libs/roster/update/update-roster-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { searchParamKey } from "../../../_components/param"
import { TimeslotRequest } from "@/libs/roster/update/update-roster-request"
import CustomLink from "@/components/_general/_custom/link/custom-link"
import { ChevronLeft, Save, WandSparkles } from "lucide-react"
import OffEditTable from "@/components/off/table/off-edit-table"
import LoadingButton from "@/components/_general/_custom/button/loading-button"
import { autoModifyRosterAction } from "@/libs/roster/update/auto/auto-modify-roster-action"
import dynamic from "next/dynamic"
import { ROUTE } from "@/libs/_general/route/route-config"

// Dnd hydration mismatch
const RosterEditTable = dynamic(() => import("@/components/roster/table/edit/roster-edit-table"), { ssr: false })

export const getTimeslotRequests = (
  timeslots: RosterTimeslot[],
  rosterItems: RosterItem[],
  offs: OffPerTimeslot[],
): TimeslotRequest[] => {
  const timeslotMap = new Map<number, TimeslotRequest>(timeslots.map(timeslot => [timeslot.id, {
    id: timeslot.id,
    assignments: [],
    offWorkerIds: [],
  }]))

  for (const rosterItem of rosterItems) {
    for (const assignment of rosterItem.assignments) {
      const timeslotItem = timeslotMap.get(assignment.timeslotId)
      if (!timeslotItem) {
        console.error(`Timeslot not found when parsing assignment. timeslotId=${assignment.timeslotId}`);
        continue;
      }

      timeslotItem.assignments.push({
        postId: rosterItem.postId,
        workerId: assignment.workerId,
      })
    }
  }

  for (const off of offs) {
    const timeslotItem = timeslotMap.get(off.timeslotId)
    if (!timeslotItem) {
      console.error(`Timeslot not found when parsing off. timeslotId=${off.timeslotId}`);
      continue;
    }

    timeslotItem.offWorkerIds.push(...off.workerIds)
  }

  return timeslots.filter(timeslot => timeslotMap.has(timeslot.id)).map(timeslot => timeslotMap.get(timeslot.id)!)
}

export default function RosterEditForm({
  roster,
  postsPromise,
  workersPromise,
}: Readonly<{
  roster: RosterJoin;
  postsPromise: Promise<Post[]>;
  workersPromise: Promise<Worker[]>;
}>) {
  const posts = use(postsPromise)
  const workers = use(workersPromise)

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: roster.name,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: () => {
      setIsDialogOpen(true);
    },
  })

  const router = useRouter()

  const rosterItems = useMemo(() => parseRosterItems(roster), [roster])
  const originalOffs = useMemo<OffPerTimeslot[]>(() => roster.timeslots.map(t => ({
    timeslotId: t.id,
    workerIds: t.offWorkers.map(ow => ow.workerId),
  })), [roster])

  const [modifiedRoster, setModifiedRoster] = useState<RosterItem[]>(rosterItems)
  const [modifiedOffs, setModifiedOffs] = useState<OffPerTimeslot[]>(originalOffs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = async () => {
    const response = await autoModifyRosterAction({
      rosterId: roster.id,
      offs: toOffsPerWorker(modifiedOffs),
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    setModifiedRoster(response.data)
    setIsGenerateDialogOpen(false)
    toast.success('編排成功')
  }

  const submit = async () => {
    const response = await updateRosterAction({
      id: roster.id,
      name: form.state.values[FORM_FIELD.NAME],
      timeslots: getTimeslotRequests(roster.timeslots, modifiedRoster, modifiedOffs),
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    toast.success('更改值班表成功')
    router.push(ROUTE.private.roster.base({ 
      [searchParamKey.TEAM_ID]: roster.teamId, 
      [searchParamKey.ROSTER_ID]: roster.id,
    }));
  }

  return (
    <form
      id={FORM_ID}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField name={FORM_FIELD.NAME}>
            {(field) => (
              <field.TextField
                className='w-(--input-width)'
                label="值班表名稱"
                placeholder="請輸入值班表名稱"
              />
            )}
          </form.AppField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>休假時段</CardTitle>
          <CardDescription>更改休假時段後，可自動編排值班表。與已儲存資料不同的職員會以顏色標示。</CardDescription>
        </CardHeader>
        <CardContent>
          <OffEditTable
            offs={modifiedOffs}
            originalOffs={originalOffs}
            timeslots={roster.timeslots}
            workers={workers}
            onChange={setModifiedOffs}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>值班表</CardTitle>
          <CardDescription>與已儲存資料不同的班次會以顏色標示。</CardDescription>
          <CardAction>
            <Dialog
              open={isGenerateDialogOpen}
              onOpenChange={setIsGenerateDialogOpen}
            >
              <DialogTrigger asChild>
                <CustomButton variant="outline">
                  <WandSparkles />
                  自動編排
                </CustomButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>自動編排值班表</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <div className='space-y-2'>
                  <p>編排前，請先確認休假時段已更改完成。</p>
                  <p>編排結果將覆蓋尚未儲存的值班表修改，確定要自動編排嗎？</p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <CustomButton variant="outline">返回</CustomButton>
                  </DialogClose>
                  <LoadingButton
                    isLoading={isGenerating}
                    onClick={async (e) => {
                      e.preventDefault()
                      setIsGenerating(true)
                      await generate()
                      setIsGenerating(false)
                    }}
                  >
                    確定
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <RosterEditTable
            posts={posts}
            workers={workers}
            timeslots={roster.timeslots}
            roster={modifiedRoster}
            originalRoster={rosterItems}
            onChange={setModifiedRoster}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <CustomButton variant="outline">
              <ChevronLeft />
              返回
            </CustomButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>取消更改值班表</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <p>修改將不會儲存，確定要取消更改值班表嗎？</p>
            <DialogFooter>
              <DialogClose asChild>
                <CustomButton variant="outline">返回</CustomButton>
              </DialogClose>
              <CustomButton asChild>
                <CustomLink href={ROUTE.private.roster.base({ 
                  [searchParamKey.TEAM_ID]: roster.teamId, 
                  [searchParamKey.ROSTER_ID]: roster.id,
                })}>
                  確定
                </CustomLink>
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <form.AppForm>
          <form.SubmitButton formId={FORM_ID}>
            <Save />
            確定
          </form.SubmitButton>
        </form.AppForm>
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更改值班表</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <p>請確認是否更改值班表。</p>
          <DialogFooter>
            <DialogClose asChild>
              <CustomButton variant="outline">返回</CustomButton>
            </DialogClose>
            <CustomButton
              onClick={async (e) => {
                e.preventDefault()
                await submit()
              }}
            >
              確定
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}