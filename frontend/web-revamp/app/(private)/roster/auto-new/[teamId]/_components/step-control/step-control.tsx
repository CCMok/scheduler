'use client'

import H3 from "@/components/_general/_custom/typography/h3";
import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode, Suspense, useState } from "react";
import TimeslotStep from "./step/timeslot-step";
import OffStep from "./step/off-step";
import ResultPreviewStep from "./step/result-preview-step";
import { Post, Worker } from "@/external/prisma/generated/client";
import { Off } from "./off";
import { Roster } from "@/libs/roster/roster";

const filterOffsByTimeslots = (
  offs: Off[],
  validTimeslots: Date[]
): Off[] => {
  const isTimeslotValid = (t: Date) =>
    validTimeslots.some((nt) => nt.getTime() === t.getTime())

  return offs
    .map((wo) => ({
      ...wo,
      timeslots: wo.timeslots.filter(isTimeslotValid),
    }))
    .filter((wo) => wo.timeslots.length > 0)
}

export default function StepControl({
  className,
  workersPromise,
  postsPromise,
}: Readonly<{
  className?: string;
  workersPromise: Promise<Worker[]>;
  postsPromise: Promise<Post[]>;
}>) {
  const [step, setStep] = useState<number>(0)
  const [timeslots, setTimeslots] = useState<Date[]>([])
  const [offs, setOffs] = useState<Off[]>([])
  const [roster, setRoster] = useState<Roster | undefined>(undefined)

  const setTimeslotsWrapper = (newTimeslots: Date[]) => {
    setOffs((prev) => filterOffsByTimeslots(prev, newTimeslots))
    setTimeslots(newTimeslots)
  }

  const stepContents: {
    step: number;
    title: ReactNode;
    children: ReactNode;
    onNext?: () => void | Promise<void>;
  }[] = [
      {
        step: 0,
        title: '選擇時段',
        children: <TimeslotStep
          setStep={setStep}
          timeslots={timeslots}
          setTimeslots={setTimeslotsWrapper}
        />,
      },
      {
        step: 1,
        title: '選擇職員休息時段',
        // TODO: suspense content
        children: <Suspense fallback={<div>Loading...</div>}>
          <OffStep
            setStep={setStep}
            workersPromise={workersPromise}
            timeslots={timeslots}
            offs={offs}
            setOffs={setOffs}
            setRoster={setRoster}
          />
        </Suspense>,
      },
      {
        step: 2,
        title: '預覽編排結果',
        // TODO: suspense content
        children: <Suspense fallback={<div>Loading...</div>}>
          <ResultPreviewStep
            setStep={setStep}
            roster={roster}
            timeslots={timeslots}
            postsPromise={postsPromise}
            workersPromise={workersPromise}
          />
        </Suspense>,
      },
    ]

  const currentStepContent = stepContents[step]

  return (
    <div className={cn('space-y-4', className)}>
      {currentStepContent && (
        <>
          <div className='flex items-center'>
            <H3>{currentStepContent.title}</H3>
            <span className='ml-auto text-muted-foreground text-sm'>步驟 {currentStepContent.step + 1} / {stepContents.length}</span>
          </div>
          {currentStepContent.children}
        </>
      )}
    </div>
  )
}