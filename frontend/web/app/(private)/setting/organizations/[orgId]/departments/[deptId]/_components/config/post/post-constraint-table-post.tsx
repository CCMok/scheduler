import { Badge } from "@/external/shadcn/components/ui/badge";
import { PostConstraintPostPost } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { BriefcaseBusiness } from "lucide-react";

const displayMaximumCount = 2;

type Props = {
  postConstraintPosts: PostConstraintPostPost[];
}

export default function PostConstraintTablePost({
  postConstraintPosts,
}: Readonly<Props>) {
  const displayPosts = postConstraintPosts.slice(0, displayMaximumCount);

  return (
    <div className='space-x-1'>
      {displayPosts.map(postConstraintPost => (
        <Badge key={postConstraintPost.id}>
          <BriefcaseBusiness />
          {postConstraintPost.post.name}
        </Badge>
      ))}
      {postConstraintPosts.length > displayMaximumCount && (
        <Badge variant='secondary'>
          + {postConstraintPosts.length - displayMaximumCount} 更多
        </Badge>
      )}
    </div>
  )
}