import { Sheet, SheetContent } from "@/external/shadcn/components/ui/sheet";
import { ReactNode } from "react";
import { cn } from "@/external/shadcn/libs/utils";
import { DetailPanelMode, DetailPanelState } from "./detail-panel-state";

export default function SheetBase({
  open,
  setDetailPanelState,
  children,
  className,
}: Readonly<{
  open: boolean;
  setDetailPanelState: (state: DetailPanelState) => void;
  children?: ReactNode;
  className?: string;
}>) {
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => !open && setDetailPanelState({ mode: DetailPanelMode.IDLE })}
    >
      <SheetContent side='bottom' className={cn('px-2 pb-2', className)}>
        {children}
      </SheetContent>
    </Sheet>
  )
}