'use client'

import CustomCard from "@/components/_general/card/custom-card";
import BackButton from "@/components/_general/button/back-button";
import FormSubmitButton from "@/components/_general/form/form-submit-button";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateOrganizationWithChildrenFormInput } from "@/libs/client/organization/models/create-organization-with-children-form-input";
import { columns, PostWorkerTableData } from "./post-worker-table-column";
import useTable from "@/components/_general/table/use-table";
import CustomTable from "@/components/_general/table/custom-table";

type Props = {
  onClickPrevious: () => void;
}

export default function PostWorkerSection({
  onClickPrevious,
}: Readonly<Props>) {
  const { control } = useFormContext<CreateOrganizationWithChildrenFormInput>();
  const { fields } = useFieldArray({
    control,
    name: 'postWorkers',
  })

  const data: PostWorkerTableData[] = useMemo(() =>
    fields.map((item, index) => ({
      id: item.id,
      index,
      postTempId: item.postTempId,
      postName: item.postName,
      workerTempIds: item.workerTempIds,
    })),
    [fields],
  );

  const table = useTable({
    data,
    columns,
    defaultSorting: [],
    getRowId: row => row.id,
    hasPagination: false,
  });

  return (
    <CustomCard
      title="指派職位"
      footer={(
        <div className="w-full flex justify-end gap-2">
          <BackButton onClick={onClickPrevious} />
          <FormSubmitButton
            icon={<Save />}
          >
            儲存
          </FormSubmitButton>
        </div>
      )}
    >
      <CustomTable
        table={table}
      />
    </CustomCard>
  )
}