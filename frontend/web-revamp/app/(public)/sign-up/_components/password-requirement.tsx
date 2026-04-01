import { cn } from "@/external/shadcn/libs/utils";
import { CheckCircle } from "lucide-react";
import { passwordHints } from "./sign-up-form-utils";

export default function PasswordRequirement({
  value,
}: Readonly<{
  value: string;
}>) {
  return (
    <ul className='text-xs'>
      {passwordHints.map(hint => (
        <li key={hint.label} className='flex space-x-2 items-center'>
          <CheckCircle size='12' className={cn(hint.test(value) ? 'text-success' : 'text-muted')} />
          <span>{hint.label}</span>
        </li>
      ))}
    </ul>
  )
}