import { Worker } from "@/external/prisma/generated/browser";
import { DetailPanelMode, DetailPanelState } from "../detail-panel-state";
import { PostWorker } from "@/libs/post/post";
import SelectPostPanel from "./select/select-post-panel";
import SheetBase from "../sheet-base";
import { SheetDescription, SheetHeader, SheetTitle } from "@/external/shadcn/components/ui/sheet";
import PostDetailPanel from "./post-detail-panel";
import CreatePostPanel from "./create/create-post-panel";

export default function PostSettingMobile({
  posts,
  workers,
  detailPanelState,
  setDetailPanelState,
  teamId,
}: Readonly<{
  posts: PostWorker[];
  workers: Worker[];
  detailPanelState: DetailPanelState;
  setDetailPanelState: (state: DetailPanelState) => void;
  teamId: number;
}>) {
  const selectedPost = posts.find(p =>
    detailPanelState.mode === DetailPanelMode.UPDATE && p.id === detailPanelState.id
  );
  return (
    <div className='flex h-full'>
      <SelectPostPanel
        className='w-full'
        posts={posts}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
      />
      <SheetBase
        open={selectedPost !== undefined}
        setDetailPanelState={setDetailPanelState}
        className="h-(--sheet-max-height)"
      >
        <SheetHeader>
          <SheetTitle>
            更改職位資料
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        {selectedPost && (
          <PostDetailPanel
            key={selectedPost.id} // re-mount when selectedPostId changes. To update form initial value.
            className="flex-1 min-h-0"
            post={selectedPost}
            workers={workers}
            onDeleteSuccess={() => setDetailPanelState({ mode: DetailPanelMode.IDLE })}
          />
        )}
      </SheetBase>
      <SheetBase
        open={detailPanelState.mode === DetailPanelMode.CREATE}
        setDetailPanelState={setDetailPanelState}
      >
        <SheetHeader>
          <SheetTitle>
            新增職位
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <CreatePostPanel
          className="flex-1 min-h-0"
          workers={workers}
          teamId={teamId}
          onSuccess={() => setDetailPanelState({ mode: DetailPanelMode.IDLE })}
        />
      </SheetBase>
    </div>
  )
}