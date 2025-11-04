import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/external/shadcn/components/ui/breadcrumb"
import { BreadcrumbItem as TBreadcrumbItem } from "@/libs/_general/models/breadcrumb-item";

const MAX_BREADCRUMBS = 3;

type CustomBreadcrumbItemProps = {
  breadcrumb: TBreadcrumbItem;
  isFirst?: boolean;
}

const CustomBreadcrumbItem = ({
  breadcrumb,
  isFirst,
}: Readonly<CustomBreadcrumbItemProps>) => (
  <>
    {!isFirst && <BreadcrumbSeparator />}
    <BreadcrumbItem>
      {breadcrumb.href
        ? <BreadcrumbLink
          href={breadcrumb.href}
          className='max-w-[100px] truncate'
        >
          {breadcrumb.label}
        </BreadcrumbLink>
        : <BreadcrumbPage className='max-w-[100px] truncate'>{breadcrumb.label}</BreadcrumbPage>
      }
    </BreadcrumbItem>
  </>
)

type BreadCrumbsProps = {
  breadcrumbItems: TBreadcrumbItem[];
}

const NormalBreadcrumbs = ({
  breadcrumbItems,
}: Readonly<BreadCrumbsProps>) => (
  <>
    {breadcrumbItems.map((breadcrumb, index) => (
      <CustomBreadcrumbItem
        key={breadcrumb.key}
        breadcrumb={breadcrumb}
        isFirst={index === 0}
      />
    ))}
  </>
)

const CollapsedBreadcrumbs = ({
  breadcrumbItems,
}: Readonly<BreadCrumbsProps>) => {
  return (
    <>
      <CustomBreadcrumbItem breadcrumb={breadcrumbItems[0]} isFirst />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbEllipsis className='size-5' />
      </BreadcrumbItem>
      {breadcrumbItems.slice(breadcrumbItems.length - (MAX_BREADCRUMBS - 1), breadcrumbItems.length).map(breadcrumb => (
        <CustomBreadcrumbItem key={breadcrumb.key} breadcrumb={breadcrumb} />
      ))}
    </>
  )
}

type Props = {
  breadcrumbItems?: TBreadcrumbItem[];
}

export default function CustomBreadcrumb({
  breadcrumbItems,
}: Readonly<Props>) {
  if (!breadcrumbItems) return <></>;
  return (
    <Breadcrumb>
      <BreadcrumbList className='truncate'>
        {breadcrumbItems.length <= MAX_BREADCRUMBS
          ? <NormalBreadcrumbs breadcrumbItems={breadcrumbItems} />
          : <CollapsedBreadcrumbs breadcrumbItems={breadcrumbItems} />
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}