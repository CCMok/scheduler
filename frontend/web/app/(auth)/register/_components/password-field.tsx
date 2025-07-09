'use client'

import { FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { useFormContext } from 'react-hook-form';
import CustomFormItem from '@/components/form/custom-form-item';
import CustomInput from '@/components/input/custom-input';
import { RegisterFormInput } from '@/libs/client/register/models/register-form-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/external/shadcn/components/ui/tooltip';
import { useState } from 'react';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';

export default function PasswordField({
  className,
}: Readonly<ClassNameProps>) {
  const { control } = useFormContext<RegisterFormInput>()

  const [isPasswordTooltipOpen, setIsPasswordTooltipOpen] = useState(false);

  return (
    <FormField
          control={control}
          name="password"
          render={({ field: { onBlur, ...rest } }) => (
            <CustomFormItem label='密碼' isLabelStar>
              <FormControl>
                <Tooltip open={isPasswordTooltipOpen}>
                  <TooltipTrigger asChild>
                    <CustomInput
                      type='password'
                      autoComplete='new-password'
                      className={className}
                      onFocus={() => setIsPasswordTooltipOpen(true)}
                      onBlur={() => {
                        onBlur();
                        setIsPasswordTooltipOpen(false);
                      }}
                      {...rest}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <ul className='list-decimal pl-4'>
                      <li>最少8個字符</li>
                      <li>大寫字母</li>
                      <li>小寫字母</li>
                      <li>數字</li>
                      <li>特殊字符 (@$!%*?&)</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </FormControl>
            </CustomFormItem>
          )}
        />
  )
}