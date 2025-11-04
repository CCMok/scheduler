'use client'

import NextButton from "@/components/_general/button/next-button";
import CustomCard from "@/components/_general/card/custom-card";
import { CreateDepartmentFormInput } from "@/libs/department/models/create-department-form-input";
import { useFormContext } from "react-hook-form";
import DepartmentNameFormField from "./department-name-form-field";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { getDepartmentsAction } from "@/libs/department/actions/get-departments-action";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { MessageContent, MessageTitle } from "@/libs/_general/enums/message";

const isDepartmentNameExist = async (name: string, router: AppRouterInstance): Promise<boolean> => {
  const response = await getDepartmentsAction(undefined, name)
  const departments = handleGetResponse(response, router.push, [])
  return departments.length > 0
}

type Props = {
  onClickNext: () => void;
}

export default function BasicInfoSection({
  onClickNext,
}: Readonly<Props>) {
  const { trigger, getValues } = useFormContext<CreateDepartmentFormInput>()

  const router = useRouter();

  const handleClickNext = async () => {
    const isValid = await trigger(['name'])
    if (!isValid) return

    const isExist = await isDepartmentNameExist(getValues('name'), router)
    if (isExist) {
      toast.error(MessageTitle.INPUT_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: MessageContent.FOUND.replaceAll('{0}', '部門名稱'),
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
        <DepartmentNameFormField />
      </div>
    </CustomCard>
  )
}