import BackButton from "../back-button";
import { Dispatch, SetStateAction } from "react";
import { Roster } from "@/libs/roster/roster";

export default function ResultPreviewStep({
  setStep,
  roster,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>;
  roster: Roster | undefined;
}>) {
  return (
    <div>
      <p>Result Preview step</p>
      <BackButton onClick={(e) => {
        e.preventDefault()
        setStep((step) => step - 1)
      }} />
    </div>
  )
}