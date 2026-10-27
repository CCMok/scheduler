import ExcelJS from 'exceljs';
import { parseRosterItems, RosterItem, RosterJoin } from '@/libs/roster/roster';
import { Post, Worker } from '@/external/prisma/generated/client';
import { format } from 'date-fns';
import { isNil } from 'lodash';

export async function exportWorkingToXLSX(params: {
  name: string;
  timeslotNames: string[];
  rosterItems: RosterItem[];
  posts: Post[];
  workers: Worker[];
}): Promise<void> {
  const { name, timeslotNames, rosterItems, posts, workers } = params;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(name);

  const headerRow = worksheet.addRow(['職位', ...timeslotNames]);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF475569' },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
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

  rosterItems.forEach((rosterItem, index) => {
    const post = posts.find((p) => p.id === rosterItem.postId);

    const rowData = [
      post?.name || '',
      ...rosterItem.assignments.map((assignment) =>
        isNil(assignment.workerId)
          ? ''
          : workers.find((w) => w.id === assignment.workerId)?.name || '',
      ),
    ];

    const row = worksheet.addRow(rowData);

    row.eachCell((cell, colNumber) => {
      const isEvenRow = index % 2 === 0;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEvenRow ? 'FFFFFFFF' : 'FFF2F2F2' },
      };

      if (colNumber === 1) {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if (!cell.value || cell.value === '') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFfed7aa' },
          };
        }
      }

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      };
    });
  });

  worksheet.columns = [
    { width: 20 },
    ...timeslotNames.map(() => ({ width: 15 })),
  ];

  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const fullFilename = `值班表_${timestamp}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fullFilename;
  link.click();

  URL.revokeObjectURL(link.href);
}

export async function exportToXLSX(
  roster: RosterJoin,
  posts: Post[],
  workers: Worker[],
): Promise<void> {
  await exportWorkingToXLSX({
    name: roster.name,
    timeslotNames: roster.timeslots.map((t) => t.name),
    rosterItems: parseRosterItems(roster),
    posts,
    workers,
  });
}
