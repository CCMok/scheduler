import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import WorkerConstraintTypeIdFormField from "./worker-constraint-type-id-form-field";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";
import WeightFormField from "./weight-form-field";
import WorkersField from "./workers-field";

type Props = {
  workerConstraintTypes: WorkerConstraintType[];
  workers: Worker[];
}

export default function CreateUpdateWorkerConstraintFields({
  workerConstraintTypes,
  workers,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <WorkerConstraintTypeIdFormField
        workerConstraintTypes={workerConstraintTypes}
      />
      <WorkersField workers={workers} />
      <WeightFormField />
    </InputFullWidthContainer>
  )
}