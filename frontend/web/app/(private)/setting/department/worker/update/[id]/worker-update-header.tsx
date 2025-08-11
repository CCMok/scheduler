import CustomButton from "@/components/button/custom-button";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { PATH } from "@/libs/share/_general/utils/path";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  workerName: string;
}

export default async function WorkerUpdateHeader({
  workerName,
}: Readonly<Props>) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <CustomButton size='icon' variant='ghost' asChild>
          <Link href={PATH.setting.department.worker.base}>
            <ChevronLeft />
          </Link>
        </CustomButton>
        <span>{workerName}</span>
      </div>
      <Separator />
    </div>
  )
}