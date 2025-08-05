'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useCallback, useEffect, useRef } from "react";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";
import { usePostSettingFilterStore } from "@/components/store/setting/post/post-setting-filter-store-provider";
import { useRouter } from "next/navigation";
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";

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

  const setPosts = usePostSettingStore(state => state.setPosts);
  const setDepartmentId = usePostSettingStore(state => state.setDepartmentId);

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const fetchPosts = useCallback(async () => {
    const request: GetPostsRequest = {
      departmentId: Number(departmentId),
    }

    const response = await getPostsAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })

      return
    }

    setPosts(uiResponse.data)
  }, [departmentId, router, setPosts])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      fetchPosts()
      setDepartmentId(Number(departmentId))
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, router, fetchPosts, setDepartmentId])
}

export default function PostSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}