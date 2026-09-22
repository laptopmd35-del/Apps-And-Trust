import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-6 font-sans">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-white">Loading directory listings...</p>
        <p className="text-xs text-slate-400">Fetching verified app specifications</p>
      </div>
    </div>
  );
}
