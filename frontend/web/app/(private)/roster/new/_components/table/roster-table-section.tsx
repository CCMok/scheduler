"use client";

import RosterTable from './roster-table';
import RosterTableSaveAlertDialog from './save-button/roster-table-save-alert-dialog';
import RosterTableResetButton from './roster-table-reset-button';
import RosterTableCleanButton from './roster-table-clean-button';
import { useArrangeRosterStore } from '../store/arrange-roster-store-provider';

export default function RosterTableSection() {
  const isGenerated = useArrangeRosterStore(state => state.isGenerated);

  if (!isGenerated) return <></>;

  return (
    <section>
      <RosterTable />
      <div className='flex justify-end mt-2 space-x-2'>
        <RosterTableCleanButton />
        <RosterTableResetButton description='重置將會回復至系統產生的編排，沒有儲存的資料將會遺失，請確認是否繼續。' />
        <RosterTableSaveAlertDialog />
      </div>
    </section>
  );
}