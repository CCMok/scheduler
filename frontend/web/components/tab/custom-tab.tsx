import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import { Tab } from "@/libs/share/_general/models/tab";

type Props = {
  tabs: Tab[];
}

export default function CustomTab({
  tabs,
}: Readonly<Props>) {
  return (
    <Tabs defaultValue={tabs[0].value}>
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