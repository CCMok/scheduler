'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useCallback, useEffect, useRef } from "react";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";
import { usePostSettingFilterStore } from "@/components/store/setting/post/post-setting-filter-store-provider";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { useRouter } from "next/navigation";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action";
import { fetchData } from "@/libs/share/_general/utils/fetch";

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
  const { control } = useFormContext<PostSettingFormInput>();

  const router = useRouter();

  const departments = usePostSettingFilterStore(state => state.departments);

  const setDepartmentId = usePostSettingStore(state => state.setDepartmentId);
  const setPosts = usePostSettingStore(state => state.setPosts);

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const onDepartmentIdChange = useCallback(async (departmentId: number) => {
    const request: GetPostsRequest = {
      where: { departmentId },
    }

    const posts = await fetchData(
      async () => await getPostsAction(request),
      path => router.push(path)
    )
    setPosts(posts)

    setDepartmentId(departmentId)
  }, [setPosts, setDepartmentId, router])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      onDepartmentIdChange(Number(departmentId));
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, onDepartmentIdChange])
}

export default function PostSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}