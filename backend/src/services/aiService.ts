import { ChatXAI } from '@langchain/xai';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { buildExtractionPrompt } from '../prompts/extractionPrompt';
import { CRM_STATUS_VALUES, DATA_SOURCE_VALUES, CrmRecord } from '../types/crm';

// ── Zod schema for structured output ──────────────────────────────────────────
const CrmRecordSchema = z.object({
  skip: z.boolean().describe('Set to true if neither email nor phone number is present.'),
  created_at: z.string().describe('ISO 8601 datetime string or empty string.'),
  name: z.string(),
  email: z.string(),
  country_code: z.string().describe('Numeric dialing code only, e.g. "91" or "1". No + prefix.'),
  mobile_without_country_code: z.string(),
  company: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lead_owner: z.string(),
  crm_status: z.enum([...CRM_STATUS_VALUES] as [string, ...string[]]).or(z.literal('')),
  crm_note: z.string(),
  data_source: z.enum([...DATA_SOURCE_VALUES] as [string, ...string[]]).or(z.literal('')),
  possession_time: z.string(),
  description: z.string(),
});

type CrmRecordWithSkip = z.infer<typeof CrmRecordSchema>;

// ── Initialize xAI / Grok LLM ─────────────────────────────────────────────────
function createGrokClient() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error('XAI_API_KEY is not set in environment variables.');
  }

  const model = process.env.XAI_MODEL || 'grok-3-mini';

  return new ChatXAI({
    model,
    apiKey,
    temperature: 0,   // Deterministic for data extraction
    maxRetries: 3,
  }).withStructuredOutput(CrmRecordSchema, { name: 'crm_extraction' });
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Given a single raw CSV record (unknown column names),
 * calls Grok to intelligently map it to the GrowEasy CRM schema.
 *
 * Returns null if the record should be skipped (no email + no phone).
 */
export async function extractCrmRecord(
  rawRecord: Record<string, string>
): Promise<CrmRecord | null> {
  const llm = createGrokClient();

  const prompt = buildExtractionPrompt(rawRecord);

  let result: CrmRecordWithSkip;
  try {
    result = await llm.invoke([new HumanMessage(prompt)]);
  } catch (err: any) {
    throw new Error(`Grok AI call failed: ${err.message}`);
  }

  // If the AI flagged this record as having no contact info, skip it
  if (result.skip) {
    return null;
  }

  // Strip the "skip" field before returning
  const { skip, ...crmRecord } = result;
  return crmRecord as CrmRecord;
}
