'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/external/shadcn/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import CustomButton from "../_custom/button/custom-button";
import ThemeMenuItems from "./theme-menu-items";

export default function ThemeToggle({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton
          size="icon"
          variant="outline"
          className={className}
          aria-label="切換主題"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
