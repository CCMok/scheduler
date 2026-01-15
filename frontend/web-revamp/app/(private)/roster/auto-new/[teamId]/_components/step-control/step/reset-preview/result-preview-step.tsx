'use client'

import { ChevronLeft, Save } from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import RosterTable from "./roster-table";
import { useAutoNewRosterStore } from "../store/auto-new-roster-store-provider";
import { useState } from "react";

export default function ResultPreviewStep() {
  const previousStep = useAutoNewRosterStore(state => state.previousStep)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    // TODO
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
                onClick={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  await submit()
                  setIsSubmitting(false)
                }}
              >
                確定
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CustomButton className='ml-auto'>
          <Save />
          儲存
        </CustomButton>
      </div>
    </div>
  )
}