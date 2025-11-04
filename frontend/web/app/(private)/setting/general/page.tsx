import { getSession } from "@/libs/access/managers/session-manager";
import UpdatePasswordForm from "./_components/update-password-form";
import UpdateUserNameForm from "./_components/update-user-name-form";
import { redirect } from "next/navigation";
import { REDIRECT_PUBLIC_PATH } from "@/libs/_general/enums/path";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";

export default async function UserSettingPage() {
  const session = await getSession();
  if (!session) return redirect(REDIRECT_PUBLIC_PATH);

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'general',
          label: '一般',
        },
      ]}
    >
      <div className="space-y-4">
        <UpdatePasswordForm />
        <UpdateUserNameForm userName={session.name ?? ''} />
      </div>
    </SidebarInsetLayout>
  )
}