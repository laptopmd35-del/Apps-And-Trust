'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-slate-950">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <span>HushAPK</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical layout exception was caught safely. HushAPK protected the session from a white screen crash.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <a
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
