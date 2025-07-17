import { getSession } from "@/libs/server/_general/managers/session-manager";
import UpdatePasswordForm from "./_component/update-password-form";
import UpdateUserNameForm from "./_component/update-user-name-form";
import { redirect } from "next/navigation";
import { REDIRECT_PUBLIC_PATH } from "@/libs/share/_general/enums/path";

export default async function UserSettingPage() {
  const session = await getSession();
  if (!session) return redirect(REDIRECT_PUBLIC_PATH);

  return (
    <div className='space-y-4'>
      <UpdatePasswordForm />
      <UpdateUserNameForm userName={session.name ?? ''} />
    </div>
  )
}