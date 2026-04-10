import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import UpdatePasswordCard from "./_components/update-password-card";

export default function UserSettingPage() {
  return (
    <HeaderLayout
      title={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>設定</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>用戶</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <UpdatePasswordCard />
    </HeaderLayout>
  )
}