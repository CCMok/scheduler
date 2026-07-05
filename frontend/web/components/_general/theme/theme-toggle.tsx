'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu";
import { Theme } from "@/libs/_general/theme/theme-const";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import CustomButton from "../_custom/button/custom-button";

export default function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton size='icon' variant='outline'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>主題</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>淺色</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>深色</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.SYSTEM)}>瀏覽器預設</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}