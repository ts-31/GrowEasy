import { Request, Response, NextFunction } from 'express';
import { parseCsvFile } from '../services/csvService';
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
    const result = await parseCsvFile(filePath);

    res.status(200).json({
      success: true,
      metadata: result.metadata,
      records: result.records,
    });
  } catch (err) {
    next(err); // Pass to centralized error handler
  } finally {
    // Always delete the temp file
    deleteFile(filePath);
  }
}
