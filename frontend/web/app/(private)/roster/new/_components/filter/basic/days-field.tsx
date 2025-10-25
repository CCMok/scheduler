import { useFormContext } from "react-hook-form";
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../create-roster-form-input";
import { FormField } from "@/external/shadcn/components/ui/form";
import CustomFormItem from "@/components/_general/form/custom-form-item";
import MultiPopupCalendar from "@/components/_general/calendar/multi-popup-calendar";

export default function DaysField() {
  const { control } = useFormContext<CreateRosterFilterFormInput>();

  return (
    <FormField
      control={control}
      name={CreateRosterFilterKey.DAYS}
      render={({ field }) => (
        <CustomFormItem label='日期'>
          <MultiPopupCalendar
            selected={field.value}
            onSelect={dates => {
              field.onChange(dates);
              field.onBlur();
            }}
          />
        </CustomFormItem>
      )}
    />
  )
}