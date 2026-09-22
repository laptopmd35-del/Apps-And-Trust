'use client';

import React, { useEffect } from 'react';
import { ShieldCheck, RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log non-fatal error details safely
    console.error('[HushAPK Application Error]', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-sm">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-xl tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <span>HushAPK</span>
        </div>

        {/* Error Icon & Message */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            HushAPK encountered an unexpected issue while loading this view. The directory service and your data remain safe.
          </p>
        </div>

        {/* Action Buttons */}
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
    </div>
  );
}
