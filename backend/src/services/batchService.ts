import { extractCrmRecord } from './aiService';
import { CrmRecord } from '../types/crm';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BatchSummary {
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
  failedBatches: number;
}

export interface BatchProcessingResult {
  summary: BatchSummary;
  records: CrmRecord[];
}

interface BatchResult {
  batchIndex: number;
  records: CrmRecord[];
  skipped: number;
  failed: boolean;
  error?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Splits an array into chunks of the given size.
 */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Processes a single batch of raw CSV records through the AI extraction service.
 * Failures are caught per-record so one bad record doesn't abort the whole batch.
 */
async function processBatch(
  batch: Record<string, string>[],
  batchIndex: number,
  totalBatches: number
): Promise<BatchResult> {
  const start = Date.now();
  console.log(
    `[BATCH] Processing batch ${batchIndex + 1}/${totalBatches} — ${batch.length} record(s)`
  );

  const extracted: CrmRecord[] = [];
  let skipped = 0;

  try {
    for (const rawRecord of batch) {
      try {
        const crmRecord = await extractCrmRecord(rawRecord);
        if (crmRecord === null) {
          // AI flagged record as having no contact info
          skipped++;
        } else {
          extracted.push(crmRecord);
        }
      } catch (recordErr: any) {
        // Individual record failures are logged but do not abort the batch
        console.warn(
          `[BATCH] Record extraction failed in batch ${batchIndex + 1}: ${recordErr.message}`
        );
        skipped++;
      }
    }

    const duration = Date.now() - start;
    console.log(
      `[BATCH] Batch ${batchIndex + 1}/${totalBatches} complete — ` +
        `imported: ${extracted.length}, skipped: ${skipped}, duration: ${duration}ms`
    );

    return { batchIndex, records: extracted, skipped, failed: false };
  } catch (batchErr: any) {
    const duration = Date.now() - start;
    console.error(
      `[BATCH] Batch ${batchIndex + 1}/${totalBatches} FAILED — ` +
        `duration: ${duration}ms, error: ${batchErr.message}`
    );

    return {
      batchIndex,
      records: [],
      skipped: batch.length, // All records in failed batch count as skipped
      failed: true,
      error: batchErr.message,
    };
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Processes all raw CSV records through the AI extraction pipeline in sequential batches.
 *
 * - Batch size is configured via BATCH_SIZE env variable (default: 20).
 * - Batches are processed sequentially to avoid API rate limits.
 * - If a batch fails, processing continues with the next batch.
 * - Returns a merged result with a summary and all successfully extracted records.
 */
export async function processCsvRecordsInBatches(
  rawRecords: Record<string, string>[]
): Promise<BatchProcessingResult> {
  const batchSize = parseInt(process.env.BATCH_SIZE || '20', 10);
  const batches = chunkArray(rawRecords, batchSize);
  const totalBatches = batches.length;

  console.log(
    `[BATCH] Starting batch processing — ` +
      `totalRecords: ${rawRecords.length}, batchSize: ${batchSize}, totalBatches: ${totalBatches}`
  );

  const allRecords: CrmRecord[] = [];
  let totalSkipped = 0;
  let failedBatches = 0;

  // Sequential processing to avoid API rate limits
  for (let i = 0; i < batches.length; i++) {
    const result = await processBatch(batches[i], i, totalBatches);

    allRecords.push(...result.records);
    totalSkipped += result.skipped;
    if (result.failed) {
      failedBatches++;
    }
  }

  const summary: BatchSummary = {
    totalRecords: rawRecords.length,
    importedRecords: allRecords.length,
    skippedRecords: totalSkipped,
    failedBatches,
  };

  console.log(
    `[BATCH] All batches complete — ` +
      `imported: ${summary.importedRecords}, skipped: ${summary.skippedRecords}, ` +
      `failedBatches: ${summary.failedBatches}`
  );

  return { summary, records: allRecords };
}
