import { Request, Response, NextFunction } from 'express';
import { extractCrmRecord } from '../services/aiService';

/**
 * POST /api/extract
 * Body: { record: Record<string, string> }
 *
 * Extracts a single raw CSV record into the GrowEasy CRM schema via Grok AI.
 */
export async function extractController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { record } = req.body;

  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    res.status(400).json({
      success: false,
      message: 'Request body must contain a "record" object (key-value pairs from a CSV row).',
    });
    return;
  }

  try {
    const crmRecord = await extractCrmRecord(record);

    if (crmRecord === null) {
      res.status(200).json({
        success: true,
        skipped: true,
        message: 'Record was skipped because it contains neither an email nor a phone number.',
        crmRecord: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      skipped: false,
      crmRecord,
    });
  } catch (err) {
    next(err);
  }
}
