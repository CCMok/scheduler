"use client";

import { useRosterStore } from '@/components/store/roster/roster-store-provider';
import RosterTable from './roster-table';
import RosterTableSaveButton from './roster-table-save-button';

export default function RosterTableSection() {
  const { isGenerated } = useRosterStore(state => state);

  if (!isGenerated) return <></>;

  return (
    <section>
      <RosterTable />
      <div className='flex justify-end mt-2'>
        <RosterTableSaveButton />
      </div>
    </section>
  );
}