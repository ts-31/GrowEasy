"use client";

import React from 'react';
import { Loader2, Brain } from 'lucide-react';

export default function ImportLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 gap-6">
      {/* Animated icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative p-5 rounded-full bg-primary/10 border border-primary/20">
          <Brain className="w-10 h-10 text-primary" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-lg font-semibold text-foreground">
          AI is reading your CSV…
        </p>
        <p className="text-sm text-muted-foreground">
          Grok is intelligently mapping each record to CRM fields.
          This may take a minute depending on file size.
        </p>
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[progressSlide_1.8s_ease-in-out_infinite]" />
      </div>

      <p className="text-xs text-muted-foreground animate-pulse">
        Processing in batches · Please do not close this tab
      </p>

      <style jsx>{`
        @keyframes progressSlide {
          0%   { transform: translateX(-100%) scaleX(0.4); }
          50%  { transform: translateX(60%)  scaleX(0.6); }
          100% { transform: translateX(200%) scaleX(0.4); }
        }
      `}</style>
    </div>
  );
}
