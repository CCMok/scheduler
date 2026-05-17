import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import TeamInfoSettingSection from "./info/team-info-setting-section";
import { Team } from "@/external/prisma/generated/browser";
import WorkerSettingSection from "./workers/worker-setting-section";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import { cn } from "@/external/shadcn/libs/utils";
import { getPosts } from "@/libs/post/read/get-post-service";
import PostSettingSection from "./posts/post-setting-section";

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
  const posts = await getPosts(team.id);

  return (
    <Tabs className={cn('min-h-0', className)} defaultValue={TabId.WORKERS}>
      <TabsList>
        <TabsTrigger value={TabId.WORKERS}>職員</TabsTrigger>
        <TabsTrigger value={TabId.POSTS}>職位</TabsTrigger>
        <TabsTrigger value={TabId.INFO}>基本資料</TabsTrigger>
      </TabsList>
      <TabsContent value={TabId.WORKERS} className='min-h-0'>
        <WorkerSettingSection
          workers={workers}
          posts={posts}
          teamId={team.id}
        />
      </TabsContent>
      <TabsContent value={TabId.POSTS} className='min-h-0'>
        <PostSettingSection 
          posts={posts}
          workers={workers}
          teamId={team.id}
        />
      </TabsContent>
      <TabsContent value={TabId.INFO}>
        <TeamInfoSettingSection team={team} />
      </TabsContent>
    </Tabs>
  )
}