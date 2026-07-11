import { Request, Response, NextFunction } from 'express';
import { parseCsvFile } from '../services/csvService';
import { processCsvRecordsInBatches } from '../services/batchService';
import { deleteFile } from '../utils/deleteFile';

export async function importCsvController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Multer puts the file on req.file
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded. Please attach a CSV file.' });
    return;
  }

  const filePath = req.file.path;

  try {
    // Step 1: Parse CSV → raw records
    const csvResult = await parseCsvFile(filePath);

    // Step 2: Run all records through AI batch extraction
    const batchResult = await processCsvRecordsInBatches(csvResult.records);

    res.status(200).json({
      success: true,
      summary: batchResult.summary,
      records: batchResult.records,
    });
  } catch (err) {
    next(err); // Pass to centralized error handler
  } finally {
    // Always delete the temp file regardless of success or failure
    deleteFile(filePath);
  }
}
