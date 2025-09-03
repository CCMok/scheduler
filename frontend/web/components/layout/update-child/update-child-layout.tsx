import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"

type Props = ChildrenProps & {
  childName?: string;
}

export default function UpdateChildLayout({
  children,
  childName,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{childName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}