'use client'

import ContextMenu from "@/components/_general/dropdown/context-menu"
import DeleteDropdownMenuItem from "@/components/_general/dropdown/delete-dropdown-menu-item"
import UpdateDropdownMenuItem from "@/components/_general/dropdown/update-dropdown-menu-item"
import { useState } from "react"
import UpdatePostConstraintDialog from "./update/update-post-constraint-dialog"
import { PostConstraintType } from "@/external/prisma-generated"

type Props = {
  postConstraintTypeId: string;
  weighting: number;
  postIds: string[];
  postConstraintTypes: PostConstraintType[];
}

export default function PostConstraintTableRowAction({
  postConstraintTypeId,
  weighting,
  postIds,
  postConstraintTypes,
}: Readonly<Props>) {
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);

  // TODO delete
  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem onClick={() => setIsOpenUpdateDialog(true)} />
        <DeleteDropdownMenuItem />
      </ContextMenu>
      <UpdatePostConstraintDialog
        isOpen={isOpenUpdateDialog}
        setIsOpen={setIsOpenUpdateDialog}
        defaultPostConstraintTypeId={postConstraintTypeId}
        defaultWeighting={weighting}
        defaultPostIds={postIds}
        postConstraintTypes={postConstraintTypes}
      />
    </>
  )
}