'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useCallback, useEffect, useRef } from "react";
import { WorkerSettingFormInput } from "@/libs/client/worker/models/worker-setting-form-input";
import { useWorkerSettingFilterStore } from "@/components/store/setting/worker/worker-setting-filter-store-provider";
import { useRouter } from "next/navigation";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";
import { fetchWorkers } from "@/libs/share/worker/utils/fetch-workers-utils";

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

  const onDepartmentIdChange = useCallback(async (departmentId: number) => {
    const workers = await fetchWorkers(departmentId, path => router.push(path))
    setWorkers(workers)

    setDepartmentId(departmentId)
  }, [setWorkers, setDepartmentId, router])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      onDepartmentIdChange(Number(departmentId));
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, onDepartmentIdChange])
}

export default function WorkerSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}