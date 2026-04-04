import { cn } from "@/external/shadcn/libs/utils";
import { CheckCircle } from "lucide-react";
import { PASSWORD_REQUIREMENTS } from "@/libs/auth/general/password-requirement";

export default function PasswordRequirement({
  value,
}: Readonly<{
  value: string;
}>) {
  return (
    <ul className='text-xs'>
      {PASSWORD_REQUIREMENTS.map(r => (
        <li key={r.label} className='flex space-x-2 items-center'>
          <CheckCircle size='12' className={cn(r.test(value) ? 'text-success' : 'text-muted')} />
          <span>{r.label}</span>
        </li>
      ))}
    </ul>
  )
}