"use client";

import React from 'react';
import { Loader2, AlertCircle, Rows, Columns } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CsvTable from '@/components/table/CsvTable';
import type { CsvParseState } from '@/types/csv';

interface CsvPreviewProps {
  state: CsvParseState;
}

export default function CsvPreview({ state }: CsvPreviewProps) {
  const { status, result, error } = state;

  if (status === 'idle') return null;

  return (
    <div className="w-full space-y-4">
      {/* Loading State */}
      {status === 'parsing' && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Parsing CSV file…</p>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Parse Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {status === 'success' && result && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-1.5">
              <Rows className="w-4 h-4 text-primary" />
              <span>
                <span className="font-semibold">{result.totalRows.toLocaleString()}</span>
                {' '}row{result.totalRows !== 1 ? 's' : ''}
                {result.totalRows > 50 && (
                  <span className="text-muted-foreground ml-1">(showing first 50)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-1.5">
              <Columns className="w-4 h-4 text-primary" />
              <span>
                <span className="font-semibold">{result.totalColumns.toLocaleString()}</span>
                {' '}column{result.totalColumns !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <CsvTable headers={result.headers} rows={result.rows} />
        </div>
      )}
    </div>
  );
}
