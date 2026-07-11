"use client";

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';

interface CsvTableProps {
  headers: string[];
  rows: Record<string, string>[];
}

export default function CsvTable({ headers, rows }: CsvTableProps) {
  const columns = useMemo<ColumnDef<Record<string, string>>[]>(
    () =>
      headers.map((header) => ({
        id: header,
        accessorKey: header,
        header,
        cell: (info) => {
          const value = info.getValue<string>();
          return (
            <span
              title={value}
              className="block max-w-[200px] truncate text-sm text-foreground"
            >
              {value === '' || value == null ? (
                <span className="text-muted-foreground italic">—</span>
              ) : (
                value
              )}
            </span>
          );
        },
      })),
    [headers]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-auto rounded-lg border border-border max-h-[420px]">
      <table className="min-w-full table-auto text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide border-b border-border"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
