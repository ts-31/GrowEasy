import axios from 'axios';
import type { ImportResult } from '@/types/crm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Sends a CSV file to the backend for AI-powered CRM extraction.
 * Returns the full import result including summary and extracted CRM records.
 */
export async function importCsv(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<ImportResult>(
    `${API_BASE_URL}/api/import`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Long timeout — AI batch processing can take several minutes
      timeout: 10 * 60 * 1000,
    }
  );

  return response.data;
}
