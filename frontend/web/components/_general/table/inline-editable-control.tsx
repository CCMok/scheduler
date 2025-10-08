'use client'

import { ReactNode, useState } from "react";

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

type Props = {
  value?: string;
  renderInput?: (close: () => void) => ReactNode;
}

export default function InlineEditableControl({
  value,
  renderInput,
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

  return renderInput ? renderInput(() => setIsEditing(false)) : <></>
}