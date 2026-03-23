'use client'

import { ChevronLeft, Save } from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { useAutoNewRosterStore } from "../store/auto-new-roster-store-provider";
import { use } from "react";
import { createRosterAction } from "@/libs/roster/create/create-roster-action";
import { useParams, useRouter } from "next/navigation";
import StepSkeleton from "../../step-skeleton";
import { toast } from "sonner";
import { Post, Worker } from "@/external/prisma/generated/client";
import { Param } from "../../../param";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { FORM_FIELD, FORM_ID, FormInput, formSchema } from "./create-roster-form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { buildRosterUrl } from "@/app/(private)/roster/_components/param";
import RosterEditTable from "@/components/roster/table/edit/roster-edit-table";
import { TimeslotRequest } from "@/libs/roster/create/create-roster-request";
import { Off, RosterItem, Timeslot } from "@/libs/roster/roster";

export const getTimeslotRequests = (
  timeslots: Timeslot[],
  rosterItems: RosterItem[],
  offs: Off[],
): TimeslotRequest[] => {
  const timeslotMap = new Map<number, TimeslotRequest>(timeslots.map(timeslot => [timeslot.id, {
    name: timeslot.name,
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
    for (const timeslotId of off.timeslotIds) {
      const timeslotItem = timeslotMap.get(timeslotId)
      if (!timeslotItem) {
        console.error(`Timeslot not found when parsing off. timeslotId=${timeslotId}`);
        continue;
      }

      timeslotItem.offWorkerIds.push(off.workerId)
    }
  }

  return timeslots.filter(timeslot => timeslotMap.has(timeslot.id)).map(timeslot => timeslotMap.get(timeslot.id)!)
}

export default function ResultPreviewStep({
  postPromise,
  workersPromise,
}: Readonly<{
  postPromise: Promise<Post[]>;
  workersPromise: Promise<Worker[]>;
}>) {
  const posts = use(postPromise)
  const workers = use(workersPromise)

  const modifiedRoster = useAutoNewRosterStore(state => state.modifiedRoster)
  const offs = useAutoNewRosterStore(state => state.offs)
  const timeslots = useAutoNewRosterStore(state => state.timeslots)
  const previousStep = useAutoNewRosterStore(state => state.previousStep)
  const setModifiedRoster = useAutoNewRosterStore(state => state.setModifiedRoster)

  const router = useRouter()

  const { teamId: teamIdString } = useParams<Param>()
  const teamId = Number.parseInt(teamIdString)

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      await submit(value)
    },
  })

  if (Number.isNaN(teamId)) {
    console.info('Invalid teamId', teamIdString)
    return <StepSkeleton />
  }

  const submit = async (input: FormInput) => {
    const response = await createRosterAction({
      teamId,
      name: input[FORM_FIELD.NAME],
      timeslots: getTimeslotRequests(timeslots, modifiedRoster, offs),
    })

    if (!response.isSuccess) {
      toast.error(response.message)
      return
    }

    toast.success('儲存值班表成功')
    router.push(buildRosterUrl(teamId, response.data.id))
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>預覽結果還未儲存，離開頁面後需重新編排。</p>
      <Card>
        <CardContent>
          <RosterEditTable
            timeslots={timeslots}
            posts={posts}
            workers={workers}
            roster={modifiedRoster}
            onChange={setModifiedRoster}
          />
        </CardContent>
      </Card>
      <div className='flex justify-between'>
        <Dialog>
          <DialogTrigger asChild>
            <CustomButton>
              <ChevronLeft />
              修改資料
            </CustomButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>修改資料</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <p>預覽結果將不會儲存，請確定是否修改資料。</p>
            <DialogFooter>
              <DialogClose asChild>
                <CustomButton variant="outline">返回</CustomButton>
              </DialogClose>
              <CustomButton
                onClick={(e) => {
                  e.preventDefault()
                  previousStep()
                }}
              >
                確定
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <form
            id={FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <DialogTrigger asChild>
              <CustomButton>
                <Save />
                儲存
              </CustomButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>儲存值班表</DialogTitle>
                <DialogDescription>
                  確定後將儲存值班表。
                </DialogDescription>
              </DialogHeader>
              <form.AppField name={FORM_FIELD.NAME}>
                {(field) => (
                  <field.TextField
                    className='w-(--input-width)'
                    label="值班表名稱"
                    placeholder="請輸入值班表名稱"
                  />
                )}
              </form.AppField>
              <DialogFooter>
                <DialogClose asChild onClick={() => form.reset()}>
                  <CustomButton variant="outline">返回</CustomButton>
                </DialogClose>
                <form.AppForm>
                  <form.SubmitButton formId={FORM_ID}>
                    確定
                  </form.SubmitButton>
                </form.AppForm>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  )
}