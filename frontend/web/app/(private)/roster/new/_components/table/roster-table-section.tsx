"use client";

import RosterTable from './roster-table';
import RosterTableSaveButton from './save-button/roster-table-save-button';
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
        <RosterTableResetButton />
        <RosterTableSaveButton />
      </div>
    </section>
  );
}