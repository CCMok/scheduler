'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { useFieldArray, useFormContext } from "react-hook-form"
import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { createOffFilterColumns } from './off-filter-table-column';
import { useMemo, useCallback } from 'react';
import OffFilterAddButton from "./off-filter-add-button";
import CustomCard from "@/components/_general/card/custom-card";

export default function OffFilter() {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const onClickRemove = useCallback((index: number) => remove(index), [remove])

  const columns = useMemo(() => createOffFilterColumns(), []);

  const tableData = useMemo(() =>
    fields.map((item, index) => ({
      id: item.id,
      index,
      onRemove: onClickRemove,
    })),
    [fields, onClickRemove]
  );

  const table = useTable({
    data: tableData,
    columns,
    defaultSorting: [],
    getRowId: row => row.id,
    hasPagination: false,
  });

  return (
    <CustomCard>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='font-semibold'>請假</span>
          <OffFilterAddButton onAppend={append} />
        </div>
        <CustomTable
          table={table}
          noDataDisplay={<OffFilterAddButton onAppend={append} />}
        />
      </div>
    </CustomCard>
  )
}