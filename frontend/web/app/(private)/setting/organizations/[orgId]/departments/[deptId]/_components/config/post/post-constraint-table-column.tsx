import TableSortableHeader from "@/components/_general/table/table-sortable-header";
import { PostConstraintWithChild } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { ColumnDef } from "@tanstack/react-table";
import PostConstraintTablePost from "./post-constraint-table-post";
import PostConstraintTableRowAction from "./post-constraint-table-row-action";
import { PostConstraintType, Post } from "@/external/prisma-generated";

export enum PostConstraintTableId {
  CONSTRAINT_TYPE = 'constraintType',
  WEIGHTTING = 'weighting',
  POSTS = 'posts',
  ACTIONS = 'actions',
}

export const getColumns = (postConstraintTypes: PostConstraintType[], posts: Post[]): ColumnDef<PostConstraintWithChild>[] => [
  {
    id: PostConstraintTableId.CONSTRAINT_TYPE,
    accessorFn: row => row.postConstraintType.name,
    header: ({ column }) => (
      <TableSortableHeader title="條件類型" column={column} />
    ),
  },
  {
    id: PostConstraintTableId.POSTS,
    header: '職位',
    cell: ({ row }) => <PostConstraintTablePost postConstraintPosts={row.original.postConstraintPosts} />
  },
  {
    accessorKey: PostConstraintTableId.WEIGHTTING,
    header: ({ column }) => (
      <TableSortableHeader title="權重" column={column} />
    ),
  },
  {
    id: PostConstraintTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => <PostConstraintTableRowAction 
      postConstraintTypeId={row.original.postConstraintTypeId.toString()}
      weighting={row.original.weighting}
      postIds={row.original.postConstraintPosts.map(post => post.postId.toString())}
      postConstraintTypes={postConstraintTypes}
      posts={posts}
      id={row.original.id}
    />,
  }
]