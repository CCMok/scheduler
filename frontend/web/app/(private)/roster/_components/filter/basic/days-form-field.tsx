'use client'

import CustomButton from "@/components/button/custom-button"
import CustomFormItem from "@/components/form/custom-form-item"
import { Calendar } from "@/external/shadcn/components/ui/calendar"
import { FormControl, FormField } from "@/external/shadcn/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { CalendarIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"

export default function DaysFormField() {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  return (
    <FormField
      control={control}
      name='days'
      render={({ field }) => (
        <CustomFormItem label='日期'>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <CustomButton
                    variant={"outline"}
                    className={cn(
                      "w-(--input-width)",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length ? (
                      `已選擇${field.value.length}天`
                    ) : (
                      <span>選擇</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </CustomButton>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}