'use client'

import { FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import CustomFormItem from '@/components/form/custom-form-item';
import CustomInput from '@/components/input/custom-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/external/shadcn/components/ui/tooltip';
import { ComponentProps, useState } from 'react';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/libs/client/user/constants/password-constant';

type Props<TFormData extends FieldValues = FieldValues> = ClassNameProps & {
  name: Path<TFormData>,
  formItemProps?: ComponentProps<typeof CustomFormItem>,
  inputProps?: ComponentProps<typeof CustomInput>,
}

export default function NewPasswordFormField<TFormData extends FieldValues = FieldValues>({
  className,
  name,
  formItemProps,
  inputProps,
}: Readonly<Props<TFormData>>) {
  const { control } = useFormContext<TFormData>()

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onBlur, ...rest } }) => (
        <CustomFormItem {...formItemProps}>
          <FormControl>
            <Tooltip open={isTooltipOpen}>
              <TooltipTrigger asChild>
                <CustomInput
                  type='password'
                  autoComplete='new-password'
                  className={className}
                  onFocus={() => setIsTooltipOpen(true)}
                  onBlur={() => {
                    onBlur();
                    setIsTooltipOpen(false);
                  }}
                  {...rest}
                  {...inputProps}
                />
              </TooltipTrigger>
              <TooltipContent>
                <ul className='list-decimal pl-4'>
                  <li>最少{PASSWORD_MIN_LENGTH}個字符</li>
                  <li>最多{PASSWORD_MAX_LENGTH}個字符</li>
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