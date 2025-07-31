'use client';

import CustomInput from "@/components/input/custom-input";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { Label } from "@/external/shadcn/components/ui/label";

export default function PostNameField() {
  const postNameFilter = usePostSettingStore(state => state.postNameFilter);
  const setPostNameFilter = usePostSettingStore(state => state.setPostNameFilter);
  
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor="postName">職位名稱</Label>
      <CustomInput
        id="postName"
        placeholder="搜尋..."
        value={postNameFilter}
        onChange={e => setPostNameFilter(e.target.value)}
      />
    </div>
  );
} 