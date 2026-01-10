'use client'

import NextButton from "../next-button"
import BackButton from "../back-button"
import { Dispatch, SetStateAction, use, useState } from "react"
import { Card, CardContent } from "@/external/shadcn/components/ui/card"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Worker } from "@/external/prisma/generated/client"

export default function WorkerOffStep({
  setStep,
  workersPromise,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  workersPromise: Promise<Worker[]>;
}>) {
  const workers = use(workersPromise)
  const [workerId, setWorkerId] = useState<number | undefined>(undefined)
  return (
    <>
      <div>
        <Card>
          <CardContent>
            <Combobox
              value={workerId}
              setValue={setWorkerId}
              options={workers}
              getOptionValue={(worker) => worker.id}
              getOptionDisplay={(worker) => worker.name}
              isOptional={false}
              placeHolder="選擇職員"
            />
          </CardContent>
        </Card>
      </div>
      <div className='flex'>
        <BackButton
          onClick={(e) => {
            e.preventDefault()
            setStep((step) => step - 1)
          }}
        />
        <NextButton
          onClick={(e) => {
            e.preventDefault()
            // TODO
          }}
        />
      </div>
    </>
  )
}