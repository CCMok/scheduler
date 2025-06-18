'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { RosterFilterFormInput, rosterFilterFormInputSchema } from "@/libs/client/roster/models/roster-filter-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormSubmitButton from "@/components/form/form-submit-button"
import { DEFAULT_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant"
import BasicFilter from "./basic/basic-filter"
import OffFilter from "./off/off-filter"
import { useRosterStore } from "@/components/store/roster/roster-store-provider"
import { useMemo, useState } from "react"
import { getArrangeRosterRequest } from "@/libs/server/roster/model/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/action/arrange-roster-action"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { getRootMessage } from "@/libs/client/_general/utils/form-utils"
import FormRootMessage from "@/components/form/form-root-message"
import { CalendarSync } from "lucide-react"
import RosterFilterFormAlertDialog from "./roster-filter-form-alert-dialog"

export default function RosterFilterForm() {
  const { organizations, isGenerated, setSchedules, setIsGenerated } = useRosterStore(state => state);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { defaultOrganizationId, defaultDepartmentId } = useMemo(() => {
    const firstOrganization = organizations?.[0];
    const orgId = firstOrganization?.id?.toString() ?? '';
    const deptId = firstOrganization?.departments?.[0]?.id?.toString() ?? '';

    return {
      defaultOrganizationId: orgId,
      defaultDepartmentId: deptId,
    };
  }, [organizations]);

  const form = useForm({
    resolver: zodResolver(rosterFilterFormInputSchema),
    defaultValues: {
      organizationId: defaultOrganizationId,
      departmentId: defaultDepartmentId,
      dayCount: DEFAULT_DAY_COUNT,
      offs: [],
    },
  })

  const onSubmitInternal = async (input: RosterFilterFormInput) => {
    const request = getArrangeRosterRequest(input);

    const response = await arrangeRosterAction(request);

    if (response.status !== ServerResponseStatus.OK) {
      const rootMessage = getRootMessage(response)
      form.setError('root', { type: rootMessage.title, message: rootMessage.content })
      return
    }

    setSchedules(response.data)
    setIsGenerated(true)
  }

  const onSubmit = async (input: RosterFilterFormInput) => {
    if (isGenerated) {
      setIsAlertDialogOpen(true);
      return;
    }

    await onSubmitInternal(input);
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <BasicFilter />
        <OffFilter />

        <div className='flex justify-end'>
          <FormSubmitButton
            icon={<CalendarSync />}
          >
            {isGenerated ? '重新生成' : '確認'}
          </FormSubmitButton>
        </div>

        <FormRootMessage />

        <RosterFilterFormAlertDialog isOpen={isAlertDialogOpen} setIsOpen={setIsAlertDialogOpen} />
      </form>
    </Form>
  )
}