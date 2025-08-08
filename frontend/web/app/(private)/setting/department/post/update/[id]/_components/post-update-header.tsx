import CustomButton from "@/components/button/custom-button";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { PATH } from "@/libs/share/_general/utils/path";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  postName: string;
}

export default async function PostUpdateHeader({
  postName,
}: Readonly<Props>) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <CustomButton size='icon' variant='ghost' asChild>
          <Link href={PATH.setting.department.post.base}>
            <ChevronLeft />
          </Link>
        </CustomButton>
        <span>{postName}</span>
      </div>
      <Separator />
    </div>
  )
}