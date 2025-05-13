import { ChildrenProps } from "@/libs/share/props/children-props";
import { ThemeProvider } from "../../general/providers/theme-provider";

export default function RootProvider({ children }: ChildrenProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}