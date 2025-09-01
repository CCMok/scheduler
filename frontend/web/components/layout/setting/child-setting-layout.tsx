import CustomButton from "@/components/button/custom-button";
import CustomLink from "@/components/link/custom-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Link } from "lucide-react";

type Props = {
  childName?: string;
  href?: string;
}

export default function ChildSettingLayout({
  childName,
  href,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{childName}</CardTitle>
        <CardDescription>
          前往管理頁面
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-end'>
        <CustomButton asChild>
          <CustomLink href={href ?? ''}>
            <Link />
            <span>前往</span>
          </CustomLink>
        </CustomButton>
      </CardContent>
    </Card>
  )
}