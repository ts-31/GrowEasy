"use client";

import React from 'react';
import { CheckCircle2, SkipForward, XCircle, FileUp, RefreshCw, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import CrmTable from '@/components/table/CrmTable';
import type { ImportResult } from '@/types/crm';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCsv, exportToExcel } from '@/utils/exportUtils';

interface ImportResultsProps {
  result: ImportResult;
  onReset: () => void;
}

export default function ImportResults({ result, onReset }: ImportResultsProps) {
  const { summary, records } = result;

  const handleExportCsv = () => {
    const filename = `groweasy-crm-export-${Date.now()}.csv`;
    exportToCsv(records, filename);
  };

  const handleExportExcel = () => {
    const filename = `groweasy-crm-export-${Date.now()}.xlsx`;
    exportToExcel(records, filename);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Import Complete</h2>
            <p className="text-sm text-muted-foreground">
              Grok AI successfully extracted and mapped your CRM records.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: 'default', size: 'sm', className: 'gap-2 shadow-sm cursor-pointer' })}>
                <FileUp className="w-3.5 h-3.5" />
                Export CRM
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                  Download as Excel (.xlsx)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2 hover:border-primary/40 hover:text-primary transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Import Another File
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          icon={<FileUp className="w-4 h-4" />}
          label="Total Records"
          value={summary.totalRecords}
          color="text-foreground"
          bg="bg-card"
          border="border-border"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Imported"
          value={summary.importedRecords}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-950/40"
          border="border-emerald-200 dark:border-emerald-800/40"
        />
        <SummaryCard
          icon={<SkipForward className="w-4 h-4" />}
          label="Skipped"
          value={summary.skippedRecords}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-950/40"
          border="border-amber-200 dark:border-amber-800/40"
        />
        <SummaryCard
          icon={<XCircle className="w-4 h-4" />}
          label="Failed Batches"
          value={summary.failedBatches}
          color={summary.failedBatches > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}
          bg={summary.failedBatches > 0 ? 'bg-red-50 dark:bg-red-950/40' : 'bg-card'}
          border={summary.failedBatches > 0 ? 'border-red-200 dark:border-red-800/40' : 'border-border'}
        />
      </div>

      {/* CRM Records Table */}
      {records.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {records.length.toLocaleString()} extracted CRM record{records.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Ready to review
            </div>
          </div>
          <CrmTable records={records} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
          <div className="p-4 rounded-full bg-muted/60">
            <SkipForward className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-medium">All records were skipped</p>
            <p className="text-xs mt-1 max-w-xs">
              No records contained a valid email or phone number. Please check your CSV and try again.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            Try Another File
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Summary Card ─────────────────────────────────────────────────────────────
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
}

function SummaryCard({ icon, label, value, color, bg, border }: SummaryCardProps) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-2 transition-shadow hover:shadow-sm ${bg} ${border}`}>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
        {icon}
        {label}
      </div>
      <p className={`text-3xl font-bold tabular-nums tracking-tight ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
