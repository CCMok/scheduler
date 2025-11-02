import { Post, PostConstraint, PostConstraintPost, PostConstraintType } from "@/external/prisma-generated";

export type PostConstraintDao = Omit<PostConstraint, 'weighting'> & {
  weighting: number;
}

export type PostConstraintWithChild = PostConstraintDao & {
  postConstraintType: PostConstraintType;
  postConstraintPosts: PostConstraintPostWithPost[];
}

export type PostConstraintPostWithPost = PostConstraintPost & {
  post: Post;
}