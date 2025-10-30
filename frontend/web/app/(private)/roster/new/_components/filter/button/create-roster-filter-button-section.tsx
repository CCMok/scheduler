import FormSubmitButton from "@/components/_general/form/form-submit-button";
import CreateRosterFilterResetButton from "./create-roster-filter-reset-button";
import { CalendarSync } from "lucide-react";

export default function CreateRosterFilterButtonSection() {
  return (
    <div className='flex justify-end space-x-2'>
      <CreateRosterFilterResetButton />
      <FormSubmitButton
       icon={<CalendarSync />}
      >
        確認
      </FormSubmitButton>
    </div>
  )
}