'use client'

import { Post, Worker } from "@/external/prisma/generated/client";
import { PostAffinityGroup, WorkerAffinityGroup } from "@/libs/affinity/affinity";
import AffinityGroupEditor from "./affinity-group-editor";
import { createPostAffinityAction } from "@/libs/affinity/post/create-post-affinity-action";
import { updatePostAffinityAction } from "@/libs/affinity/post/update-post-affinity-action";
import { deletePostAffinityAction } from "@/libs/affinity/post/delete-post-affinity-action";
import { createWorkerAffinityAction } from "@/libs/affinity/worker/create-worker-affinity-action";
import { updateWorkerAffinityAction } from "@/libs/affinity/worker/update-worker-affinity-action";
import { deleteWorkerAffinityAction } from "@/libs/affinity/worker/delete-worker-affinity-action";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";

export default function AffinitySettingSection({
  teamId,
  posts,
  workers,
  postAffinities,
  workerAffinities,
}: Readonly<{
  teamId: number;
  posts: Post[];
  workers: Worker[];
  postAffinities: PostAffinityGroup[];
  workerAffinities: WorkerAffinityGroup[];
}>) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-3">
        <AffinityGroupEditor
          title="職位搭配"
          description="同一時段盡量至少安排組內其中一個職位有人值班（例如 Keyboard 與 Guitar 擇一覆蓋）。"
          emptyHint="尚未設定職位搭配組。可把常一起出現的職位組成一組。"
          groups={postAffinities}
          options={posts}
          getOptionValue={(p) => p.id}
          getOptionDisplay={(p) => p.name}
          minMembersMessage="職位搭配組至少選擇兩個職位"
          onCreate={async (postIds) => createPostAffinityAction({ teamId, postIds })}
          onUpdate={async (id, postIds) => updatePostAffinityAction({ id, postIds })}
          onDelete={async (id) => deletePostAffinityAction({ id })}
        />

        <AffinityGroupEditor
          title="職員同班"
          description="同一時段盡量讓組內職員一起上班（例如常搭檔的兩人）。"
          emptyHint="尚未設定職員同班組。可把希望同天值班的職員組成一組。"
          groups={workerAffinities}
          options={workers}
          getOptionValue={(w) => w.id}
          getOptionDisplay={(w) => w.name}
          minMembersMessage="職員同班組至少選擇兩位職員"
          onCreate={async (workerIds) => createWorkerAffinityAction({ teamId, workerIds })}
          onUpdate={async (id, workerIds) => updateWorkerAffinityAction({ id, workerIds })}
          onDelete={async (id) => deleteWorkerAffinityAction({ id })}
        />
      </div>
    </ScrollArea>
  );
}
