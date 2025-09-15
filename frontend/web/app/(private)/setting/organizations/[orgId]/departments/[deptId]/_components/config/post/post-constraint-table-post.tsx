import { Badge } from "@/external/shadcn/components/ui/badge";
import { MAX_DISPLAY_COUNT } from "@/libs/client/_general/constants/display-constant";
import { PostConstraintPostPost } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { BriefcaseBusiness } from "lucide-react";

type Props = {
  postConstraintPosts: PostConstraintPostPost[];
}

export default function PostConstraintTablePost({
  postConstraintPosts,
}: Readonly<Props>) {
  const displayPosts = postConstraintPosts.slice(0, MAX_DISPLAY_COUNT);

  return (
    <div className='space-x-1'>
      {displayPosts.map(postConstraintPost => (
        <Badge key={postConstraintPost.id}>
          <BriefcaseBusiness />
          {postConstraintPost.post.name}
        </Badge>
      ))}
      {postConstraintPosts.length > MAX_DISPLAY_COUNT && (
        <Badge variant='secondary'>
          + {postConstraintPosts.length - MAX_DISPLAY_COUNT} 更多
        </Badge>
      )}
    </div>
  )
}