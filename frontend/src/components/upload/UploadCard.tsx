"use client";

import React, { useCallback, useEffect } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { CloudUpload, FileText, Trash2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/utils/formatBytes';
import { useCsvParser } from '@/hooks/useCsvParser';
import CsvPreview from '@/components/upload/CsvPreview';

export default function UploadCard() {
  const [file, setFile] = React.useState<File | null>(null);
  const [dropError, setDropError] = React.useState<string | null>(null);

  const { status, result, error: parseError, parseFile, reset } = useCsvParser();

  // Trigger parsing whenever a new file is selected
  useEffect(() => {
    if (file) {
      parseFile(file);
    }
  }, [file, parseFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setDropError(null);
      if (fileRejections.length > 0) {
        setDropError('Please upload a valid .csv file.');
        return;
      }
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
    setDropError(null);
    reset();
  };

  const hasError = !!dropError;
  const isImportReady = status === 'success' && result !== null;

  return (
    <div className="w-full space-y-6">
      {/* Upload Card */}
      <Card className="w-full max-w-xl mx-auto shadow-sm border-muted">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Upload CSV Data</CardTitle>
          <CardDescription>
            Drag and drop your CSV file here, or click to browse.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Dropzone — shown when no file selected */}
          {!file && (
            <div
              {...getRootProps()}
              className={[
                'border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : hasError
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
              ].join(' ')}
            >
              <input {...getInputProps()} />
              <div
                className={`p-4 rounded-full mb-4 ${
                  hasError ? 'bg-destructive/10' : 'bg-primary/10'
                }`}
              >
                <CloudUpload
                  className={`w-8 h-8 ${hasError ? 'text-destructive' : 'text-primary'}`}
                />
              </div>
              {isDragActive ? (
                <p className="text-base font-medium text-primary">
                  Drop the CSV file here…
                </p>
              ) : (
                <div className="text-center">
                  <p className="text-base font-medium text-foreground">
                    Drag &amp; drop a CSV file here, or{' '}
                    <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Only .csv files are supported
                  </p>
                </div>
              )}
            </div>
          )}

          {/* File selected row */}
          {file && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium leading-none mb-1 truncate max-w-[200px] sm:max-w-[320px]"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label="Remove selected file"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Drop/validation error */}
          {dropError && (
            <div className="flex items-center justify-center gap-2 text-sm text-destructive mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dropError}</span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full text-base font-medium"
            size="lg"
            disabled={!isImportReady}
          >
            Confirm Import
          </Button>
        </CardFooter>
      </Card>

      {/* CSV Preview — rendered below the card when a file is loaded */}
      {file && (
        <CsvPreview
          state={{ status, result: result ?? null, error: parseError }}
        />
      )}
    </div>
  );
}
