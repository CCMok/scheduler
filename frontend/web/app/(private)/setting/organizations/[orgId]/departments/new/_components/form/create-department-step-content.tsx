import { ReactNode } from "react";
import PostsSection from "./posts/posts-section";
import WorkersSection from "./workers/workers-section";
import PostWorkerSection from "./post-worker/post-worker-section";

type Props = {
  step: number;
  setStep: (step: number) => void;
  basicInfoSection: ReactNode;
}

export const CreateDepartmentStepContent = ({
  step,
  setStep,
  basicInfoSection,
}: Readonly<Props>) => {
  switch (step) {
    case 0:
      return basicInfoSection;
    case 1:
      return <PostsSection
        onClickNext={() => setStep(step + 1)}
        onClickPrevious={() => setStep(step - 1)}
      />
    case 2:
      return <WorkersSection
        onClickNext={() => setStep(step + 1)}
        onClickPrevious={() => setStep(step - 1)}
      />
    case 3:
      return <PostWorkerSection
        onClickPrevious={() => setStep(step - 1)}
      />
    default:
      console.error(`Unknown step: ${step}`)
      return <></>
  }
}