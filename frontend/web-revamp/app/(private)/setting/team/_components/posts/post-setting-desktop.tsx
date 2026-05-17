import { Worker} from "@/external/prisma/generated/browser";
import { PostWorker } from "@/libs/post/post";
import { DetailPanelMode, DetailPanelState } from "../detail-panel-state";
import SelectPostPanel from "./select/select-post-panel";
import PostDetailPanel from "./post-detail-panel";
import CreatePostPanel from "./create/create-post-panel";

export default function PostSettingDesktop({
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
    <div className='flex space-x-2 h-full'>
      <SelectPostPanel
        className="w-80"
        posts={posts}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
      />
      {selectedPost && (
        <PostDetailPanel
          key={selectedPost.id} // re-mount when selectedPostId changes. To update form initial value.
          className="flex-1"
          post={selectedPost}
          workers={workers}
          onDeleteSuccess={() => setDetailPanelState({ mode: DetailPanelMode.IDLE })}
        />
      )}
      {detailPanelState.mode === DetailPanelMode.CREATE && (
        <CreatePostPanel
          className='flex-1'
          workers={workers}
          teamId={teamId}
          onSuccess={(id) => setDetailPanelState({ mode: DetailPanelMode.UPDATE, id })}
        />
      )}
    </div>
  )
}