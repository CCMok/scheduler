'use client'

import { RosterStoreProvider } from "@/components/store/roster/roster-store-provider";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

export default function RosterPageProvider({
  children
}: Readonly<ChildrenProps>) {
  return (
    <RosterStoreProvider>
      {children}
    </RosterStoreProvider>
  )
} 