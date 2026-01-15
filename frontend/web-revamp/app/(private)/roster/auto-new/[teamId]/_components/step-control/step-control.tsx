'use client'

import H3 from "@/components/_general/_custom/typography/h3";
import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode, Suspense } from "react";
import TimeslotStep from "./step/timeslot-step";
import OffStep from "./step/off-step";
import ResultPreviewStep from "./step/reset-preview/result-preview-step";
import { Worker } from "@/external/prisma/generated/client";
import StepSkeleton from "./step-skeleton";
import { useAutoNewRosterStore } from "./step/store/auto-new-roster-store-provider";

export default function StepControl({
  className,
  workersPromise,
}: Readonly<{
  className?: string;
  workersPromise: Promise<Worker[]>;
}>) {
  const step = useAutoNewRosterStore(state => state.step)

  const stepContents: {
    step: number;
    title: ReactNode;
    children: ReactNode;
    onNext?: () => void | Promise<void>;
  }[] = [
      {
        step: 0,
        title: '選擇時段',
        children: <TimeslotStep />,
      },
      {
        step: 1,
        title: '選擇職員休息時段',
        children: <Suspense fallback={<StepSkeleton />}>
          <OffStep workersPromise={workersPromise} />
        </Suspense>,
      },
      {
        step: 2,
        title: '預覽編排結果',
        children: <ResultPreviewStep />,
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