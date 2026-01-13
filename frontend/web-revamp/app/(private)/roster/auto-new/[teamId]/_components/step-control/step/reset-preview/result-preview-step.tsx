'use client'

import { Dispatch, SetStateAction, use } from "react";
import { Roster } from "@/libs/roster/roster";
import { ChevronLeft, Save } from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { formatDate } from "@/libs/_general/date/date-utils";
import { Post, Worker } from "@/external/prisma/generated/client";
import RosterTable from "./roster-table";

export default function ResultPreviewStep({
  setStep,
  roster,
  timeslots,
  postsPromise,
  workersPromise,
  modifiedRoster,
  setModifiedRoster,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>;
  roster: Roster | undefined;
  timeslots: Date[];
  postsPromise: Promise<Post[]>;
  workersPromise: Promise<Worker[]>;
  modifiedRoster: Roster | undefined;
  setModifiedRoster: Dispatch<SetStateAction<Roster | undefined>>;
}>) {
  const posts = use(postsPromise)
  const workers = use(workersPromise)
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>預覽結果還未儲存，離開頁面後需重新編排。</p>
      <Card>
        <CardContent>
          {modifiedRoster && <RosterTable
            roster={modifiedRoster}
            setRoster={setModifiedRoster}
            timeslots={timeslots}
            posts={posts}
            workers={workers}
          />}
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
                  setStep((step) => step - 1)
                }}
              >
                確定
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* TODO: implement save logic */}
        <CustomButton className='ml-auto'>
          <Save />
          儲存
        </CustomButton>
      </div>
    </div>
  )
}