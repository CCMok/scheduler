import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ThemeProvider } from "./theme-provider";

export default function RootProvider({ children }: ChildrenProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}