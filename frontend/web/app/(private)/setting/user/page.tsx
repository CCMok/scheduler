import { getSession } from "@/libs/server/_general/managers/session-manager";
import UpdatePasswordForm from "./_components/update-password-form";
import UpdateUserNameForm from "./_components/update-user-name-form";
import { redirect } from "next/navigation";
import { REDIRECT_PUBLIC_PATH } from "@/libs/share/_general/utils/path";
import BreadcrumbHeaderLayout from "@/components/_general/layout/setting/breadcrumb-header-layout";

export default async function UserSettingPage() {
  const session = await getSession();
  if (!session) return redirect(REDIRECT_PUBLIC_PATH);

  return (
    <BreadcrumbHeaderLayout current='用戶'>
      <UpdatePasswordForm />
      <UpdateUserNameForm userName={session.name ?? ''} />
    </BreadcrumbHeaderLayout>
  )
}