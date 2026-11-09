"use client";

import CustomLink from "@/components/_general/_custom/link/custom-link";
import { useSidebar } from "@/external/shadcn/components/ui/sidebar";
import { ComponentProps, MouseEvent } from "react";

export default function SidebarNavLink({
  onClick,
  ...props
}: Readonly<ComponentProps<typeof CustomLink>>) {
  const { setOpenMobile } = useSidebar();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    setOpenMobile(false);
  };

  return <CustomLink {...props} onClick={handleClick} />;
}
