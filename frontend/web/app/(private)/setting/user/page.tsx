import HeaderLayout from "@/components/_general/header/header-layout";
import SettingPageIntro from "@/components/_general/setting/setting-page-intro";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import UpdatePasswordCard from "./_components/update-password/update-password-card";
import UpdateNameCard from "./_components/update-name/update-name-card";
import { getUserName } from "@/libs/user/read/get-user-service";

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
      <div className="setting-stack">
        <SettingPageIntro
          title="用戶設定"
          support="管理顯示名稱與登入密碼。"
        />
        <UpdateNameCard userNamePromise={getUserName()} />
        <UpdatePasswordCard />
      </div>
    </HeaderLayout>
  )
}
