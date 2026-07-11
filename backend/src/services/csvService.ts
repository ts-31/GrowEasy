import fs from 'fs';
import { parse } from 'csv-parse';
import { CsvParseResult } from '../types/csv';

/**
 * Parses a CSV file at the given path and returns structured result.
 * Preserves original column names exactly as they appear in the CSV.
 */
export function parseCsvFile(filePath: string): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    const records: Record<string, string>[] = [];

    const parser = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,             // Use first row as headers
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,  // Handle rows with missing/extra columns gracefully
      })
    );

    parser.on('readable', () => {
      let record: Record<string, string>;
      // eslint-disable-next-line no-cond-assign
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', (err: Error) => {
      reject(new Error(`Failed to parse CSV: ${err.message}`));
    });

    parser.on('end', () => {
      // Guard: empty file — no records and no headers parsed
      if (records.length === 0) {
        return reject(new Error('CSV file is empty or has no headers.'));
      }

      // Derive headers from the keys of the first record (preserves original casing/order)
      const detectedHeaders = Object.keys(records[0]);

      resolve({
        metadata: {
          totalRows: records.length,
          totalColumns: detectedHeaders.length,
          detectedHeaders,
        },
        records,
      });
    });
  });
}
