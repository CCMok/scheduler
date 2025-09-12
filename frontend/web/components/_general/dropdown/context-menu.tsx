import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/external/shadcn/components/ui/dropdown-menu';
import { Button } from '@/external/shadcn/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ChildrenProps } from '@/libs/share/_general/props/children-props';
import { ComponentProps } from 'react';

type Props = ChildrenProps & {
  contentProps?: ComponentProps<typeof DropdownMenuContent>;
}

export default function ContextMenu({
  children,
  contentProps,
}: Readonly<Props>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">開啟選單</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' {...contentProps}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 