// CRM types shared across the frontend

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportSummary {
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
  failedBatches: number;
}

export interface ImportResult {
  success: boolean;
  summary: ImportSummary;
  records: CrmRecord[];
}
