'use client'

import { FieldArrayWithId } from "react-hook-form"
import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { columns, OffFilterRowData } from './off-filter-table-column';
import { useMemo } from 'react';
import OffFilterAddButton from "./off-filter-add-button";
import { CreateRosterFilterFormInput, CreateRosterFilterKey, OffFormInput } from "../form/create-roster-form-input";

type Props = {
  fields: FieldArrayWithId<CreateRosterFilterFormInput, CreateRosterFilterKey.OFFS, "id">[];
  onAppend: (value: OffFormInput) => void;
  onRemove: (index: number) => void;
}

export default function OffFilter({
  fields,
  onAppend,
  onRemove,
}: Readonly<Props>) {
  const data: OffFilterRowData[] = useMemo(
    () => fields.map((item, index) => ({
      id: item.id,
      index,
      onRemove,
    })),
    [fields, onRemove]
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
        <OffFilterAddButton onAppend={onAppend} />
      </div>
      <CustomTable
        table={table}
        noDataDisplay={<OffFilterAddButton onAppend={onAppend} />}
      />
    </div>
  )
}