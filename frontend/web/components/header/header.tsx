import { ChevronLeft } from "lucide-react";
import CustomButton from "../button/custom-button";
import CustomLink from "../link/custom-link";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps & {
  backPath: string;
}

export default function Header({
  backPath,
  children,
}: Readonly<Props>) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <CustomButton size='icon' variant='ghost' asChild>
          <CustomLink href={backPath}>
            <ChevronLeft />
          </CustomLink>
        </CustomButton>
        {children}
      </div>
      <Separator />
    </div>
  )
}