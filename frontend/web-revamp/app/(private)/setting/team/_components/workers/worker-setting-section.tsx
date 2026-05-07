'use client'

import { useState } from "react";
import { Post } from "@/external/prisma/generated/browser";
import { WorkerPost } from "@/libs/worker/worker";
import WorkerSettingDesktop from "./worker-setting-desktop";
import { useIsMobile } from "@/external/shadcn/hooks/use-mobile";
import WorkerSettingMobile from "./worker-setting-mobile";
import { DetailPanelMode, DetailPanelState } from "./detail-panel-state";

export default function WorkerSettingSection({
  workers,
  posts,
  teamId,
}: Readonly<{
  workers: WorkerPost[];
  posts: Post[];
  teamId: number;
}>) {
  const [detailPanelState, setDetailPanelState] = useState<DetailPanelState>({ mode: DetailPanelMode.IDLE });

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <WorkerSettingMobile
        workers={workers}
        posts={posts}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
        teamId={teamId}
      />
    )
  }

  return (
    <WorkerSettingDesktop
      workers={workers}
      posts={posts}
      detailPanelState={detailPanelState}
      setDetailPanelState={setDetailPanelState}
      teamId={teamId}
    />
  )
}