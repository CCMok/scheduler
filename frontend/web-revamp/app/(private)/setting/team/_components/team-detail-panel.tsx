import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import TeamInfoSettingSection from "./info/team-info-setting-section";
import { Team } from "@/external/prisma/generated/browser";
import TeamWorkerSettingSection from "./workers/team-worker-setting-section";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import { cn } from "@/external/shadcn/libs/utils";

enum TabId {
  WORKERS = 'workers',
  POSTS = 'posts',
  INFO = 'info',
}

export default async function TeamDetailPanel({
  team,
  className,
}: Readonly<{
  team: Team;
  className?: string;
}>) {
  const workers = await getWorkers(team.id);

  return (
    <Tabs className={cn('min-h-0', className)} defaultValue={TabId.WORKERS}>
      <TabsList>
        <TabsTrigger value={TabId.WORKERS}>職員</TabsTrigger>
        <TabsTrigger value={TabId.POSTS}>職位</TabsTrigger>
        <TabsTrigger value={TabId.INFO}>基本資料</TabsTrigger>
      </TabsList>
      <TabsContent value={TabId.WORKERS} className='min-h-0'>
         <TeamWorkerSettingSection workers={workers} />
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