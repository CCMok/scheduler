import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { Path } from "@/libs/_general/path/path";

export default async function RosterAutoNewPage({
  params,
}: Readonly<{
  params: Promise<{ teamId: string }>;
}>) {
  const { teamId } = await params
  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={Path.ROSTER}>值班表</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>自動排班</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
    </HeaderLayout>
  )
}