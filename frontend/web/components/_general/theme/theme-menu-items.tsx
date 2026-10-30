'use client'

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/external/shadcn/components/ui/dropdown-menu";
import { Theme } from "@/libs/_general/theme/theme-const";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeMenuItems({
  showLabel = true,
}: Readonly<{
  showLabel?: boolean;
}>) {
  const { setTheme } = useTheme();

  return (
    <>
      {showLabel ? (
        <>
          <DropdownMenuLabel>主題</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      ) : null}
      <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
        <Sun />
        <span>淺色</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
        <Moon />
        <span>深色</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme(Theme.SYSTEM)}>
        <Monitor />
        <span>瀏覽器預設</span>
      </DropdownMenuItem>
    </>
  );
}
