'use client'

import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils";
import { useCallback, useEffect, useRef } from "react";
import { PostSettingFormInput } from "@/libs/client/post/models/post-setting-form-input";
import { usePostSettingFilterStore } from "@/components/store/setting/post/post-setting-filter-store-provider";
import { getGetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { ClientMessage } from "@/libs/client/_general/models/client-message";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { Post } from "@/external/prisma-generated";
import { useFetchPosts } from "@/libs/client/post/hooks/use-fetch-posts";

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
  const { control, handleSubmit, setError } = useFormContext<PostSettingFormInput>();

  const departments = usePostSettingFilterStore(state => state.departments);

  const setPosts = usePostSettingStore(state => state.setPosts);
  const setDepartmentId = usePostSettingStore(state => state.setDepartmentId);

  const onSuccess = useCallback((response: SuccessResponse<Post[]>) => {
    setPosts(response.data)
  }, [setPosts])

  const onError = useCallback((_: ServerResponse, clientMessage: ClientMessage) => {
    setError('root', { type: clientMessage.title, message: clientMessage.content })
  }, [setError])

  const { fetchPosts } = useFetchPosts(onSuccess, onError);

  const onSubmit = useCallback(async (input: PostSettingFormInput) => {
    const request = getGetPostsRequest(input)
    await fetchPosts(request)
  }, [fetchPosts])

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      setDepartmentId(Number(departmentId))
      handleSubmit(onSubmit)()
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, handleSubmit, onSubmit, setDepartmentId])
}

export default function PostSettingFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  return <></>
}