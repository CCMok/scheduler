'use client'

import NextButton from "@/components/_general/button/next-button";
import CustomCard from "@/components/_general/card/custom-card";
import { CreateOrganizationFormInput } from "@/libs/client/organization/models/create-organization-form-input";
import { useFieldArray, useFormContext } from "react-hook-form";
import BackButton from "@/components/_general/button/back-button";
import useTable from "@/components/_general/table/use-table";
import { columns, PostTableData } from "./post-table-column";
import CustomTable from "@/components/_general/table/custom-table";
import PostAddButton from "./post-add-button";
import { useMemo } from "react";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { toast } from "sonner";

type Props = {
  onClickNext: () => void;
  onClickPrevious: () => void;
}

export default function PostsSection({
  onClickNext,
  onClickPrevious,
}: Readonly<Props>) {
  const { trigger, control, getFieldState } = useFormContext<CreateOrganizationFormInput>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'posts',
  })

  const data: PostTableData[] = useMemo(() =>
    fields.map((item, index) => ({
      id: item.id,
      index,
      onRemove: itemIndex => remove(itemIndex),
    })),
    [fields, remove],
  );

  const table = useTable({
    data,
    columns,
    defaultSorting: [],
    getRowId: row => row.id,
    hasPagination: false,
  })

  const handleClickNext = async () => {
    const isValid = await trigger('posts')
    if (isValid) {
      onClickNext()
      return
    }

    const { error } = getFieldState('posts');
    if (!error) {
      toast.error(UiMessageTitle.SYSTEM_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
      })
      return
    }

    toast.error(UiMessageTitle.INPUT_ERROR, {
      ...SONNER_DEFAULT_OPTIONS,
      description: error.message,
    })
  }

  return (
    <CustomCard
      footer={(
        <div className="w-full flex justify-end gap-2">
          <BackButton onClick={onClickPrevious} />
          <NextButton onClick={handleClickNext} />
        </div>
      )}
    >
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='font-semibold'>職位</span>
          <PostAddButton onAppend={append} />
        </div>
        <CustomTable
          table={table}
          noDataDisplay={<PostAddButton onAppend={append} />}
        />
      </div>
    </CustomCard>
  )
}