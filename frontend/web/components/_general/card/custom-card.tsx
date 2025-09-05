import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ReactNode } from "react";

type Props = ChildrenProps & {
  title?: ReactNode;
}

export default function CustomCard({
  children,
  title,
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
    </Card>
  )
}