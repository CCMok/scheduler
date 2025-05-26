import DropdownMenuItem from "@/components/dropdown/dropdown-menu-item"
import { Settings } from "lucide-react"
import Link from "next/link"
import { Path } from "@/libs/share/_general/enums/path"

export default function DropdownMenuItemUserSetting() {
  return (
    <DropdownMenuItem asChild>
      <Link href={Path.SETTING_USER} aria-disabled={true} className='pointer-events-none text-gray-500'>
        <Settings />
        <span>用戶設定</span>
      </Link>
    </DropdownMenuItem>
  )
}