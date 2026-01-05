import Combobox from "@/components/_general/_custom/combobox/combobox";
import FieldLayout from "@/components/_general/form/field/field-layout";
import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/external/shadcn/components/ui/breadcrumb";
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field";

export default function RosterPage() {
  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>值班表</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <div className='space-y-4'>
        <FieldGroup>
          <FieldSet className='flex flex-row items-center'>
            <FieldLayout className='w-(--input-width)'>
              <Combobox
                placeHolder="選擇圑隊"
              />
            </FieldLayout>
            <span>Auto button to auto-schedule</span>
          </FieldSet>
        </FieldGroup>
        <div className='space-x-4'>
          <span>Previous button</span>
          <span>Roster Name (Click to Combobox search)</span>
          <span>Next button</span>
        </div>
        <div>
          <p>Roster table</p>
          <p>- Default show latest roster</p>
        </div>
      </div>
    </HeaderLayout>
  )
}