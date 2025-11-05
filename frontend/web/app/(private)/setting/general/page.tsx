import { getSession } from "@/libs/access/managers/session-manager";
import UpdatePasswordForm from "./_components/update-password-form";
import UpdateUserNameForm from "./_components/update-user-name-form";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";

export default function UserSettingPage() {
  const sessionPromise = getSession();

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
        <Suspense fallback={<InputCardSkeleton />}>
          <UpdateUserNameForm sessionPromise={sessionPromise} />
        </Suspense>
      </div>
    </SidebarInsetLayout>
  )
}