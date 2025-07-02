'use client'

import { Loader2 } from "lucide-react";
import { useMaxHistoryCountStore } from "@/components/store/roster/save/max-history-count-store-provider";

export default function RosterTableSaveConfirmDescription() {
  const { maxHistoryCount, isFetchingMaxHistoryCount } = useMaxHistoryCountStore(state => state);

  if (isFetchingMaxHistoryCount) return <Loader2 className='animate-spin' />

  return maxHistoryCount
    ? `只能儲存最多 ${maxHistoryCount} 個值班表，若超過將會刪除舊的值班表，請確認是否繼續。`
    : <></>
}