import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import TeamInfoSettingSection from "./info/team-info-setting-section";
import { Team } from "@/external/prisma/generated/browser";
import TeamWorkerSettingSection from "./workers/team-worker-setting-section";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";

enum TabId {
  WORKERS = 'workers',
  POSTS = 'posts',
  INFO = 'info',
}

export default async function TeamDetailPanel({
  team,
}: Readonly<{
  team: Team;
}>) {
  const workers = await getWorkers(team.id);
  // checking reason of tabs h-full, height is over size
  return (
    <Tabs defaultValue={TabId.WORKERS}>
      <TabsList>
        <TabsTrigger value={TabId.WORKERS}>職員</TabsTrigger>
        <TabsTrigger value={TabId.POSTS}>職位</TabsTrigger>
        <TabsTrigger value={TabId.INFO}>基本資料</TabsTrigger>
      </TabsList>
      <TabsContent value={TabId.WORKERS}>
        <div>text</div>
      {/* <ScrollArea className='h-full'>
          <div className='bg-red-500 h-200' />
          <div className='bg-green-500 h-200' />
        </ScrollArea> */}
      
      
        {/* <TeamWorkerSettingSection workers={workers} /> */}
      </TabsContent>
      <TabsContent value={TabId.POSTS}>
        <div>Posts</div>
      </TabsContent>
      <TabsContent value={TabId.INFO}>
        <TeamInfoSettingSection team={team} />
      </TabsContent>
    </Tabs>
  )
}