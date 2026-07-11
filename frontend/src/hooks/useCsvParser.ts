import { useState, useCallback } from 'react';
import { parseCsvFile } from '@/utils/csvParser';
import type { CsvParseState } from '@/types/csv';

const INITIAL_STATE: CsvParseState = {
  status: 'idle',
  result: null,
  error: null,
};

/**
 * Custom hook that manages CSV parsing lifecycle.
 * - Triggers parsing when a file is passed to `parseFile`.
 * - Exposes loading/success/error states.
 * - `reset` clears all state (called when file is removed).
 */
export function useCsvParser() {
  const [state, setState] = useState<CsvParseState>(INITIAL_STATE);

  const parseFile = useCallback(async (file: File) => {
    setState({ status: 'parsing', result: null, error: null });
    try {
      const result = await parseCsvFile(file);
      setState({ status: 'success', result, error: null });
    } catch (err) {
      const message =
        typeof err === 'string' ? err : 'An unexpected error occurred while parsing the CSV.';
      setState({ status: 'error', result: null, error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { ...state, parseFile, reset };
}
