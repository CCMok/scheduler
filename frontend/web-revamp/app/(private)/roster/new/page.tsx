import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/external/shadcn/components/ui/breadcrumb";

export default function NewRosterPage() {
  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>新增值班表</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <div></div>
    </HeaderLayout>
  )
}