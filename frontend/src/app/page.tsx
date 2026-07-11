"use client";

import React from 'react';
import { AlertCircle, Sparkles, Upload, Eye, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UploadCard from '@/components/upload/UploadCard';
import ImportLoading from '@/components/import/ImportLoading';
import ImportResults from '@/components/import/ImportResults';
import { useImport } from '@/hooks/useImport';

type AppStep = 'upload' | 'loading' | 'results';

const STEPS = [
  { id: 'upload',  icon: Upload,      label: 'Upload' },
  { id: 'loading', icon: Sparkles,    label: 'AI Extract' },
  { id: 'results', icon: CheckCircle, label: 'Results' },
] as const;

export default function Home() {
  const { status, result, error, startImport, reset } = useImport();

  const step: AppStep =
    status === 'loading'
      ? 'loading'
      : status === 'success' && result
      ? 'results'
      : 'upload';

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      {step === 'upload' && (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-accent/20 border-b border-border/40">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 py-16 text-center relative z-10">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Field Extraction
            </div>

            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
              Import any CSV into{' '}
              <span className="text-primary">GrowEasy CRM</span>
            </h1>
            <p className="animate-fade-in-up animate-delay-100 text-lg text-muted-foreground max-w-xl mx-auto">
              Upload any CSV file — no matter the column names. Grok AI intelligently maps your data to the right CRM fields automatically.
            </p>

            {/* Step indicators */}
            <div className="animate-fade-in-up animate-delay-200 flex items-center justify-center gap-0 mt-10">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isActive  = s.id === step;
                const isDone    = idx < stepIndex;
                return (
                  <React.Fragment key={s.id}>
                    <div className={`flex flex-col items-center gap-1.5`}>
                      <div className={[
                        'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                        isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' :
                        isDone   ? 'bg-primary/20 text-primary' :
                                   'bg-muted text-muted-foreground',
                      ].join(' ')}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`w-16 h-px mb-5 mx-1 transition-all ${isDone || isActive ? 'bg-primary/40' : 'bg-border'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className={`flex-1 container mx-auto px-4 py-10 ${step === 'results' ? '' : 'flex flex-col items-center'}`}>
        <div className={`w-full ${step === 'results' ? '' : 'max-w-5xl'}`}>
          {step === 'upload' && (
            <>
              {status === 'error' && error && (
                <div className="mb-6 max-w-xl mx-auto animate-fade-in">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Import Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              <UploadCard
                onConfirm={startImport}
                isImporting={status === 'loading'}
              />
            </>
          )}

          {step === 'loading' && <ImportLoading />}

          {step === 'results' && result && (
            <ImportResults result={result} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  );
}
