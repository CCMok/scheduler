import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";
import ComboBox from "@/components/_general/combobox/combo-box";
import { Worker } from "@/external/prisma-generated";
import { TableCell } from "@/external/shadcn/components/ui/table";
import { PostBaseArrangement } from "@/libs/roster/models/schedule";
import { isEqual } from "date-fns";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  arrangement: PostBaseArrangement;
  setArrangement: (arrangement: PostBaseArrangement) => void;
  workers: Worker[];
  setIsEditing: (isEditing: boolean) => void;
  offs?: OffFormInput[];
}

export default function RosterTableSelectionCell({
  arrangement,
  setArrangement,
  workers,
  setIsEditing,
  offs,
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

  const getDisplayName = (option: Worker): string => {
    if (offs?.some(off => off.days.some(day => isEqual(day, arrangement.day)) && off.workerId === option.id)) {
      return `${option.name} (休)`
    }

    return option.name;
  }

  return (
    <TableCell ref={ref} className='w-[100px]'>
      <ComboBox
        value={arrangement.worker?.id}
        options={workers}
        getValue={option => option.id}
        getDisplayName={getDisplayName}
        onValueChange={onValueChange}
        defaultIsOpen
      />
    </TableCell>
  )
}