'use client'

import useTable from '@/components/_general/table/use-table';
import CustomTable from '@/components/_general/table/custom-table';
import { createOffFilterColumns } from './off-filter-table-column';
import { useMemo, useCallback } from 'react';
import OffFilterAddButton from "./off-filter-add-button";
import CustomCard from "@/components/_general/card/custom-card";
import { useCreateRosterStore } from "@/app/(private)/roster/new/_components/store/create-roster-store-provider";
import { OffFormInput } from '@/app/(private)/roster/new/_components/filter/form/create-roster-form-input';

export default function OffFilter() {
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);
  const setGeneratedScheduleOffs = useCreateRosterStore(state => state.setGeneratedScheduleOffs);

  const onClickRemove = useCallback((index: number) => {
    const newOffs = generatedScheduleOffs.filter((_, i) => i !== index);
    setGeneratedScheduleOffs(newOffs);
  }, [generatedScheduleOffs, setGeneratedScheduleOffs]);

  const append = useCallback((value: OffFormInput) => {
    const newOffs = [...generatedScheduleOffs, value];
    setGeneratedScheduleOffs(newOffs);
  }, [generatedScheduleOffs, setGeneratedScheduleOffs]);

  const columns = useMemo(() => createOffFilterColumns(), []);

  const tableData = useMemo(() =>
    generatedScheduleOffs.map((item, index) => ({
      id: `off-${index}`,
      index,
      onRemove: onClickRemove,
    })),
    [generatedScheduleOffs, onClickRemove]
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