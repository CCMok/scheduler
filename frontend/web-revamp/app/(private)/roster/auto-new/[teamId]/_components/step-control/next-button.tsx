import LoadingButton from "@/components/_general/_custom/button/loading-button";
import { cn } from "@/external/shadcn/libs/utils";
import { ChevronRight } from "lucide-react";
import { ComponentProps } from "react";

export default function NextButton({
  className,
  ...props
}: Readonly<ComponentProps<typeof LoadingButton>>) {
  return (
    <LoadingButton className={cn('ml-auto', className)} {...props}>
      下一步
      <ChevronRight />
    </LoadingButton>
  )
}