'use client'

import { Post, Worker } from "@/external/prisma/generated/client";
import { ComponentProps, use } from "react";
import dynamic from "next/dynamic"

// Dnd hydration mismatch
const RosterEditTable = dynamic(() => import("@/components/roster/table/edit/roster-edit-table"), { ssr: false })

export default function RosterEditTableSection({
  postsPromise,
  workersPromise,
  ...props
}: Readonly<{
  postsPromise: Promise<Post[]>;
  workersPromise: Promise<Worker[]>;
} & Omit<ComponentProps<typeof RosterEditTable>, 'posts' | 'workers'>>) {
  const posts = use(postsPromise)
  const workers = use(workersPromise)

  return (
    <RosterEditTable
      posts={posts}
      workers={workers}
      {...props}
    />
  )
}