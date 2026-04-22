'use client'

import FieldLayout from "@/components/_general/form/field/field-layout"
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { FieldGroup } from "@/external/shadcn/components/ui/field"
import { Input } from "@/external/shadcn/components/ui/input"
import { useState } from "react";
import { Worker } from "@/external/prisma/generated/browser";

const WORKER_NAME_INPUT_ID = 'worker-name';

export default function TeamWorkerSettingSection({
  workers,
}: Readonly<{
  workers: Worker[];
}>) {
  const [inputName, setInputName] = useState('');
  const filteredWorkers = workers.filter(worker => worker.name.toLowerCase().includes(inputName.toLowerCase()));
  return (
    <Card>
      <CardContent>
        <FieldGroup className='flex-row flex-wrap'>
          <FieldLayout label="職員名稱" id={WORKER_NAME_INPUT_ID} className="w-(--input-width)">
            <Input
              id={WORKER_NAME_INPUT_ID}
              name={WORKER_NAME_INPUT_ID}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="搜尋..."
              autoComplete="off"
            />
          </FieldLayout>
        </FieldGroup>
      </CardContent>
      {/* TODO */}
      {filteredWorkers.map(worker => worker.name)}
    </Card>
  )
}