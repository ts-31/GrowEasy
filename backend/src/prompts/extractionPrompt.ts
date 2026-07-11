import { CRM_STATUS_VALUES, DATA_SOURCE_VALUES } from '../types/crm';

/**
 * System prompt that instructs Grok to map an arbitrary CSV record
 * to the GrowEasy CRM schema.
 *
 * Kept separate from business logic so it can be updated independently.
 */
export function buildExtractionPrompt(record: Record<string, string>): string {
  const recordJson = JSON.stringify(record, null, 2);

  return `You are a CRM data extraction assistant for GrowEasy, a real-estate lead management platform.

You will be given a single lead record parsed from a CSV file. The column names may vary — they could come from Facebook Ads, Google Ads, a real-estate CRM export, or any other source. Your job is to intelligently map the data to the GrowEasy CRM schema.

## Rules
- NEVER assume fixed column names. Infer the meaning of each column from its name and value.
- NEVER hallucinate or invent values. If you cannot confidently map a field, leave it as an empty string "".
- If multiple email addresses are found, keep the FIRST one in the "email" field and append the others to "crm_note".
- If multiple phone numbers are found, keep the FIRST one in "mobile_without_country_code" and append the others to "crm_note".
- For "country_code", extract only the numeric dialing code (e.g. "91" for India, "1" for US). Do NOT include the "+" prefix.
- For "mobile_without_country_code", extract only the local number without the country code.
- If a record has NEITHER an email nor a phone number, set "skip": true. Otherwise set "skip": false.
- "crm_status" MUST be one of: ${CRM_STATUS_VALUES.join(', ')}. If you cannot confidently determine the status, use "GOOD_LEAD_FOLLOW_UP" as the default or leave it empty.
- "data_source" MUST be one of: ${DATA_SOURCE_VALUES.join(', ')}. If the source is ambiguous, leave it empty.
- "created_at" should be an ISO 8601 datetime string if a timestamp is present, otherwise leave it empty.
- "description" should contain any additional context not captured by other fields.

## Input Record
${recordJson}

## Output
Return ONLY a valid JSON object matching the schema below. No markdown, no explanations, no code blocks.

{
  "skip": false,
  "created_at": "",
  "name": "",
  "email": "",
  "country_code": "",
  "mobile_without_country_code": "",
  "company": "",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "",
  "crm_status": "",
  "crm_note": "",
  "data_source": "",
  "possession_time": "",
  "description": ""
}`;
}
