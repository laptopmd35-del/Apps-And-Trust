import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { AppItem } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function LatestPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch('/api/apps?sort=latest&limit=30');
        if (res.ok) {
          const data = await res.json();
          setApps(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load latest apps:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLatest();
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Latest Updates' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4" />
          <span>Continuous Fresh Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Latest Released & Updated Apps
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Recently cataloged versions, patches, and newly listed applications.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
