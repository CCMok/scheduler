import { ChevronDown } from "lucide-react";

export default function TriggerEmptyDisplay() {
  return (
    <div className="flex items-center justify-between w-full mx-auto">
      <span className="text-sm text-muted-foreground mx-3">
        選擇
      </span>
      <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
    </div>
  )
}