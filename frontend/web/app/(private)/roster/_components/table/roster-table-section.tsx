"use client";

import { useArrangeRosterStore } from '@/components/store/roster/arrange/arrange-roster-store-provider';
import RosterTable from './roster-table';
import RosterTableSaveButton from './save-button/roster-table-save-button';
import RosterTableResetButton from './roster-table-reset-button';

export default function RosterTableSection() {
  const { isGenerated } = useArrangeRosterStore(state => state);

  if (!isGenerated) return <></>;

  return (
    <section>
      <RosterTable />
      <div className='flex justify-end mt-2 space-x-2'>
        <RosterTableResetButton />
        <RosterTableSaveButton />
      </div>
    </section>
  );
}