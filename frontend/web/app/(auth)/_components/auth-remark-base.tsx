import CustomButton from '@/components/button/custom-button';
import Link from 'next/link';
import { Path } from '@/libs/share/_general/enums/path';
import { ReactNode } from 'react';

type Props = {
  description: ReactNode;
  linkHref: Path;
  linkText: string;
}

export default function AuthRemarkBase({
  description,
  linkHref,
  linkText,
}: Readonly<Props>) {
  return (
    <div className='flex justify-center items-center space-x-2'>
      <span>{description}</span>
      <CustomButton variant='link' asChild className='px-0'>
        <Link href={linkHref}>{linkText}</Link>
      </CustomButton>
    </div>
  )
}