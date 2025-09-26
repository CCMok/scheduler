import { Post, PostConstraint, PostConstraintPost, PostConstraintType } from "@/external/prisma-generated";

export type PostConstraintDao = Omit<PostConstraint, 'weighting'> & {
  weighting: number;
}

export type PostConstraintPosts = PostConstraintDao & {
  postConstraintPosts: PostConstraintPostPost[];
  postConstraintType: PostConstraintType;
}

export type PostConstraintPostPost = PostConstraintPost & {
  post: Post;
}