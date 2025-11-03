'use client'

import ContextMenu from "@/components/_general/dropdown/context-menu"
import DeleteDropdownMenuItem from "@/components/_general/dropdown/delete-dropdown-menu-item"
import UpdateDropdownMenuItem from "@/components/_general/dropdown/update-dropdown-menu-item"
import { useState } from "react"
import UpdateWorkerConstraintDialog from "./update/update-worker-constraint-dialog"
import { WorkerConstraintType, Worker } from "@/external/prisma-generated"
import DeleteDialog from "@/components/_general/dialog/delete-dialog"
import { deleteWorkerConstraintAction } from "@/libs/server/worker-constraint/actions/delete-worker-constraint-action"
import { ServiceResponse } from "@/libs/server/_general/models/service-response"

type Props = {
  workerConstraintTypeId: string;
  weighting: number;
  workerIds: string[];
  workerConstraintTypes: WorkerConstraintType[];
  workers: Worker[];
  id: number;
}

export default function WorkerConstraintTableRowAction({
  workerConstraintTypeId,
  weighting,
  workerIds,
  workerConstraintTypes,
  workers,
  id,
}: Readonly<Props>) {
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteWorkerConstraintAction(id);
  }

  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem onClick={() => setIsOpenUpdateDialog(true)} />
        <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
      </ContextMenu>
      <UpdateWorkerConstraintDialog
        isOpen={isOpenUpdateDialog}
        setIsOpen={setIsOpenUpdateDialog}
        defaultWorkerConstraintTypeId={workerConstraintTypeId}
        defaultWeighting={weighting}
        defaultWorkerIds={workerIds}
        workerConstraintTypes={workerConstraintTypes}
        workers={workers}
        id={id}
      />
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="人員條件"
        submit={submitDelete}
      />
    </>
  )
}