'use client'

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Badge } from "@/external/shadcn/components/ui/badge";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import LoadingButton from "@/components/_general/_custom/button/loading-button";
import MultipleCombobox from "@/components/_general/_custom/combobox/multiple-combobox";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type GroupBase = {
  id: number;
  members: { id: number; name: string }[];
};

export default function AffinityGroupEditor<TOption>({
  title,
  description,
  emptyHint,
  groups,
  options,
  getOptionValue,
  getOptionDisplay,
  minMembers = 2,
  minMembersMessage,
  onCreate,
  onUpdate,
  onDelete,
}: Readonly<{
  title: string;
  description: string;
  emptyHint: string;
  groups: GroupBase[];
  options: TOption[];
  getOptionValue: (option: TOption) => number;
  getOptionDisplay: (option: TOption) => string;
  minMembers?: number;
  minMembersMessage: string;
  onCreate: (memberIds: number[]) => Promise<{ isSuccess: boolean; message?: string }>;
  onUpdate: (id: number, memberIds: number[]) => Promise<{ isSuccess: boolean; message?: string }>;
  onDelete: (id: number) => Promise<{ isSuccess: boolean; message?: string }>;
}>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [draftIds, setDraftIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editIds, setEditIds] = useState<number[]>([]);

  const run = (
    work: () => Promise<{ isSuccess: boolean; message?: string }>,
    successMessage: string,
    afterSuccess?: () => void,
  ) => {
    startTransition(async () => {
      const response = await work();
      if (!response.isSuccess) {
        toast.error(response.message ?? '操作失敗');
        return;
      }
      toast.success(successMessage);
      afterSuccess?.();
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!creating ? (
          <CustomButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setCreating(true);
              setDraftIds([]);
              setEditingId(null);
            }}
          >
            <Plus />
            新增組別
          </CustomButton>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {groups.length === 0 && !creating ? (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        ) : null}

        {groups.map((group) => {
          const isEditing = editingId === group.id;
          return (
            <div
              key={group.id}
              className="rounded-md border p-3 space-y-3"
            >
              {isEditing ? (
                <>
                  <MultipleCombobox
                    value={editIds}
                    setValue={setEditIds}
                    options={options}
                    getOptionValue={getOptionValue}
                    getOptionDisplay={getOptionDisplay}
                    placeHolder="選擇"
                  />
                  <div className="flex flex-wrap gap-2">
                    <LoadingButton
                      type="button"
                      size="sm"
                      isLoading={isPending}
                      icon={<Check />}
                      onClick={() => {
                        if (editIds.length < minMembers) {
                          toast.error(minMembersMessage);
                          return;
                        }
                        run(
                          () => onUpdate(group.id, editIds),
                          '已更新組別',
                          () => setEditingId(null),
                        );
                      }}
                    >
                      儲存
                    </LoadingButton>
                    <CustomButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => setEditingId(null)}
                    >
                      <X />
                      取消
                    </CustomButton>
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {group.members.map((m) => (
                      <Badge key={m.id} variant="secondary">{m.name}</Badge>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <CustomButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="編輯組別"
                      disabled={isPending || creating}
                      onClick={() => {
                        setEditingId(group.id);
                        setEditIds(group.members.map((m) => m.id));
                        setCreating(false);
                      }}
                    >
                      <Pencil />
                    </CustomButton>
                    <CustomButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="刪除組別"
                      disabled={isPending}
                      onClick={() => {
                        run(() => onDelete(group.id), '已刪除組別');
                      }}
                    >
                      <Trash2 />
                    </CustomButton>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {creating ? (
          <div className="rounded-md border border-dashed p-3 space-y-3">
            <p className="text-sm font-medium">新組別</p>
            <MultipleCombobox
              value={draftIds}
              setValue={setDraftIds}
              options={options}
              getOptionValue={getOptionValue}
              getOptionDisplay={getOptionDisplay}
              placeHolder="選擇"
            />
            <div className="flex flex-wrap gap-2">
              <LoadingButton
                type="button"
                size="sm"
                isLoading={isPending}
                icon={<Check />}
                onClick={() => {
                  if (draftIds.length < minMembers) {
                    toast.error(minMembersMessage);
                    return;
                  }
                  run(
                    () => onCreate(draftIds),
                    '已新增組別',
                    () => {
                      setCreating(false);
                      setDraftIds([]);
                    },
                  );
                }}
              >
                建立
              </LoadingButton>
              <CustomButton
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setCreating(false);
                  setDraftIds([]);
                }}
              >
                <X />
                取消
              </CustomButton>
            </div>
          </div>
        ) : null}
      </CardContent>
      {groups.length > 0 || creating ? (
        <CardFooter className="text-xs text-muted-foreground">
          每組至少 {minMembers} 位成員。自動編排會把這些偏好納入軟性加分。
        </CardFooter>
      ) : null}
    </Card>
  );
}
