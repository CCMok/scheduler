import { Badge } from "@/external/shadcn/components/ui/badge";
import { cn } from "@/external/shadcn/libs/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useMultiSelectComboboxContext } from "../../multi-select-combobox-context";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";

export const getTriggerBadgeClassName = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type TriggerBadgeVariant = VariantProps<typeof getTriggerBadgeClassName>;

type Props = ChildrenProps & ClassNameProps;

export default function TriggerBadge<T>({
  children,
  className,
}: Readonly<Props>) {
  const {
    badgeVariant,
  } = useMultiSelectComboboxContext<T>();

  return (
    <Badge className={cn(
      getTriggerBadgeClassName({ variant: badgeVariant }),
      className,
    )}>
      {children}
    </Badge>
  )
}