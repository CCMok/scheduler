'use client'

import H3 from "@/components/_general/_custom/typography/h3";
import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode, Suspense, useState } from "react";
import TimeslotStep from "./step/timeslot-step";
import OffStep from "./step/off-step";
import ResultPreviewStep from "./step/reset-preview/result-preview-step";
import { Worker } from "@/external/prisma/generated/client";
import { Off } from "./off";
import { RosterDto } from "@/libs/roster/roster";
import StepSkeleton from "./step-skeleton";

const timeslotFilter = (validTimeslots: string[]) => (timeslot: string) => validTimeslots.includes(timeslot)

export default function StepControl({
  className,
  workersPromise,
}: Readonly<{
  className?: string;
  workersPromise: Promise<Worker[]>;
}>) {
  const [step, setStep] = useState<number>(0)
  const [timeslots, setTimeslots] = useState<string[]>([])
  const [offs, setOffs] = useState<Off[]>([])
  const [roster, setRoster] = useState<RosterDto>([])
  const [modifiedRoster, setModifiedRoster] = useState<RosterDto>([])

  const setTimeslotsWrapper = (newTimeslots: string[]) => {
    setOffs((offs) => offs.map(off => ({
      ...off,
      timeslots: off.timeslots.filter(timeslotFilter(newTimeslots)),
    })))
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
        children: <Suspense fallback={<StepSkeleton />}>
          <OffStep
            setStep={setStep}
            workersPromise={workersPromise}
            timeslots={timeslots}
            offs={offs}
            setOffs={setOffs}
            setRoster={setRoster}
            setModifiedRoster={setModifiedRoster}
          />
        </Suspense>,
      },
      {
        step: 2,
        title: '預覽編排結果',
        children: <Suspense fallback={<StepSkeleton />}>
          <ResultPreviewStep
            setStep={setStep}
            modifiedRoster={modifiedRoster}
            timeslots={timeslots}
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