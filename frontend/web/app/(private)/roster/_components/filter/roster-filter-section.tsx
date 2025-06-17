import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilterForm from "./roster-filter-form";

export default async function RosterFilterSection({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <section className={className}>
      <RosterFilterForm />
    </section>
  )
}