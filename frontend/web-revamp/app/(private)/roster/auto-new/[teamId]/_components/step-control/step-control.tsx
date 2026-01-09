'use client'

import H3 from "@/components/_general/_custom/typography/h3";
import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode, useState } from "react";
import TimeslotStep from "./step/timeslot-step";
import WorkerOffStep from "./step/worker-off-step";
import ResultPreviewStep from "./step/result-preview-step";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import NextStepButton from "./next-step-button";
import { ChevronLeft } from "lucide-react";

export default function StepControl({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [step, setStep] = useState<number>(0)

  const stepContents: {
    step: number;
    title: ReactNode;
    children: ReactNode;
    onNext?: () => void | Promise<void>;
  }[] = [
      {
        step: 0,
        title: '選擇時段',
        children: <TimeslotStep />
      },
      {
        step: 1,
        title: '選擇職員休息時段',
        children: <WorkerOffStep />,
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
          <div className='flex'>
            {step > 0 && (
              <CustomButton
                onClick={(e) => {
                  e.preventDefault()
                  setStep((step) => step - 1)
                }}
              >
                <ChevronLeft />
                上一步
              </CustomButton>
            )}
            {step < stepContents.length - 1 && (
              <NextStepButton
                setStep={setStep}
                onClick={currentStepContent.onNext}
              />
            )}
            {step === stepContents.length - 1 && (
              <CustomButton
                className='ml-auto'
              >
                儲存
              </CustomButton>
            )}
          </div>
        </>
      )}
    </div>
  )
}