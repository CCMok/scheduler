'use client'

import { ComponentProps, ChangeEvent } from 'react';
import CustomInput from './custom-input';

type CustomNumberInputProps = Omit<ComponentProps<typeof CustomInput>, 'type' | 'value' | 'onChange'> & {
  value?: number | null;
  onChange?: (value: number | null | undefined) => void;
  allowNull?: boolean;
  parseAsInteger?: boolean;
  min?: number;
  max?: number;
}

export default function NumberInput({
  value,
  onChange,
  allowNull = true,
  parseAsInteger = true,
  min,
  max,
  ...props
}: Readonly<CustomNumberInputProps>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!onChange) return;
    
    if (inputValue === '') {
      onChange(allowNull ? null : undefined);
      return;
    }
    
    const parsedValue = parseAsInteger 
      ? Number.parseInt(inputValue, 10) 
      : Number.parseFloat(inputValue);
    
    if (!Number.isNaN(parsedValue)) {
      onChange(parsedValue);
    }
  };

  return (
    <CustomInput
      type='number'
      value={value ?? ''}
      onChange={handleChange}
      min={min}
      max={max}
      {...props}
    />
  );
}