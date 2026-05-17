'use client'

import { useIsMobile } from "@/external/shadcn/hooks/use-mobile";
import { useState } from "react";
import { DetailPanelMode, DetailPanelState } from "../detail-panel-state";
import { PostWorker } from "@/libs/post/post";
import { Worker } from "@/external/prisma/generated/browser";
import PostSettingDesktop from "./post-setting-desktop";
import PostSettingMobile from "./post-setting-mobile";

export default function PostSettingSection({
  posts,
  workers,
  teamId,
}: Readonly<{
  posts: PostWorker[];
  workers: Worker[];
  teamId: number;
}>) {
  const [detailPanelState, setDetailPanelState] = useState<DetailPanelState>({ mode: DetailPanelMode.IDLE });

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <PostSettingMobile
        posts={posts}
        workers={workers}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
        teamId={teamId}
      />
    )
  }

  return (
    <PostSettingDesktop
      posts={posts}
      workers={workers}
      detailPanelState={detailPanelState}
      setDetailPanelState={setDetailPanelState}
      teamId={teamId}
    />
  )
}