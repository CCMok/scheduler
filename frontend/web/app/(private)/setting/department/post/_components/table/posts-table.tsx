'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/external/shadcn/components/ui/table';
import { Button } from '@/external/shadcn/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Post } from '@/external/prisma-generated';
import PostRowActions from './post-row-actions';

type PostWithDepartment = Post & {
  department: {
    organization: {
      id: number;
      name: string;
    };
    id: number;
    name: string;
  };
};

type Props = {
  posts: PostWithDepartment[];
  isLoading?: boolean;
};

export default function PostsTable({
  posts,
  isLoading = false,
}: Readonly<Props>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<PostWithDepartment>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: '職位名稱',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'department.organization.name',
      header: '機構',
      cell: ({ row }) => (
        <div>{row.original.department.organization.name}</div>
      ),
    },
    {
      accessorKey: 'department.name',
      header: '部門',
      cell: ({ row }) => (
        <div>{row.original.department.name}</div>
      ),
    },
    {
      id: 'actions',
      header: '動作',
      cell: ({ row }) => (
        <PostRowActions post={row.original} />
      ),
    },
  ], []);

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  沒有資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          顯示第 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          項，共 {table.getFilteredRowModel().rows.length} 項
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            第 {table.getState().pagination.pageIndex + 1} 頁，共{' '}
            {table.getPageCount()} 頁
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 