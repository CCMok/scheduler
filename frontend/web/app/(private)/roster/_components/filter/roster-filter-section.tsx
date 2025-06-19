import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilter from "./roster-filter";

export default async function RosterFilterSection({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <section className={className}>
      <RosterFilter />
    </section>
  )
}