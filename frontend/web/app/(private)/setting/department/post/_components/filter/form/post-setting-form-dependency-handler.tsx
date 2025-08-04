'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useEffect, useRef } from "react";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";
import { usePostSettingFilterStore } from "@/components/store/setting/post/post-setting-filter-store-provider";
import { useRouter } from "next/navigation";
import { PATH } from "@/libs/share/_general/utils/path";

const useHandleOrganizationId = () => {
  const { control, resetField } = useFormContext<PostSettingFormInput>();

  const organizations = usePostSettingFilterStore(state => state.organizations);
  const setDepartments = usePostSettingFilterStore(state => state.setDepartments);

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
  const { control, } = useFormContext<PostSettingFormInput>();

  const router = useRouter();

  const departments = usePostSettingFilterStore(state => state.departments);

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      router.push(PATH.setting.department.post.build(departmentId))
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, router])
}

export default function PostSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}