import { BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { Slash } from "lucide-react";

export default function CustomBreadcrumbSeparator() {
  return (
    <BreadcrumbSeparator>
      <Slash className='rotate-135' />
    </BreadcrumbSeparator>
  )
}