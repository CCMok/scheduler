'use client'

import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Input } from "@/external/shadcn/components/ui/input"
import { Fragment, useState } from "react";
import { Worker } from "@/external/prisma/generated/browser";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/external/shadcn/components/ui/item";
import { Plus, User } from "lucide-react";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { cn } from "@/external/shadcn/libs/utils";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { DetailPanelMode, DetailPanelState } from "../../detail-panel-state";

const WORKER_NAME_INPUT_ID = 'worker-name';

export default function SelectWorkerPanel({
  className,
  workers,
  detailPanelState,
  setDetailPanelState
}: Readonly<{
  className?: string;
  workers: Worker[];
  detailPanelState: DetailPanelState;
  setDetailPanelState: (state: DetailPanelState) => void;
}>) {
  const [inputName, setInputName] = useState('');
  const filteredWorkers = workers.filter(worker => worker.name.toLowerCase().includes(inputName.toLowerCase()));
  return (
    <Card className={className}>
      <CardContent className='space-y-2 flex-1 min-h-0 flex flex-col'>
        <div className='flex space-x-2'>
          <Input
            id={WORKER_NAME_INPUT_ID}
            name={WORKER_NAME_INPUT_ID}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="搜尋..."
            autoComplete="off"
          />
          <CustomButton
            variant='outline'
            size='icon'
            onClick={() => setDetailPanelState({ mode: DetailPanelMode.CREATE })}
          >
            <Plus />
          </CustomButton>
        </div>
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
                    detailPanelState.mode === DetailPanelMode.UPDATE && detailPanelState.id === worker.id && 'bg-accent'
                  )}
                  size='sm'
                  onClick={() => setDetailPanelState({ mode: DetailPanelMode.UPDATE, id: worker.id })}
                >
                  <ItemMedia>
                    <User className='size-4' />
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