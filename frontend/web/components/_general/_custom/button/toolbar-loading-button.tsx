import { ComponentProps } from "react";
import LoadingButton from "./loading-button";

/** Compact loading action for toolbar / chrome rows. Defaults to `size="sm"`. */
export default function ToolbarLoadingButton({
  size = "sm",
  ...props
}: Readonly<ComponentProps<typeof LoadingButton>>) {
  return <LoadingButton size={size} {...props} />;
}
