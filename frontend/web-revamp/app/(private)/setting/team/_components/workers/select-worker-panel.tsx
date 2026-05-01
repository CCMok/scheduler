'use client'

import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Input } from "@/external/shadcn/components/ui/input"
import { Fragment, useState } from "react";
import { Worker } from "@/external/prisma/generated/browser";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/external/shadcn/components/ui/item";
import { CircleUserRound } from "lucide-react";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { cn } from "@/external/shadcn/libs/utils";

const WORKER_NAME_INPUT_ID = 'worker-name';

export default function SelectWorkerPanel({
  className,
  workers,
  selectedWorkerId,
  setSelectedWorkerId,
}: Readonly<{
  className?: string;
  workers: Worker[];
  selectedWorkerId?: number;
  setSelectedWorkerId: (workerId: number) => void;
}>) {
  const [inputName, setInputName] = useState('');
  const filteredWorkers = workers.filter(worker => worker.name.toLowerCase().includes(inputName.toLowerCase()));
  return (
    <Card className={className}>
      <CardContent className='space-y-2 flex-1 min-h-0 flex flex-col'>
        <Input
          id={WORKER_NAME_INPUT_ID}
          name={WORKER_NAME_INPUT_ID}
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="搜尋..."
          autoComplete="off"
        />
        <ScrollArea className='flex-1 min-h-0 border rounded-md'>
          <ItemGroup>
            {filteredWorkers.map((worker, index) => (
              <Fragment key={worker.id}>
                {index > 0 && (
                  <ItemSeparator />
                )}
                <Item
                  className={cn(
                    'cursor-pointer rounded-none',
                    selectedWorkerId === worker.id && 'bg-accent'
                  )}
                  onClick={() => setSelectedWorkerId(worker.id)}
                >
                  <ItemMedia>
                    <CircleUserRound size={20} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{worker.name}</ItemTitle>
                  </ItemContent>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}