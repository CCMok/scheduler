'use client'

import CustomButton from "@/components/_general/button/custom-button";
import { Organization } from "@/external/prisma-generated";
import { Plus } from "lucide-react";
import { use, useState } from "react";
import CreateDepartmentDialog from "./create-department-dialog";

type Props = {
  organizationsPromise: Promise<Organization[]>;
}

export default function CreateDepartmentButton({
  organizationsPromise,
}: Readonly<Props>) {
  const organizations = use(organizationsPromise);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onClick = () => setIsDialogOpen(true)

  return (
    <>
      <CustomButton
        onClick={onClick}
      >
        <Plus />
        新增
      </CustomButton>
      <CreateDepartmentDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        organizations={organizations}
      />
    </>
  )
}