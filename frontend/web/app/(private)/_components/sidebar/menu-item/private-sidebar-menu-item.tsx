import { MainItem } from "../utils/menu-item";
import LinkMenuItem from "./link-menu-item";
import CollapsibleMenuItem from "./collapsible-menu-item";

type Props = {
  item: MainItem;
}

export default function PrivateSidebarMenuItem({
  item,
}: Readonly<Props>) {
  if ('url' in item) return (
    <LinkMenuItem
      title={item.title}
      url={item.url}
      icon={item.icon}
    />
  )

  return (
    <CollapsibleMenuItem
      title={item.title}
      icon={item.icon}
      items={item.children}
    />
  )
}