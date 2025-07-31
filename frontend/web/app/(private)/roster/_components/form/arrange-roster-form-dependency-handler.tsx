'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { useFormContext, useWatch } from "react-hook-form";
import { getDefaultDepartmentIdInDepartments, getDefaultOrganizationId } from "../../../../../libs/client/organization/utils/organization-utils";
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { useCallback, useEffect, useRef } from "react";
import { DEFAULT_DAYS } from "@/libs/share/roster/constants/roster-constant";
import { OffDay } from "@/libs/client/roster/models/off-day";
import { format } from "date-fns";
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request";
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response";
import { ClientMessage } from "@/libs/client/_general/models/client-message";
import { Worker } from "@/external/prisma-generated";

const useHandleOrganizationId = () => {
  const { control, resetField } = useFormContext<ArrangeRosterFormInput>();

  const organizations = useArrangeRosterFilterStore(state => state.organizations);
  const setDepartments = useArrangeRosterFilterStore(state => state.setDepartments);

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
  const { control, resetField, setError } = useFormContext<ArrangeRosterFormInput>();

  const departments = useArrangeRosterFilterStore(state => state.departments);
  const setWorkers = useArrangeRosterFilterStore(state => state.setWorkers);
  
  const { handleServerResponse } = useServerResponseHandler();

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: getDefaultDepartmentIdInDepartments(departments),
  })

  const onSuccess = useCallback((response: SuccessResponse<Worker[]>) => {
    setWorkers(response.data)
    resetField('offs')
  }, [setWorkers, resetField])

  const onError = useCallback((_: ServerResponse, clientMessage: ClientMessage) => {
    setError('root', { type: clientMessage.title, message: clientMessage.content })
  }, [setError])

  const fetchWorkers = useCallback(async (departmentId: string) => {
    const request: GetWorkersRequest = { departmentId: Number(departmentId) }
    const response = await getWorkersAction(request)
    await handleServerResponse(response, onSuccess, onError)
  }, [handleServerResponse, onSuccess, onError])

  const previousDepartmentId = useRef<string>('');

  useEffect(() => {
    if (departmentId !== previousDepartmentId.current) {
      fetchWorkers(departmentId)
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, fetchWorkers])
}

const useHandleDays = () => {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  const setOffDays = useArrangeRosterFilterStore(state => state.setOffDays);

  const days = useWatch({
    control,
    name: 'days',
    defaultValue: DEFAULT_DAYS,
  })

  useEffect(() => {
    const offDays: OffDay[] = days
      .toSorted((a, b) => a.getTime() - b.getTime())
      .map(day => ({
        value: day.toISOString(),
        name: format(day, 'yyyy-MM-dd'),
      }))

    setOffDays(offDays)
  }, [days, setOffDays])
}

export default function ArrangeRosterFormDependencyHandler() {
  useHandleOrganizationId();
  useHandleDepartmentId();
  useHandleDays();
  return <></>
}