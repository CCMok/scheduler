import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ReactNode } from "react";

type Props = ChildrenProps & {
  title?: ReactNode;
  footer?: ReactNode;
}

export default function CustomCard({
  children,
  title,
  footer,
}: Readonly<Props>) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
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