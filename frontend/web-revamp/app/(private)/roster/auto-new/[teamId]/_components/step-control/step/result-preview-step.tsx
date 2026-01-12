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

export default function ResultPreviewStep({
  setStep,
  roster,
  timeslots,
  postsPromise,
  workersPromise,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>;
  roster: Roster | undefined;
  timeslots: Date[];
  postsPromise: Promise<Post[]>;
  workersPromise: Promise<Worker[]>;
}>) {
  const posts = use(postsPromise)
  const workers = use(workersPromise)
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>預覽結果還未儲存，離開頁面後需重新編排。</p>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                {timeslots.map((timeslot) => (
                  <TableHead key={timeslot.toISOString()}>
                    {formatDate(timeslot)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster?.posts.map((post) => (
                <TableRow key={post.postId}>
                  <TableCell>{posts.find((p) => p.id === post.postId)?.name}</TableCell>
                  {post.assignments.map((assignement) => (
                    <TableCell key={assignement.timeslot}>
                      {workers.find((w) => w.id === assignement.workerId)?.name}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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