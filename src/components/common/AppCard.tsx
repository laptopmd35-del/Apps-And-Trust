import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Star,
  HardDrive,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { AppItem } from '../../types.js';
import { openExternalDownloadUrl } from '../../utils/urlSecurity.js';
import { handleImageError } from '../../utils/imageFallback.js';

interface AppCardProps {
  app: AppItem;
}

export function AppCard({ app }: AppCardProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRedirecting(true);
    try {
      // Record download click in real statistics backend
      const res = await fetch(`/api/apps/${app.id}/click`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.downloadUrl) {
        // Direct to external URL provided by admin safely
        openExternalDownloadUrl(data.downloadUrl);
      } else {
        // Fallback to stored downloadUrl
        openExternalDownloadUrl(app.downloadUrl);
      }
    } catch (err) {
      console.error('Click logging error, opening direct link:', err);
      openExternalDownloadUrl(app.downloadUrl);
    } finally {
      setTimeout(() => {
        setIsRedirecting(false);
      }, 1200);
    }
  };

  const formattedDate = new Date(app.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-emerald-950/10">
      {/* Top Section */}
      <div>
        <div className="flex items-start gap-4">
          {/* App Icon */}
          <Link to={`/app/${app.slug}`} className="relative shrink-0">
            <img
              src={app.icon}
              alt={app.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border border-slate-700/60 shadow-md group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            {app.featured && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow">
                Featured
              </span>
            )}
          </Link>

          {/* Title & Developer */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/app/${app.slug}`}
              className="block font-bold text-base text-slate-100 hover:text-emerald-400 truncate transition-colors"
            >
              {app.name}
            </Link>
            <p className="text-xs text-slate-400 truncate mt-0.5">{app.developer}</p>

            {/* Category badge & Rating */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                {app.categoryName || (app.isGame ? 'Game' : 'App')}
              </span>
              <div className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Meta Specifications */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{app.fileSize}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end">
            <span className="text-slate-400">v{app.version}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end text-emerald-400/90 font-medium">
            <Download className="w-3 h-3 shrink-0" />
            <span>{app.downloadCount.toLocaleString()} clicks</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: VIEW DETAILS & DOWNLOAD */}
      <div className="grid grid-cols-2 gap-2 mt-5 pt-2">
        <Link
          to={`/app/${app.slug}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </Link>

        <button
          onClick={handleDownloadClick}
          disabled={isRedirecting}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 disabled:opacity-75"
          title={`External Download: ${app.downloadUrl}`}
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Redirecting...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </>
          )}
        </button>
      </div>

      {/* Safety Badge */}
      <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-slate-400">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        <span>External Publisher Link</span>
      </div>
    </div>
  );
}
