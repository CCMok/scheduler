import { Slider } from "@/external/shadcn/components/ui/slider";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Slider> & {
  label?: string;
}

export default function CustomSlider({
  label = '',
  ...props
}: Readonly<Props>) {
  const currentValue = props.value ?? props.defaultValue;
  const displayValue = Array.isArray(currentValue) ? currentValue[0] : currentValue;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <span className="text-sm font-medium text-primary">
          {displayValue ?? ''}
        </span>
      </div>
      <div>
        <Slider {...props} />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{props.min}</span>
        <span>{props.max}</span>
      </div>
    </div>
  );
}