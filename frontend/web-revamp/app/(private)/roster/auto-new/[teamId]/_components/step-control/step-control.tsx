'use client'

import H3 from "@/components/_general/_custom/typography/h3";
import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode, useState } from "react";
import TimeslotStep from "./step/timeslot-step";
import WorkerOffStep from "./step/worker-off-step";
import ResultPreviewStep from "./step/result-preview-step";

export default function StepControl({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [step, setStep] = useState<number>(0)
  const [selectedTimeslots, setSelectedTimeslots] = useState<Date[]>([])

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
          selectedTimeslots={selectedTimeslots}
          setSelectedTimeslots={setSelectedTimeslots}
        />,
      },
      {
        step: 1,
        title: '選擇職員休息時段',
        children: <WorkerOffStep
          setStep={setStep}
        />,
      },
      {
        step: 2,
        title: '結果預覽',
        children: <ResultPreviewStep />
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