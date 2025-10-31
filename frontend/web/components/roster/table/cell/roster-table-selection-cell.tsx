import ComboBox from "@/components/_general/combobox/combo-box";
import { Worker } from "@/external/prisma-generated";
import { TableCell } from "@/external/shadcn/components/ui/table";
import { Arrangement } from "@/libs/share/roster/models/post-base-schedule";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  arrangement: Arrangement;
  setArrangement: (arrangement: Arrangement) => void;
  workers: Worker[];
  setIsEditing: (isEditing: boolean) => void;
}

export default function RosterTableSelectionCell({
  arrangement,
  setArrangement,
  workers,
  setIsEditing,
}: Readonly<Props>) {
  const ref = useRef<HTMLTableCellElement>(null);

  const onClickDocument = useCallback((event: MouseEvent) => {
    // Click outside of the cell and popover
    if (
      ref.current
      && !ref.current.contains(event.target as Node)
      && !(event.target as HTMLElement).closest('[data-popover-content]')
    ) {
      setIsEditing(false)
    }
  }, [setIsEditing])

  useEffect(() => {
    document.addEventListener('mousedown', onClickDocument);
    return () => document.removeEventListener('mousedown', onClickDocument);
  }, [onClickDocument])

  const onValueChange = (workerId: number | undefined) => {
    const worker = workerId ? workers.find(worker => worker.id === workerId) : undefined;

    const newArrangement = {
      ...arrangement,
      worker,
    }

    setArrangement(newArrangement);
    setIsEditing(false);
  }

  return (
    <TableCell ref={ref} className='w-[100px]'>
      <ComboBox
        value={arrangement.worker?.id}
        options={workers}
        getValue={option => option.id}
        getDisplayName={option => option.name}
        onValueChange={onValueChange}
        defaultIsOpen
      />
    </TableCell>
  )
}