"use client";

import React from 'react';
import { Database, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-lg blur-sm" />
            <div className="relative bg-primary/10 border border-primary/20 p-2 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">GrowEasy</span>
            <span className="text-muted-foreground font-normal text-lg"> · CSV Importer</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 border border-border/60 rounded-full px-3 py-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Powered by Grok AI</span>
          </div>

          {/* Dark mode toggle */}
          <Button
            id="dark-mode-toggle"
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground rounded-lg"
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
