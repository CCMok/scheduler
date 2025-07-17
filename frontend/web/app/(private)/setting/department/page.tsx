import { redirect } from "next/navigation";
import { DEPARTMENT_SETTING_DEFAULT_PATH } from "../_component/setting-menu-utils";

export default function DepartmentSettingPage() {
  return redirect(DEPARTMENT_SETTING_DEFAULT_PATH)
}