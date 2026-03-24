'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import { use, useMemo, useState } from "react"
import { parseRosterItems, RosterItem, RosterJoin } from "@/libs/roster/roster"
import { Post, RosterTimeslot, Worker } from "@/external/prisma/generated/client"
import { useAppForm } from "@/components/_general/form/utils/form-utils"
import { FORM_FIELD, FORM_ID, formSchema } from "./roster-edit-form-utils"
import { revalidateLogic } from "@tanstack/react-form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/external/shadcn/components/ui/dialog"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import { updateRosterAction } from "@/libs/roster/update/update-roster-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { buildRosterUrl } from "../../../_components/param"
import { TimeslotRequest } from "@/libs/roster/update/update-roster-request"
import CustomLink from "@/components/_general/_custom/link/custom-link"
import { ChevronLeft, Save } from "lucide-react"
import OffTable from "@/components/off/table/off-table"
import dynamic from "next/dynamic"

// Dnd hydration mismatch
const RosterEditTable = dynamic(() => import("@/components/roster/table/edit/roster-edit-table"), { ssr: false })

export const getTimeslotRequests = (
  timeslots: RosterTimeslot[],
  rosterItems: RosterItem[],
): TimeslotRequest[] => {
  const timeslotMap = new Map<number, TimeslotRequest>(timeslots.map(timeslot => [timeslot.id, {
    id: timeslot.id,
    assignments: [],
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

  const [modifiedRoster, setModifiedRoster] = useState<RosterItem[]>(rosterItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const submit = async () => {
    const response = await updateRosterAction({
      id: roster.id,
      name: form.state.values[FORM_FIELD.NAME],
      timeslots: getTimeslotRequests(roster.timeslots, modifiedRoster),
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    toast.success('更改值班表成功')
    router.push(buildRosterUrl(roster.teamId, roster.id))
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
          <CardTitle>值班表</CardTitle>
        </CardHeader>
        <CardContent>
          <RosterEditTable
            posts={posts}
            workers={workers}
            timeslots={roster.timeslots}
            roster={modifiedRoster}
            onChange={setModifiedRoster}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>休假時段</CardTitle>
        </CardHeader>
        <CardContent>
          <OffTable
            offs={roster.timeslots.map(t => ({
              timeslotId: t.id,
              workerIds: t.offWorkers.map(ow => ow.workerId),
            }))}
            timeslots={roster.timeslots}
            workers={workers}
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
                <CustomLink href={buildRosterUrl(roster.teamId, roster.id)}>
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