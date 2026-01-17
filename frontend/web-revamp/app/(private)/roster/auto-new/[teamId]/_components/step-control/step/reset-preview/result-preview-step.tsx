'use client'

import { ChevronLeft, Save } from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import RosterTable from "./roster-table";
import { useAutoNewRosterStore } from "../store/auto-new-roster-store-provider";
import { useState } from "react";
import { createRosterAction } from "@/libs/roster/create/create-roster-action";
import LoadingButton from "@/components/_general/_custom/button/loading-button";
import { useParams } from "next/navigation";
import StepSkeleton from "../../step-skeleton";
import { convertToRosterDto } from "@/libs/roster/roster-utils";

export default function ResultPreviewStep() {
  const previousStep = useAutoNewRosterStore(state => state.previousStep)
  const roster = useAutoNewRosterStore(state => state.roster)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { teamId: teamIdString } = useParams<{ teamId: string }>()
  const teamId = Number.parseInt(teamIdString)
  if (Number.isNaN(teamId)) {
    console.info('Invalid teamId', teamIdString)
    return <StepSkeleton />
  }

  const submit = async () => {
    const rosterDto = convertToRosterDto(roster)
    const response = await createRosterAction({
      teamId,
      rosterDto,
    })
    console.log(response) // TODO

    
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>預覽結果還未儲存，離開頁面後需重新編排。</p>
      <Card>
        <CardContent>
          <RosterTable />
        </CardContent>
      </Card>
      <div className='flex'>
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
                <CustomButton variant="outline">取消</CustomButton>
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
          <DialogTrigger asChild>
            <CustomButton className='ml-auto'>
              <Save />
              儲存
            </CustomButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>儲存值班表</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <p>確定要儲存值班表嗎？</p>
            <DialogFooter>
              <DialogClose asChild>
                <CustomButton variant="outline">取消</CustomButton>
              </DialogClose>
              <LoadingButton
                onClick={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  await submit()
                  setIsSubmitting(false)
                }}
                isLoading={isSubmitting}
              >
                確定
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  )
}