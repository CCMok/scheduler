import CustomCard from "@/components/_general/card/custom-card";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";
import { getUsersWithRoleService } from "@/libs/user/services/get-users-with-role-service";
import { notFound, redirect } from "next/navigation";
import UserViewOnlyField from "./user-view-only-field";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getUser = async (id: number): Promise<UserExcludePasswordWithRole | undefined> => {
  const response = await getUsersWithRoleService(id);
  const data = handleGetResponse(response, redirect, [])
  return data[0];
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