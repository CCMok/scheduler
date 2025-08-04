'use client'

import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { Post } from "@/external/prisma-generated";
import { useEffect } from "react";

type Props = {
  posts: Post[];
}

export default function PostSettingStateUpdater({ posts }: Readonly<Props>) {
  const setPosts = usePostSettingStore(state => state.setPosts);

  useEffect(() => {
    setPosts(posts);
  }, [posts, setPosts]);

  return <></>
}