import CustomButton from "@/components/button/custom-button";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { GetPostNameRequest } from "@/libs/server/post/models/get-post-name-request";
import { getPostNameService } from "@/libs/server/post/services/get-post-name-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { PATH } from "@/libs/share/_general/utils/path";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const getPostName = async (id: number): Promise<string> => {
  const request: GetPostNameRequest = { id }

  // TODO: check other fetchData / datum, if server component should directly use service not action
  const name = await fetchData(
    async () => getPostNameService(request),
    path => redirect(path),
    '',
  )

  return name;
}

type Props = {
  postId: number;
}

export default async function PostUpdateHeader({
  postId,
}: Readonly<Props>) {
  const postName = await getPostName(postId);

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