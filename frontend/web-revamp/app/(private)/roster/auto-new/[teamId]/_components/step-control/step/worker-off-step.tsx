'use client'

import NextButton from "../next-button"
import BackButton from "../back-button"
import { Dispatch, SetStateAction, use, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Worker } from "@/external/prisma/generated/client"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/external/shadcn/components/ui/field"
import { Checkbox } from "@/external/shadcn/components/ui/checkbox"
import { format } from "date-fns"
import { zhHK } from "date-fns/locale"

export default function WorkerOffStep({
  setStep,
  workersPromise,
  timeslots,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
  workersPromise: Promise<Worker[]>;
  timeslots: Date[];
}>) {
  const workers = use(workersPromise)
  const [workerId, setWorkerId] = useState<number | undefined>(undefined)
  const [selectedTimeslots, setSelectedTimeslots] = useState<Date[]>([])
  return (
    <>
      <div>
        <Card className='w-120'>
          <CardHeader>
            <CardTitle>新增休息時段</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Combobox
              value={workerId}
              setValue={setWorkerId}
              options={workers}
              getOptionValue={(worker) => worker.id}
              getOptionDisplay={(worker) => worker.name}
              isOptional={false}
              placeHolder="選擇職員"
            />
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">
                  選擇時段
                </FieldLegend>
                <FieldGroup className='gap-3'>
                  {timeslots.map((timeslot) => (
                    <Field key={timeslot.toISOString()} orientation="horizontal">
                      <Checkbox
                        id={timeslot.toISOString()}
                        name={timeslot.toISOString()}
                        checked={selectedTimeslots.includes(timeslot)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTimeslots([...selectedTimeslots, timeslot])
                            return
                          }
                          setSelectedTimeslots(selectedTimeslots.filter((t) => t !== timeslot))
                        }}
                      />
                      <FieldLabel htmlFor={timeslot.toISOString()} className='font-normal'>
                        {format(timeslot, 'PP', { locale: zhHK })}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
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