"use client";

import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import type { CrmRecord } from '@/types/crm';

const CRM_COLUMNS: { key: keyof CrmRecord; label: string }[] = [
  { key: 'name',                          label: 'Name' },
  { key: 'email',                         label: 'Email' },
  { key: 'mobile_without_country_code',   label: 'Mobile' },
  { key: 'country_code',                  label: 'Code' },
  { key: 'company',                       label: 'Company' },
  { key: 'city',                          label: 'City' },
  { key: 'state',                         label: 'State' },
  { key: 'country',                       label: 'Country' },
  { key: 'crm_status',                    label: 'Status' },
  { key: 'data_source',                   label: 'Source' },
  { key: 'lead_owner',                    label: 'Owner' },
  { key: 'crm_note',                      label: 'Note' },
  { key: 'possession_time',               label: 'Possession' },
  { key: 'description',                   label: 'Description' },
  { key: 'created_at',                    label: 'Created At' },
];

// Badge colours for CRM status values
const STATUS_STYLES: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  DID_NOT_CONNECT:     'bg-yellow-100  text-yellow-700  dark:bg-yellow-900/40  dark:text-yellow-300',
  BAD_LEAD:            'bg-red-100     text-red-700     dark:bg-red-900/40     dark:text-red-300',
  SALE_DONE:           'bg-blue-100    text-blue-700    dark:bg-blue-900/40    dark:text-blue-300',
};

interface CrmTableProps {
  records: CrmRecord[];
}

export default function CrmTable({ records }: CrmTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Track scroll position to show/hide fade hints
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [records]);

  const columns = useMemo<ColumnDef<CrmRecord>[]>(
    () =>
      CRM_COLUMNS.map(({ key, label }) => ({
        id: key,
        accessorKey: key,
        header: label,
        cell: (info) => {
          const value = info.getValue<string>();
          if (!value) {
            return <span className="text-muted-foreground italic text-xs">—</span>;
          }
          if (key === 'crm_status') {
            const style = STATUS_STYLES[value] ?? 'bg-muted text-muted-foreground';
            return (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}>
                {value.replace(/_/g, ' ')}
              </span>
            );
          }
          return (
            <span
              title={value}
              className="block max-w-[180px] truncate text-sm text-foreground"
            >
              {value}
            </span>
          );
        },
      })),
    []
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-2">
      {/* Scroll hint — shown when table has overflowing content */}
      {canScrollRight && (
        <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground animate-fade-in">
          <span>Scroll to see more columns</span>
          <ChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
        </div>
      )}

      {/* Table wrapper */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        {/* Left fade overlay */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-card to-transparent" />
        )}

        {/* Right fade overlay + animated arrow */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-end pr-2 bg-gradient-to-l from-card via-card/80 to-transparent">
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <ChevronRight
                  key={i}
                  className="w-3.5 h-3.5 text-primary/60"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scrollable area with custom styled scrollbar */}
        <div
          ref={scrollRef}
          className="overflow-auto max-h-[520px] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/60"
        >
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
                  className={`transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
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
      </div>
    </div>
  );
}
