'use client'

import NextButton from "@/components/_general/button/next-button";
import CustomCard from "@/components/_general/card/custom-card";
import { CreateOrganizationFormInput } from "@/libs/client/organization/models/create-organization-form-input";
import { useFormContext } from "react-hook-form";
import OrganizationNameFormField from "./organization-name-form-field";
import DepartmentNameFormField from "./department-name-form-field";
import { getOrganizationsAction } from "@/libs/server/organization/actions/get-organizations-action";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";
import { MessageContent, MessageTitle } from "@/libs/server/_general/enums/message";

const isOrganizationNameExist = async (name: string, router: AppRouterInstance): Promise<boolean> => {
  const response = await getOrganizationsAction(undefined, name)
  const organizations = handleGetResponse(response, router.push, [])
  return organizations.length > 0
}

type Props = {
  onClickNext: () => void;
}

export default function BasicInfoSection({
  onClickNext,
}: Readonly<Props>) {
  const { trigger, getValues } = useFormContext<CreateOrganizationFormInput>()

  const router = useRouter();

  const handleClickNext = async () => {
    const isValid = await trigger(['name', 'departmentName'])
    if (!isValid) return

    const isExist = await isOrganizationNameExist(getValues('name'), router)
    if (isExist) {
      toast.error(MessageTitle.INPUT_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: MessageContent.FOUND.replaceAll('{0}', '機構名稱'),
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