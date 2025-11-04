import { ChildrenProps } from "@/libs/_general/props/children-props";

export default async function SettingLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}