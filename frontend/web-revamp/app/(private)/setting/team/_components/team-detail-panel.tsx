import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import TeamInfoSettingSection from "./info/team-info-setting-section";

enum TabId {
  WORKERS = 'workers',
  POSTS = 'posts',
  INFO = 'info',
}

export default function TeamDetailPanel() {
  return (
    <Tabs defaultValue={TabId.WORKERS}>
      <TabsList>
        <TabsTrigger value={TabId.WORKERS}>職員</TabsTrigger>
        <TabsTrigger value={TabId.POSTS}>職位</TabsTrigger>
        <TabsTrigger value={TabId.INFO}>基本資料</TabsTrigger>
      </TabsList>
      <TabsContent value={TabId.WORKERS}>
        <div>Workers</div>
      </TabsContent>
      <TabsContent value={TabId.POSTS}>
        <div>Posts</div>
      </TabsContent>
      <TabsContent value={TabId.INFO}>
        <TeamInfoSettingSection />
      </TabsContent>
    </Tabs>
  )
}