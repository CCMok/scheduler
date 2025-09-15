import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import PostConstraintTypeIdFormField from "./post-constraint-type-id-form-field";
import { PostConstraintType } from "@/external/prisma-generated";
import WeightFormField from "./weight-form-field";

type Props = {
  postConstraintTypes: PostConstraintType[];
}

export default function UpdatePostConstraintFields({
  postConstraintTypes,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <PostConstraintTypeIdFormField
        postConstraintTypes={postConstraintTypes}
      />
      {/* TODO: post ids */}
      <WeightFormField />
    </InputFullWidthContainer>
  )
}