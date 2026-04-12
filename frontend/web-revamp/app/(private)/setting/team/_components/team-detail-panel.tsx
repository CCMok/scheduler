import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";

const TAB_VALUES = [
  { id: 'info', label: '基本資料' },
  { id: 'workers', label: '成員' },
  { id: 'posts', label: '職位' },
]

export default function TeamDetailPanel() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue={TAB_VALUES[0].id}>
          <TabsList>
            {TAB_VALUES.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}