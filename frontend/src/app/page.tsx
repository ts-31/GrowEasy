"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UploadCard from '@/components/upload/UploadCard';
import ImportLoading from '@/components/import/ImportLoading';
import ImportResults from '@/components/import/ImportResults';
import { useImport } from '@/hooks/useImport';

type AppStep = 'upload' | 'loading' | 'results';

export default function Home() {
  const { status, result, error, startImport, reset } = useImport();

  // Derive the current step from import state
  const step: AppStep =
    status === 'loading'
      ? 'loading'
      : status === 'success' && result
      ? 'results'
      : 'upload';

  const handleConfirm = (file: File) => {
    startImport(file);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
      {/* Hero — only visible on upload step */}
      {step === 'upload' && (
        <div className="text-center mb-10 w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Import your data seamlessly
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload any CSV file. Our AI intelligently maps your columns to GrowEasy CRM fields — no manual setup required.
          </p>
        </div>
      )}

      <div className={`w-full ${step === 'results' ? 'max-w-full' : 'max-w-5xl'}`}>
        {/* Step 1 & 2 — Upload + Preview */}
        {step === 'upload' && (
          <>
            {/* Backend import error banner */}
            {status === 'error' && error && (
              <div className="mb-6 max-w-xl mx-auto">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Import Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            <UploadCard
              onConfirm={handleConfirm}
              isImporting={status === 'loading'}
            />
          </>
        )}

        {/* Step 3 — AI Processing */}
        {step === 'loading' && <ImportLoading />}

        {/* Step 4 — Results */}
        {step === 'results' && result && (
          <ImportResults result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
