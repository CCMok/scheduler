'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { OffPerTimeslot, Timeslot } from "@/libs/roster/roster";
import { Worker } from "@/external/prisma/generated/client";
import { Badge } from "@/external/shadcn/components/ui/badge";
import { Plus, UserRound, X } from "lucide-react";
import Combobox from "@/components/_general/_custom/combobox/combobox";
import { isNil } from "lodash";
import { useMemo } from "react";

export default function OffEditTable({
  offs,
  originalOffs,
  timeslots,
  workers,
  onChange,
}: Readonly<{
  offs: OffPerTimeslot[];
  originalOffs?: OffPerTimeslot[];
  timeslots: Timeslot[];
  workers: Worker[];
  onChange: (offs: OffPerTimeslot[]) => void;
}>) {
  const offMap = useMemo(() => new Map(offs.map(off => [off.timeslotId, off])), [offs])
  const originalOffMap = useMemo(() => new Map((originalOffs ?? []).map(off => [off.timeslotId, off])), [originalOffs])
  const workerMap = useMemo(() => new Map(workers.map(worker => [worker.id, worker])), [workers])

  const addWorker = (timeslotId: number, workerId?: number) => {
    if (isNil(workerId)) return

    if (!offMap.has(timeslotId)) {
      onChange([...offs, { timeslotId, workerIds: [workerId] }])
      return
    }

    onChange(offs.map(off => off.timeslotId === timeslotId
      ? { ...off, workerIds: [...off.workerIds, workerId] }
      : off
    ))
  }

  const removeWorker = (timeslotId: number, workerId: number) => {
    onChange(offs.map(off => off.timeslotId === timeslotId
      ? { ...off, workerIds: off.workerIds.filter(id => id !== workerId) }
      : off
    ))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>時段</TableHead>
          <TableHead>職員</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeslots.map(timeslot => {
          const targetOff = offMap.get(timeslot.id);
          const originalWorkerIds = originalOffMap.get(timeslot.id)?.workerIds ?? [];
          return (
            <TableRow key={timeslot.id}>
              <TableCell>{timeslot.name}</TableCell>
              <TableCell>
                <div className='flex flex-wrap items-center gap-2'>
                  {targetOff?.workerIds.map((workerId) => {
                    const worker = workerMap.get(workerId);
                    const isChanged = isNil(originalOffs) ? false : !originalWorkerIds.includes(workerId);
                    return (
                      <Badge
                        key={workerId}
                        variant={isChanged ? 'default' : 'secondary'}
                      >
                        <UserRound />
                        {worker?.name}
                        <button
                          type='button'
                          className='cursor-pointer'
                          aria-label='移除職員'
                          onClick={() => removeWorker(timeslot.id, workerId)}
                        >
                          <X />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <Combobox<Worker, number>
                  value={undefined}
                  setValue={(workerId) => addWorker(timeslot.id, workerId)}
                  options={workers.filter(worker => !targetOff?.workerIds.includes(worker.id))}
                  getOptionValue={(worker) => worker.id}
                  getOptionDisplay={(worker) => worker.name}
                  placeHolder="新增職員"
                  icon={<Plus />}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
