'use client'

import { useFieldArray, useFormContext } from "react-hook-form"
import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { columns } from './off-filter-table-column';
import { useMemo } from 'react';
import OffFilterAddButton from "./off-filter-add-button";
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../create-roster-form-input";

export default function OffFilter() {
  const { control } = useFormContext<CreateRosterFilterFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: CreateRosterFilterKey.OFFS,
  })

  const data = useMemo(() =>
    fields.map((item, index) => ({
      id: item.id,
      index,
      onRemove: (index: number) => remove(index),
    })),
    [fields, remove]
  );

  const table = useTable({
    data,
    columns,
    defaultSorting: [],
    getRowId: row => row.id,
    hasPagination: false,
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>請假</span>
        <OffFilterAddButton append={append} />
      </div>
      <CustomTable
        table={table}
        noDataDisplay={<OffFilterAddButton append={append} />}
      />
    </div>
  )
}