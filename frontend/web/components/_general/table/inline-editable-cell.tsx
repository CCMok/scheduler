'use client'

import { useState } from "react";
import CustomInput from "../input/custom-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// TODO: handle mobile scroll

type ViewCellProps = {
  value?: string;
  setIsEditing?: (isEditing: boolean) => void;
}

const ViewCell = ({
  value,
  setIsEditing,
}: Readonly<ViewCellProps>) => {
  const onClick = () => setIsEditing?.(true);

  return (
    <button
      onClick={onClick}
      type='button'
    >
      {value}
    </button>
  )
}

type EditCellProps = {

}

const EditCell = ({

}) => {
  // const form = useForm({
  //   resolver: zodResolver(organizationNameFormInputSchema)
  // })

  return (
    <CustomInput
      value={'Editing'}
    />
  )
}

type Props = {
  value?: string;
}

export default function InlineEditableCell({
  value,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <ViewCell
        value={value}
        setIsEditing={setIsEditing}
      />
    )
  }

  return <EditCell />
}