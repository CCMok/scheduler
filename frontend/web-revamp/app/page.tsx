'use client'

import { Button } from "@/external/shadcn/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <h1>Hello World</h1>
      <Button onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }}>Click me</Button>
    </div>
  );
}
