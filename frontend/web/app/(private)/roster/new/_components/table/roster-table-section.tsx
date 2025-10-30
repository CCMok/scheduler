"use client";

import RosterTable from './roster-table';
import RosterTableSaveAlertDialog from './save-button/roster-table-save-alert-dialog';
import RosterTableResetButton from './roster-table-reset-button';
import RosterTableCleanButton from './roster-table-clean-button';
import { useCreateRosterStore } from '../store/create-roster-store-provider';
import RosterTableExportXLSXButton from './roster-table-export-xlsx-button';

export default function RosterTableSection() {
  const isGenerated = useCreateRosterStore(state => state.isGenerated);

  if (!isGenerated) return <></>;

  return (
    <section>
      <RosterTable />
      <div className='flex justify-end mt-2 space-x-2'>
        <RosterTableCleanButton />
        <RosterTableResetButton description='重置將會回復至系統產生的編排，沒有儲存的資料將會遺失，請確認是否繼續。' />
        <RosterTableExportXLSXButton />
        <RosterTableSaveAlertDialog />
      </div>
    </section>
  );
}