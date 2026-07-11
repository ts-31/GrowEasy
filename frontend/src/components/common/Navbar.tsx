import React from 'react';
import { Database } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight">GrowEasy CSV Importer</span>
        </div>
      </div>
    </nav>
  );
}
