"use client";

import { useArrangeRosterStore } from '@/components/store/roster/arrange/arrange-roster-store-provider';
import RosterTable from './roster-table';
import RosterTableSaveButton from './roster-table-save-button';

export default function RosterTableSection() {
  const { isGenerated } = useArrangeRosterStore(state => state);

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