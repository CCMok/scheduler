import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/external/shadcn/components/ui/tabs";
import TeamInfoSettingSection from "./info/team-info-setting-section";
import { Team } from "@/external/prisma/generated/browser";
import WorkerSettingSection from "./workers/worker-setting-section";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import { cn } from "@/external/shadcn/libs/utils";
import { getPosts } from "@/libs/post/read/get-post-service";
import PostSettingSection from "./posts/post-setting-section";
import AffinitySettingSection from "./affinity/affinity-setting-section";
import {
  getPostAffinities,
  getWorkerAffinities,
} from "@/libs/affinity/read/get-affinity-service";

enum TabId {
  WORKERS = 'workers',
  POSTS = 'posts',
  AFFINITY = 'affinity',
  INFO = 'info',
}

export default async function TeamDetailPanel({
  team,
  className,
}: Readonly<{
  team: Team;
  className?: string;
}>) {
  const [workers, posts, postAffinities, workerAffinities] = await Promise.all([
    getWorkers(team.id),
    getPosts(team.id),
    getPostAffinities(team.id),
    getWorkerAffinities(team.id),
  ]);

  return (
    <Tabs className={cn('tool-panel min-h-0 gap-0 overflow-hidden p-0', className)} defaultValue={TabId.WORKERS}>
      <div className="border-b border-border px-2 py-1.5">
        <TabsList className="h-8">
          <TabsTrigger value={TabId.WORKERS} className="text-xs">職員</TabsTrigger>
          <TabsTrigger value={TabId.POSTS} className="text-xs">職位</TabsTrigger>
          <TabsTrigger value={TabId.AFFINITY} className="text-xs">偏好</TabsTrigger>
          <TabsTrigger value={TabId.INFO} className="text-xs">基本資料</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={TabId.WORKERS} className="min-h-0 p-2">
        <WorkerSettingSection
          workers={workers}
          posts={posts}
          teamId={team.id}
        />
      </TabsContent>
      <TabsContent value={TabId.POSTS} className="min-h-0 p-2">
        <PostSettingSection
          posts={posts}
          workers={workers}
          teamId={team.id}
        />
      </TabsContent>
      <TabsContent value={TabId.AFFINITY} className="min-h-0 p-2">
        <AffinitySettingSection
          teamId={team.id}
          posts={posts}
          workers={workers}
          postAffinities={postAffinities}
          workerAffinities={workerAffinities}
        />
      </TabsContent>
      <TabsContent value={TabId.INFO} className="p-2">
        <TeamInfoSettingSection team={team} />
      </TabsContent>
    </Tabs>
  )
}
