'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import { Tab } from "@/libs/_general/models/tab";

type Props = {
  tabs: Tab[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function CustomTab({
  tabs,
  value,
  onValueChange,
}: Readonly<Props>) {
  return (
    <Tabs defaultValue={tabs[0]?.value ?? ''} value={value} onValueChange={onValueChange}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>{tab.content}</TabsContent>
      ))}
    </Tabs>
  )
}