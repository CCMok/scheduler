import InputFullWidthContainer from "@/components/_general/input/container/input-full-width-container";
import { Post } from "@/external/prisma-generated";
import PostIdFormField from "./post-id-form-field";

type Props = {
  posts: Post[];
}

export default function AssignPostFields({
  posts,
}: Readonly<Props>) {
  return (
    <InputFullWidthContainer>
      <PostIdFormField posts={posts} />
    </InputFullWidthContainer>
  )
}