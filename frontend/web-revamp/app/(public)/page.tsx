'use client'

import ThemeToggle from "@/components/_general/theme/theme-toggle";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <h1>Hello World</h1>
      <ThemeToggle />
    </div>
  );
}
