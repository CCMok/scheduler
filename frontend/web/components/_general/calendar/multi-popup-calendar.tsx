import PlainButton from '@/components/_general/button/plain-button'
import { Calendar } from "@/external/shadcn/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/external/shadcn/components/ui/popover"
import { cn } from "@/external/shadcn/libs/utils"
import { CalendarIcon } from "lucide-react"
import { PropsMulti, PropsMultiRequired } from 'react-day-picker'

type Props = Omit<PropsMulti, 'mode'> | Omit<PropsMultiRequired, 'mode'>

export default function MultiPopupCalendar({
  selected,
  ...props
}: Readonly<Props>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <PlainButton
          variant={"outline"}
          className={cn(
            "w-(--input-width)",
            !selected?.length && "text-muted-foreground"
          )}
        >
          {selected?.length ? (
            `已選擇${selected.length}天`
          ) : (
            <span>選擇</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </PlainButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="multiple"
          selected={selected}
          captionLayout="dropdown"
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}