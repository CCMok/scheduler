'use client'

import ContextMenu from "@/components/_general/dropdown/context-menu"
import DeleteDropdownMenuItem from "@/components/_general/dropdown/delete-dropdown-menu-item"
import UpdateDropdownMenuItem from "@/components/_general/dropdown/update-dropdown-menu-item"
import { useState } from "react"
import UpdatePostConstraintDialog from "./update/update-post-constraint-dialog"
import { PostConstraintType, Post } from "@/external/prisma-generated"
import DeleteDialog from "@/components/_general/dialog/old-delete-dialog"
import { isNil } from "lodash"
import { ServiceResponseStatus } from "@/libs/share/_general/enums/service-response-status"
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import { deletePostConstraintAction } from "@/libs/server/post-constraint/actions/delete-post-constraint-action"

type Props = {
  postConstraintTypeId: string;
  weighting: number;
  postIds: string[];
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
  id: number;
}

export default function PostConstraintTableRowAction({
  postConstraintTypeId,
  weighting,
  postIds,
  postConstraintTypes,
  posts,
  id,
}: Readonly<Props>) {
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    if (isNil(id)) return { status: ServiceResponseStatus.INTERNAL_ERROR };
    return await deletePostConstraintAction({ id });
  }

  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem onClick={() => setIsOpenUpdateDialog(true)} />
        <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
      </ContextMenu>
      <UpdatePostConstraintDialog
        isOpen={isOpenUpdateDialog}
        setIsOpen={setIsOpenUpdateDialog}
        defaultPostConstraintTypeId={postConstraintTypeId}
        defaultWeighting={weighting}
        defaultPostIds={postIds}
        postConstraintTypes={postConstraintTypes}
        posts={posts}
        id={id}
      />
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="職位條件"
        submit={submitDelete}
      />
    </>
  )
}