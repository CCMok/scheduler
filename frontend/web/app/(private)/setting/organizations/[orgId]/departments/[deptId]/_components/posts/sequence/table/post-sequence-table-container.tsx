'use client'

import dynamic from "next/dynamic";

// Fix dnd hydration mismatch
const PostSequenceTable = dynamic(() => import('./post-sequence-table'), { ssr: false })

export default function PostSequenceTableContainer() {
  return (
    <PostSequenceTable />
  )
}