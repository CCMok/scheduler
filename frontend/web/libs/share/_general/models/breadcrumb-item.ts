import { ReactNode } from "react";

export type BreadcrumbItem = {
  key: string;
  label?: ReactNode;
  href?: string;
}