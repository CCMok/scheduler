"use client";

import RosterTableSaveAlertDialog from './save-button/roster-table-save-alert-dialog';
import RosterTableResetButton from './roster-table-reset-button';
import RosterTableCleanButton from './roster-table-clean-button';
import { useCreateRosterStore } from '../store/create-roster-store-provider';
import RosterTableExportXLSXButton from './roster-table-export-xlsx-button';
import RosterTable from '@/components/roster/table/roster-table';
import { useMemo } from 'react';

export default function RosterTableSection() {
  const isGenerated = useCreateRosterStore(state => state.isGenerated);
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules);
  const generatedScheduleWorkers = useCreateRosterStore(state => state.generatedScheduleWorkers);

  const days = useMemo(() => {
    return modifiedSchedules.length ? modifiedSchedules[0].arrangements.map(arrangement => arrangement.day) : []
  }, [modifiedSchedules]) 

  if (!isGenerated) return <></>;

  return (
    <section>
      <RosterTable
        days={days}
        schedules={modifiedSchedules}
        setSchedules={setModifiedSchedules}
        workers={generatedScheduleWorkers}
      />
      <div className='flex justify-end mt-2 space-x-2'>
        <RosterTableCleanButton />
        <RosterTableResetButton description='重置將會回復至系統產生的編排，沒有儲存的資料將會遺失，請確認是否繼續。' />
        <RosterTableExportXLSXButton />
        <RosterTableSaveAlertDialog />
      </div>
    </section>
  );
}