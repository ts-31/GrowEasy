import Papa from 'papaparse';
import type { CsvParseResult } from '@/types/csv';

const PREVIEW_ROW_LIMIT = 50;

/**
 * Parses a CSV File using PapaParse and returns a structured result.
 * Resolves with a CsvParseResult, or rejects with a descriptive error string.
 */
export function parseCsvFile(file: File): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        // Propagate PapaParse's own errors (e.g. invalid delimiter)
        if (results.errors.length > 0) {
          // Only treat as fatal if we got no usable data
          const fatalErrors = results.errors.filter((e) => e.type === 'Delimiter');
          if (fatalErrors.length > 0) {
            reject(
              `Malformed CSV: ${fatalErrors.map((e) => e.message).join('; ')}`
            );
            return;
          }
        }

        const headers = results.meta.fields ?? [];

        if (headers.length === 0) {
          reject('The CSV file has no headers or is empty.');
          return;
        }

        const allRows = results.data as Record<string, string>[];

        if (allRows.length === 0) {
          reject('The CSV file contains no data rows.');
          return;
        }

        resolve({
          headers,
          rows: allRows.slice(0, PREVIEW_ROW_LIMIT),
          totalRows: allRows.length,
          totalColumns: headers.length,
        });
      },
      error(error: Error) {
        reject(`Failed to parse CSV: ${error.message}`);
      },
    });
  });
}
