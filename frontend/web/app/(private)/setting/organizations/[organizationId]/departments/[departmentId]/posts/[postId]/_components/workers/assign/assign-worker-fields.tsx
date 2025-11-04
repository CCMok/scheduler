import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import WorkerIdFormField from "./worker-id-form-field";
import { Worker } from "@/external/prisma-generated";

type Props = {
  workers: Worker[];
}

export default function AssignWorkerFields({
  workers,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <WorkerIdFormField workers={workers} />
    </InputFullWidthContainer>
  )
}