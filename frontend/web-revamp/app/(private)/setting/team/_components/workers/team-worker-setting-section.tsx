'use client'

import { useState } from "react";
import { Post } from "@/external/prisma/generated/browser";
import { WorkerPost } from "@/libs/worker/worker";
import WorkerSettingDesktop from "./worker-setting-desktop";
import { useIsMobile } from "@/external/shadcn/hooks/use-mobile";
import WorkerSettingMobile from "./worker-setting-mobile";

export default function TeamWorkerSettingSection({
  workers,
  posts,
}: Readonly<{
  workers: WorkerPost[];
  posts: Post[];
}>) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | undefined>();

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <WorkerSettingMobile
        workers={workers}
        posts={posts}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
      />
    )
  }

  return (
    <WorkerSettingDesktop
      workers={workers}
      posts={posts}
      selectedWorkerId={selectedWorkerId}
      setSelectedWorkerId={setSelectedWorkerId}
    />
  )
}