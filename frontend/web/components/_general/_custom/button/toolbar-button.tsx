import { ComponentProps } from "react";
import CustomButton from "./custom-button";

/** Compact action for toolbar / chrome rows. Defaults to `size="sm"`. */
export default function ToolbarButton({
  size = "sm",
  ...props
}: Readonly<ComponentProps<typeof CustomButton>>) {
  return <CustomButton size={size} {...props} />;
}
