import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import PostConstraintTypeIdFormField from "./post-constraint-type-id-form-field";
import { PostConstraintType, Post } from "@/external/prisma-generated";
import WeightFormField from "./weight-form-field";
import PostsField from "./posts-field";

type Props = {
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
}

export default function CreateUpdatePostConstraintFields({
  postConstraintTypes,
  posts,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <PostConstraintTypeIdFormField
        postConstraintTypes={postConstraintTypes}
      />
      <PostsField posts={posts} />
      <WeightFormField />
    </InputFullWidthContainer>
  )
}