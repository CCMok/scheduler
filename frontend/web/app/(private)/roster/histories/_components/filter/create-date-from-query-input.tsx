'use client'

import PlainButton from "@/components/_general/button/plain-button";
import LabelInput from "@/components/_general/input/label-input";
import { Calendar } from "@/external/shadcn/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover";
import { cn } from "@/external/shadcn/libs/utils";
import { Param } from "@/libs/share/_general/enums/param";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DateRange } from "react-day-picker";

export default function CreateDateFromQueryInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fromDate = searchParams.get(Param.CREATE_DATE_FROM);
  const toDate = searchParams.get(Param.CREATE_DATE_TO);

  const selectedValue: DateRange = {
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  };

  const onSelect = useCallback((value: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set(Param.CREATE_DATE_FROM, value?.from ? format(value.from, 'yyyy/MM/dd') : '');
    params.set(Param.CREATE_DATE_TO, value?.to ? format(value.to, 'yyyy/MM/dd') : '');
    const paramString = params.toString();
    router.replace(`${pathname}?${paramString}`);
  }, [searchParams, router, pathname])

  const onClear = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(Param.CREATE_DATE_FROM);
    params.delete(Param.CREATE_DATE_TO);
    const paramString = params.toString();
    router.replace(`${pathname}?${paramString}`);
  }, [searchParams, router, pathname])

  return (
    <LabelInput label="建立日期">
      <Popover>
        <PopoverTrigger asChild>
          <PlainButton
            variant={"outline"}
            className={cn(
              "w-(--input-width)",
              !selectedValue.from && !selectedValue.to && "text-muted-foreground"
            )}
          >
            {selectedValue.from || selectedValue.to ? (
              <span>
                {selectedValue.from && format(selectedValue.from, 'yyyy/MM/dd')} - {selectedValue.to && format(selectedValue.to, 'yyyy/MM/dd')}
              </span>
            ) : (
              <span>選擇</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </PlainButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            required={false}
            selected={selectedValue}
            onSelect={onSelect}
            captionLayout="dropdown"
          />
          <PlainButton
            variant="ghost"
            onClick={onClear}
            className="w-full"
          >
            <XIcon />
            清除
          </PlainButton>
        </PopoverContent>
      </Popover>
    </LabelInput>
  )
}