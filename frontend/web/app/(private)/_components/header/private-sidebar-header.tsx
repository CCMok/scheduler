import DropdownMenuItem from "@/components/dropdown/dropdown-menu-item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import {
  SidebarHeader as ShadcnSidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
import { Building2, ChevronDown } from "lucide-react"
import Link from "next/link"
import SidebarMenuItemUser from "./sidebar-menu-item-user"

export default function PrivateSidebarHeader() {
  return (
    <ShadcnSidebarHeader>
        <SidebarMenu>
          <SidebarMenuItemUser />
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Building2 />
                  <span>組織1</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width)'
              >
                {/* TODO get user's tenant */}
                {/* TODO DropdownMenu Radio */}
                <DropdownMenuItem asChild>
                  <Link href="#">
                    <Building2 />
                    <span>組織1</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#">
                    <Building2 />
                    <span>組織2</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </ShadcnSidebarHeader>
  )
}