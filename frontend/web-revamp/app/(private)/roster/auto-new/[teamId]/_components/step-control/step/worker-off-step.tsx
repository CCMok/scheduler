'use client'

import NextButton from "../next-button"
import BackButton from "../back-button"
import { Dispatch, SetStateAction } from "react"

export default function WorkerOffStep({
  setStep,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>,
}>) {
  return (
    <>
      <div>Worker Off step</div>
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