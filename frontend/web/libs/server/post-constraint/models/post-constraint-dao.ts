import { Post, PostConstraint, PostConstraintPost, PostConstraintType } from "@/external/prisma-generated";

export type PostConstraintPosts = PostConstraint & {
  postConstraintPosts: PostConstraintPostPost[];
  postConstraintType: PostConstraintType;
}

export type PostConstraintPostPost = PostConstraintPost & {
  post: Post;
}