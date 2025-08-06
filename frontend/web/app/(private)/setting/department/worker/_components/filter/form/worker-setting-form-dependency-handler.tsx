'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useCallback, useEffect, useRef } from "react";
import { WorkerSettingFormInput } from "@/libs/client/worker/models/worker-setting-form-input";
import { useWorkerSettingFilterStore } from "@/components/store/setting/worker/worker-setting-filter-store-provider";
import { useRouter } from "next/navigation";
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request";

const useHandleOrganizationId = () => {
  const { control, resetField } = useFormContext<WorkerSettingFormInput>();

  const organizations = useWorkerSettingFilterStore(state => state.organizations);
  const setDepartments = useWorkerSettingFilterStore(state => state.setDepartments);

  const organizationId = useWatch({
    control,
    name: 'organizationId',
    defaultValue: getDefaultOrganizationId(organizations),
  })

  useEffect(() => {
    const organization = organizations.find(organization => organization.id.toString() === organizationId)
    const departments = organization ? organization.departments : [];

    setDepartments(departments)

    const defaultDeparmtentId = getDefaultDepartmentIdInDepartments(departments)
    resetField('departmentId', { defaultValue: defaultDeparmtentId })
  }, [organizations, organizationId, setDepartments, resetField])
}

const useHandleDepartmentId = () => {
  const { control } = useFormContext<WorkerSettingFormInput>();

  const router = useRouter();

  const departments = useWorkerSettingFilterStore(state => state.departments);

  const setWorkers = useWorkerSettingStore(state => state.setWorkers);
  const setDepartmentId = useWorkerSettingStore(state => state.setDepartmentId);

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const fetchWorkers = useCallback(async () => {
    const request: GetWorkersRequest = {
      departmentId: Number(departmentId),
    }

    const response = await getWorkersAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })

      return
    }

    setWorkers(uiResponse.data)
  }, [departmentId, router, setWorkers])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      fetchWorkers()
      setDepartmentId(Number(departmentId))
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, router, fetchWorkers, setDepartmentId])
}

export default function WorkerSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}