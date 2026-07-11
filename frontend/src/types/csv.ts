// Types for CSV parsing and preview

export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  totalColumns: number;
}

export type CsvParseStatus = 'idle' | 'parsing' | 'success' | 'error';

export interface CsvParseState {
  status: CsvParseStatus;
  result: CsvParseResult | null;
  error: string | null;
}
