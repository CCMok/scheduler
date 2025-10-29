import ExcelJS from 'exceljs';
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule';
import { format } from 'date-fns';

export function convertRosterToArray(schedules: PostBaseSchedule[]): string[][] {
  if (!schedules.length) return [];

  // Get all days from the first schedule
  const days = schedules[0].arrangements.map(arr => format(arr.day, 'yyyy-MM-dd'));
  
  // Create header row
  const headers = ['職位', ...days];
  
  // Create data rows
  const rows = schedules.map(schedule => [
    schedule.post.name,
    ...schedule.arrangements.map(arr => arr.worker?.name || '')
  ]);

  return [headers, ...rows];
}

export async function exportToXLSX(schedules: PostBaseSchedule[], filename: string = 'roster') {
  if (!schedules.length) return;

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('值班表');

  // Get data
  const days = schedules[0].arrangements.map(arr => format(arr.day, 'yyyy-MM-dd'));
  
  // Add header row
  const headerRow = worksheet.addRow(['職位', ...days]);
  
  // Style header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF475569' }, // background
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' }, // text
      size: 12,
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add data rows with styling
  schedules.forEach((schedule, index) => {
    const rowData = [
      schedule.post.name,
      ...schedule.arrangements.map(arr => arr.worker?.name || '')
    ];
    
    const row = worksheet.addRow(rowData);
    
    // Style each cell
    row.eachCell((cell, colNumber) => {
      // Alternate row background colors
      const isEvenRow = index % 2 === 0;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEvenRow ? 'FFFFFFFF' : 'FFF2F2F2' }, 
      };
      
      // Post name column (first column) - bold
      if (colNumber === 1) {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else {
        // Worker cells - center aligned
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        
        // Highlight empty cells (no worker assigned)
        if (!cell.value || cell.value === '') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFfed7aa' },
          };
        }
      }
      
      // Add borders to all cells
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      };
    });
  });

  // Set column widths
  worksheet.columns = [
    { width: 20 }, // 職位 column
    ...days.map(() => ({ width: 15 })) // Date columns
  ];

  // Freeze header row
  worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ];

  // Generate filename with timestamp
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fullFilename;
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(link.href);
}