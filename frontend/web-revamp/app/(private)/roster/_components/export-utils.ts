import ExcelJS from 'exceljs';
import { parseRosterItems, RosterJoin } from '@/libs/roster/roster';
import { Post, Worker } from '@/external/prisma/generated/client';
import { format } from 'date-fns';
import { isNil } from 'lodash';

export async function exportToXLSX(roster: RosterJoin, posts: Post[], workers: Worker[]): Promise<void> {
  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(roster.name);

  // Get data
  const timeslotName = roster.timeslots.map(t => t.name);
  
  // Add header row
  const headerRow = worksheet.addRow(['職位', ...timeslotName]);
  
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

  const rosterItems = parseRosterItems(roster);

  // Add data rows with styling
  rosterItems.forEach((rosterItem, index) => {
    const post = posts.find(p => p.id === rosterItem.postId);

    const rowData = [
      post?.name || '',
      ...rosterItem.assignments.map(assignment => isNil(assignment.workerId) ? '' : workers.find(w => w.id === assignment.workerId)?.name || ''),
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
    ...timeslotName.map(() => ({ width: 15 })) // Date columns
  ];

  // Freeze header row
  worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ];

  // Generate filename with timestamp
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const fullFilename = `值班表_${timestamp}.xlsx`;

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
