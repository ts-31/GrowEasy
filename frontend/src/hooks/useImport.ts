import { useState, useCallback } from 'react';
import { importCsv } from '@/services/importService';
import type { ImportResult } from '@/types/crm';

export type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ImportState {
  status: ImportStatus;
  result: ImportResult | null;
  error: string | null;
}

const INITIAL_STATE: ImportState = {
  status: 'idle',
  result: null,
  error: null,
};

/**
 * Manages the full lifecycle of a CSV → AI import request.
 * status: idle → loading → success | error
 */
export function useImport() {
  const [state, setState] = useState<ImportState>(INITIAL_STATE);

  const startImport = useCallback(async (file: File) => {
    setState({ status: 'loading', result: null, error: null });
    try {
      const result = await importCsv(file);
      setState({ status: 'success', result, error: null });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred during import.';
      setState({ status: 'error', result: null, error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { ...state, startImport, reset };
}
