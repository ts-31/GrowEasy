import * as XLSX from 'xlsx';
import type { CrmRecord } from '@/types/crm';

const CRM_COLUMNS: { key: keyof CrmRecord; label: string }[] = [
  { key: 'name',                          label: 'Name' },
  { key: 'email',                         label: 'Email' },
  { key: 'mobile_without_country_code',   label: 'Mobile' },
  { key: 'country_code',                  label: 'Code' },
  { key: 'company',                       label: 'Company' },
  { key: 'city',                          label: 'City' },
  { key: 'state',                         label: 'State' },
  { key: 'country',                       label: 'Country' },
  { key: 'crm_status',                    label: 'Status' },
  { key: 'data_source',                   label: 'Source' },
  { key: 'lead_owner',                    label: 'Owner' },
  { key: 'crm_note',                      label: 'Note' },
  { key: 'possession_time',               label: 'Possession' },
  { key: 'description',                   label: 'Description' },
  { key: 'created_at',                    label: 'Created At' },
];

/**
 * Escapes a string for CSV according to RFC 4180.
 */
function escapeCsvValue(value: string | undefined): string {
  if (!value) return '';
  const stringValue = String(value);
  // If the value contains commas, quotes, or newlines, wrap in quotes and double internal quotes
  if (/[,"\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Exports records to a CSV file and triggers download.
 */
export function exportToCsv(records: CrmRecord[], filename: string): void {
  if (records.length === 0) return;

  // Header row
  const headerRow = CRM_COLUMNS.map(c => escapeCsvValue(c.label)).join(',');

  // Data rows
  const dataRows = records.map(record =>
    CRM_COLUMNS.map(col => escapeCsvValue(record[col.key])).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exports records to an Excel (.xlsx) file and triggers download.
 */
export function exportToExcel(records: CrmRecord[], filename: string): void {
  if (records.length === 0) return;

  // Transform records into an array of objects matching the header labels
  const data = records.map(record => {
    const rowData: Record<string, string> = {};
    CRM_COLUMNS.forEach(col => {
      rowData[col.label] = record[col.key] || '';
    });
    return rowData;
  });

  // Create a new workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CRM Records');

  // Trigger download
  XLSX.writeFile(workbook, filename);
}
