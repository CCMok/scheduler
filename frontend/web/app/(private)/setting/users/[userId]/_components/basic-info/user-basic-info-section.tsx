import CustomCard from "@/components/_general/card/custom-card";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { UserExcludePasswordRole } from "@/libs/server/user/models/user-dao";
import { getUsersRoleService } from "@/libs/server/user/services/get-users-role-service";
import { notFound, redirect } from "next/navigation";
import UserViewOnlyField from "./user-view-only-field";

const getUser = async (id: number): Promise<UserExcludePasswordRole | undefined> => {
  const users = await fetchData(
    async () => await getUsersRoleService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return users[0];
}

type Props = {
  id: number;
}

const UserBasicInfoSectionContent = async ({
  id,
}: Readonly<Props>) => {
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <CustomCard>
      <UserViewOnlyField 
        label="電郵地址"
        id="email"
        value={user.email}
      />
      <UserViewOnlyField
        label="名稱"
        id="name"
        value={user.name ?? ''}
      />
      <UserViewOnlyField
        label="權限"
        id="role"
        value={user.role.name}
      />
    </CustomCard>
  )
}

export default function UserBasicInfoSection({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UserBasicInfoSectionContent id={id} />
    </Suspense>
  )
}