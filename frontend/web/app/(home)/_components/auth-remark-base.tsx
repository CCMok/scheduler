import CustomButton from '@/components/_general/button/custom-button';
import CustomLink from '@/components/_general/link/custom-link';
import { ReactNode } from 'react';

type Props = {
  description: ReactNode;
  linkHref: string;
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
        <CustomLink href={linkHref}>{linkText}</CustomLink>
      </CustomButton>
    </div>
  )
}