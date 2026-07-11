"use client";

import React from 'react';
import { Brain, Zap } from 'lucide-react';

export default function ImportLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-28 gap-8 animate-fade-in">
      {/* Animated icon stack */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-primary/20 animate-spin [animation-duration:8s]" />
        <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-spin [animation-duration:5s] [animation-direction:reverse]" />
        {/* Ping */}
        <div className="absolute w-16 h-16 rounded-full bg-primary/15 animate-ping [animation-duration:2s]" />
        {/* Core */}
        <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
          <Brain className="w-7 h-7 text-primary" />
        </div>
        {/* Orbiting zap */}
        <div className="absolute w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-spin [animation-duration:3s]"
             style={{ transform: 'translateX(42px)' }}>
          <Zap className="w-3 h-3 text-primary" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-xl font-bold text-foreground">
          Grok AI is reading your CSV…
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Intelligently mapping each record to GrowEasy CRM fields.
          This may take a minute depending on file size.
        </p>
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-72 space-y-2">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
        </div>
        <p className="text-center text-xs text-muted-foreground animate-pulse">
          Processing in batches · Please do not close this tab
        </p>
      </div>

      {/* Status dots */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Parsing rows
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse [animation-delay:0.3s]" />
          Extracting fields
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary/30 animate-pulse [animation-delay:0.6s]" />
          Building records
        </span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}
