'use client'

import { Loader2 } from "lucide-react";
import { useMaxHistoryCountStore } from "./store/max-history-count-store-provider";

export default function RosterTableSaveConfirmDescription() {
  const maxHistoryCount = useMaxHistoryCountStore(state => state.maxHistoryCount);
  const isFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.isFetchingMaxHistoryCount);

  if (isFetchingMaxHistoryCount) return <Loader2 className='animate-spin' />

  return maxHistoryCount
    ? `只能儲存最多 ${maxHistoryCount} 個值班表，若超過將會刪除舊的值班表，請確認是否繼續。`
    : <></>
}