import CustomButton from "@/components/button/custom-button";
import CustomLink from "@/components/link/custom-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Link } from "lucide-react";

export type Child = {
  name: string;
  href: string;
}

type Props = {
  entityName?: string;
  childrenManage?: Child[];
}

export default function ChildSettingLayout({
  entityName,
  childrenManage,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{entityName}管理</CardTitle>
        <CardDescription>
          前往管理頁面
        </CardDescription>
      </CardHeader>
      <CardContent className='flex gap-2'>
        {childrenManage?.map(child => (
          <CustomButton key={child.name} asChild>
            <CustomLink href={child.href}>
              <Link />
              <span>{child.name}管理</span>
            </CustomLink>
          </CustomButton>
        ))}
      </CardContent>
    </Card>
  )
}