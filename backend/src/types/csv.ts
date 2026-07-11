export interface CsvMetadata {
  totalRows: number;
  totalColumns: number;
  detectedHeaders: string[];
}

export interface CsvParseResult {
  metadata: CsvMetadata;
  records: Record<string, string>[];
}
