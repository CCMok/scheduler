import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { ChildrenProps } from "@/libs/_general/props/children-props";
import { ReactNode } from "react";
import { cn } from "@/external/shadcn/libs/utils";

type Props = ChildrenProps & {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
}

export default function CustomCard({
  children,
  title,
  description,
  footer,
  contentClassName,
}: Readonly<Props>) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("space-x-4 space-y-4", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex space-x-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}