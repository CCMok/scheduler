'use client'

import CustomButton from "@/components/_general/button/custom-button";
import { FileOutput } from "lucide-react";
import { useArrangeRosterStore } from "../store/arrange-roster-store-provider";
import { toast } from "sonner";
import { exportToXLSX } from "./roster-table-export-utils";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";

export default function RosterTableExportXLSXButton() {
  const modifiedSchedules = useArrangeRosterStore(state => state.modifiedSchedules);

  const onExportXLSX = async () => {
    if (!modifiedSchedules.length) {
      toast.error('沒有資料可以匯出', {
        ...SONNER_DEFAULT_OPTIONS,
      });
      return;
    }
    await exportToXLSX(modifiedSchedules, '值班表');
    toast.success('已匯出 XLSX 檔案', {
      ...SONNER_DEFAULT_OPTIONS,
    });
  };

  return (
    <CustomButton onClick={onExportXLSX}>
      <FileOutput />
      匯出
    </CustomButton>
  )
}