'use client'

import { useFieldArray, UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form"
import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { columns } from './off-filter-table-column';
import { useMemo } from 'react';
import OffFilterAddButton from "./off-filter-add-button";
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../create-roster-form-input";

type Props = {
  offFieldArray: UseFieldArrayReturn<CreateRosterFilterFormInput, CreateRosterFilterKey.OFFS, "id">;
}

export default function OffFilter({ 
  offFieldArray,
}: Readonly<Props>) {
  // const { control } = useFormContext<CreateRosterFilterFormInput>();

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: CreateRosterFilterKey.OFFS,
  // })

  // const offs = useWatch({
  //   control,
  //   name: CreateRosterFilterKey.OFFS,
  // })
  // console.log('offs', offs)
  const { fields, append, remove } = offFieldArray;

  const data = useMemo(() => {
    return fields.map((item, index) => ({
      id: item.id,
      index,
      onRemove: (index: number) => remove(index),
    })) },
    [fields, remove]
  );

  console.log('data', data)

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