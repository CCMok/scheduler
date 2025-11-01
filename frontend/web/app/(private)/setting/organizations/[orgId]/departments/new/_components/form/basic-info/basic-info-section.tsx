'use client'

import NextButton from "@/components/_general/button/next-button";
import CustomCard from "@/components/_general/card/custom-card";
import { CreateDepartmentFormInput } from "@/libs/client/department/models/create-department-form-input";
import { useFormContext } from "react-hook-form";
import DepartmentNameFormField from "./department-name-form-field";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { ServiceMessage } from "@/libs/share/_general/enums/service-message";
import { getDepartmentsAction } from "@/libs/server/department/actions/get-departments-action";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

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
      toast.error(UiMessageTitle.INPUT_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: ServiceMessage.FOUND.replaceAll('{0}', '部門名稱'),
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