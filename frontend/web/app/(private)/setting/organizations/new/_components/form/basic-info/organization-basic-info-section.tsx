'use client'

import NextButton from "@/components/_general/button/next-button";
import CustomCard from "@/components/_general/card/custom-card";
import { CreateOrganizationWithChildrenFormInput } from "@/libs/client/organization/models/create-organization-with-children-form-input";
import { useFormContext } from "react-hook-form";
import OrganizationNameFormField from "./organization-name-form-field";
import DepartmentNameFormField from "./department-name-form-field";
import { getOrganizationsAction } from "@/libs/server/organization/actions/get-organizations-action";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { ServiceMessage } from "@/libs/share/_general/enums/service-message";

const isOrganizationNameExist = async (name: string, router: AppRouterInstance): Promise<boolean> => {
  const organizations = await fetchData(
    async () => await getOrganizationsAction({
      where: { name },
    }),
    path => router.push(path),
    [],
  )

  return organizations.length > 0;
}

type Props = {
  onClickNext: () => void;
}

export default function OrganizationBasicInfoSection({
  onClickNext,
}: Readonly<Props>) {
  const { trigger, getValues } = useFormContext<CreateOrganizationWithChildrenFormInput>()

  const router = useRouter();

  const handleClickNext = async () => {
    const isValid = await trigger(['name', 'departmentName'])
    if (!isValid) return

    const isExist = await isOrganizationNameExist(getValues('name'), router)
    if (isExist) {
      toast.error(UiMessageTitle.INPUT_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: ServiceMessage.FOUND.replaceAll('{0}', '組織名稱'),
      })
      return
    }

    onClickNext()
  }

  return (
    <CustomCard
      title="基本資料"
      footer={(
        <NextButton
          className="ml-auto"
          onClick={handleClickNext}
        />
      )}
    >
      <div className="space-y-4">
        <OrganizationNameFormField />
        <DepartmentNameFormField />
      </div>
    </CustomCard>
  )
}