import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";
import { UserExcludePasswordWithRole } from "@/libs/server/user/models/user-dao";
import { getUsersWithRoleService } from "@/libs/server/user/services/get-users-with-role-service";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getUser = async (id: number): Promise<UserExcludePasswordWithRole | undefined> => {
  const response = await getUsersWithRoleService(id);
  const data = handleGetResponse(response, redirect, [])
  return data[0];
}

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function UserEmailContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const user = await getUser(id);
  if (!user) {
    if (failNotFound) notFound();
    return '';
  }

  return user.email;
}

export default function UserEmail({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <UserEmailContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}