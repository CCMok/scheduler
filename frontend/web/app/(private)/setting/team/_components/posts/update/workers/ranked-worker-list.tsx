'use client'

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Worker } from "@/external/prisma/generated/client";
import { Badge } from "@/external/shadcn/components/ui/badge";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import Combobox from "@/components/_general/_custom/combobox/combobox";
import { cn } from "@/external/shadcn/libs/utils";

function SortableWorkerRow({
  worker,
  rank,
  onRemove,
}: Readonly<{
  worker: Worker;
  rank: number;
  onRemove: () => void;
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: worker.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-background px-2 py-1.5",
        isDragging && "z-10 shadow-md opacity-95",
      )}
    >
      <button
        type="button"
        className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label={`拖曳調整 ${worker.name} 優先順序`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <Badge variant="secondary" className="tabular-nums min-w-7 justify-center">
        {rank}
      </Badge>
      <span className="flex-1 truncate text-sm">{worker.name}</span>
      <CustomButton
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`移除 ${worker.name}`}
        onClick={onRemove}
      >
        <X className="size-4" />
      </CustomButton>
    </li>
  );
}

export default function RankedWorkerList({
  orderedWorkers,
  pool,
  onChange,
}: Readonly<{
  orderedWorkers: Worker[];
  pool: Worker[];
  onChange: (next: Worker[]) => void;
}>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const selectedIds = new Set(orderedWorkers.map((w) => w.id));
  const available = pool.filter((w) => !selectedIds.has(w.id));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedWorkers.findIndex((w) => w.id === active.id);
    const newIndex = orderedWorkers.findIndex((w) => w.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(orderedWorkers, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      {orderedWorkers.length === 0 ? (
        <p className="text-sm text-muted-foreground">尚未加入職員。請從下方加入。</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={orderedWorkers.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="space-y-1.5">
              {orderedWorkers.map((worker, index) => (
                <SortableWorkerRow
                  key={worker.id}
                  worker={worker}
                  rank={index + 1}
                  onRemove={() => onChange(orderedWorkers.filter((w) => w.id !== worker.id))}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      {available.length > 0 ? (
        <Combobox
          value={undefined}
          setValue={(id) => {
            if (id == null) return;
            const worker = available.find((w) => w.id === id);
            if (!worker) return;
            onChange([...orderedWorkers, worker]);
          }}
          options={available}
          getOptionValue={(w) => w.id}
          getOptionDisplay={(w) => w.name}
          placeHolder="加入職員"
          isOptional
        />
      ) : orderedWorkers.length > 0 ? (
        <p className="text-xs text-muted-foreground">已加入全部職員</p>
      ) : null}
    </div>
  );
}
