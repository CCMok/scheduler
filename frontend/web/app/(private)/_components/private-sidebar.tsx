import DropdownMenuItem from "@/components/dropdown/dropdown-menu-item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import { Separator } from "@/external/shadcn/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
import { getSession } from "@/libs/server/_general/manager/session-manager"
import { Path } from "@/libs/share/_general/enums/path"
import { Building2, Calendar, ChevronDown, Home, LogOut, Moon, Settings, Sun, User } from "lucide-react"
import Link from "next/link"
import { ComponentProps } from "react"

// TODO: Replace url Path
const items = [
  {
    title: "主頁",
    url: Path.DASHBOARD,
    icon: Home,
  },
  {
    title: "值勤表",
    url: "#",
    icon: Calendar,
  },
  {
    title: "設定",
    url: "#",
    icon: Settings,
  },
]

type Props = ComponentProps<typeof Sidebar>

const getUserDisplayName = async (): Promise<string> => {
  const session = await getSession();
  if (!session) return '';

  return session.name ?? session.email;
}

// TODO mobile click to close sidebar

export async function PrivateSidebar(props: Readonly<Props>) {
  const userDispalyName = await getUserDisplayName();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User />
                  <span>{userDispalyName}</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width)'
              >
                {/* TODO function implement */}
                <DropdownMenuItem asChild>
                  <Link href="/logout">
                    <LogOut />
                    <span>登出</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user-setting">
                    <Settings />
                    <span>用戶設定</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* TODO theme implement */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Sun />
                  <span>Light</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width)'
              >
                <DropdownMenuItem asChild>
                  <Link href="/logout">
                    <Moon />
                    <span>Dark</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/logout">
                    <Moon />
                    <span>System</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}