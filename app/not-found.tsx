import React from 'react';
import { ShieldCheck, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-xl">
          <ShieldCheck className="w-6 h-6" />
          <span>HushAPK</span>
        </div>

        <div className="space-y-2">
          <div className="text-5xl font-black text-emerald-500/30">404</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The requested software listing, category, or document does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </a>

          <a
            href="/search"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Directory</span>
          </a>
        </div>
      </div>
    </div>
  );
}
