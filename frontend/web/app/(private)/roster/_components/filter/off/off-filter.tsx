'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form"
import CustomButton from '@/components/_general/button/custom-button';
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider";
import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { createOffFilterColumns } from './off-filter-table-column';
import { useMemo, useCallback } from 'react';

export default function OffFilter() {
  const { control } = useFormContext<ArrangeRosterFormInput>();
  const workers = useArrangeRosterFilterStore(state => state.workers);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const onClickAppend = () => append({
    workerId: workers.length ? workers[0].id.toString() : '',
    days: [],
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
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>請假</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex justify-end'>
          <CustomButton
            variant='outline'
            onClick={onClickAppend}
          >
            <Plus />新增
          </CustomButton>
        </div>
        <CustomTable
          table={table}
          hasPagination={false}
          noDataDisplay='新增請假人員'
        />
      </CardContent>
    </Card>
  )
}