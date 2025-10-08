'use client'

import { InputGroup, InputGroupAddon } from "@/external/shadcn/components/ui/input-group";
import CustomInputGroupInput from "./custom-input-group-input";
import CustomInputGroupButton from "../button/custom-input-group-button";
import { Check, X } from "lucide-react";
import { ComponentProps } from "react";
import { Spinner } from "@/external/shadcn/components/ui/spinner";

type Props = ComponentProps<typeof CustomInputGroupInput> & {
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function TickCrossInput({
  onSubmit,
  onCancel,
  isLoading,
  ...props
}: Readonly<Props>) {
  return (
    <InputGroup className='w-(--input-width)'>
      <CustomInputGroupInput disabled={isLoading} {...props} />
      <InputGroupAddon align='inline-end'>
        {isLoading
          ? <Spinner />
          : (<>
            <CustomInputGroupButton size='icon-xs' onClick={onSubmit}>
              <Check />
            </CustomInputGroupButton>
            <CustomInputGroupButton size='icon-xs' onClick={onCancel}>
              <X />
            </CustomInputGroupButton>
          </>)
        }
      </InputGroupAddon>
    </InputGroup>
  )
}