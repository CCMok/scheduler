'use client'

import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Input } from "@/external/shadcn/components/ui/input"
import { Fragment, useState } from "react";
import { Worker } from "@/external/prisma/generated/browser";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/external/shadcn/components/ui/item";
import { CircleUserRound } from "lucide-react";

const WORKER_NAME_INPUT_ID = 'worker-name';

export default function TeamWorkerSettingSection({
  workers,
}: Readonly<{
  workers: Worker[];
}>) {
  const [inputName, setInputName] = useState('');
  const filteredWorkers = workers.filter(worker => worker.name.toLowerCase().includes(inputName.toLowerCase()));
  return (
    <div className='flex space-x-2'>
      <Card className='w-1/4'>
        <CardContent className='space-y-2'>
          <Input
            id={WORKER_NAME_INPUT_ID}
            name={WORKER_NAME_INPUT_ID}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="搜尋..."
            autoComplete="off"
          />
          <ItemGroup className='rounded-[var(--radius)] border'>
            {filteredWorkers.map((worker, index) => (
              <Fragment key={worker.id}>
                {index > 0 && (
                  <ItemSeparator />
                )}
                <Item>
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
        </CardContent>
      </Card>
      <Card className='w-3/4'>

      </Card>
    </div>
  )
}