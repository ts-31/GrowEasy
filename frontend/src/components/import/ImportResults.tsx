"use client";

import React from 'react';
import { CheckCircle2, SkipForward, XCircle, FileUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CrmTable from '@/components/table/CrmTable';
import type { ImportResult } from '@/types/crm';

interface ImportResultsProps {
  result: ImportResult;
  onReset: () => void;
}

export default function ImportResults({ result, onReset }: ImportResultsProps) {
  const { summary, records } = result;

  return (
    <div className="w-full space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Import Complete</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI successfully processed your CSV file.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Import Another File
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          icon={<FileUp className="w-4 h-4" />}
          label="Total Records"
          value={summary.totalRecords}
          color="text-foreground"
          bg="bg-muted"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Imported"
          value={summary.importedRecords}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <SummaryCard
          icon={<SkipForward className="w-4 h-4" />}
          label="Skipped"
          value={summary.skippedRecords}
          color="text-yellow-600 dark:text-yellow-400"
          bg="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <SummaryCard
          icon={<XCircle className="w-4 h-4" />}
          label="Failed Batches"
          value={summary.failedBatches}
          color={summary.failedBatches > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}
          bg={summary.failedBatches > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-muted'}
        />
      </div>

      {/* CRM Records Table */}
      {records.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Showing {records.length.toLocaleString()} extracted CRM record{records.length !== 1 ? 's' : ''}
          </p>
          <CrmTable records={records} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground border border-dashed rounded-lg">
          <SkipForward className="w-8 h-8" />
          <p className="text-sm font-medium">All records were skipped</p>
          <p className="text-xs text-center max-w-xs">
            No records contained a valid email or phone number. Please check your CSV and try again.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Summary Card ───────────────────────────────────────────────────────────────
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}

function SummaryCard({ icon, label, value, color, bg }: SummaryCardProps) {
  return (
    <div className={`rounded-xl border border-border p-4 flex flex-col gap-2 ${bg}`}>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
        {icon}
        {label}
      </div>
      <p className={`text-2xl font-bold tabular-nums ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
