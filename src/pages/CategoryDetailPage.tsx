import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { AppItem, Category } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [sort, setSort] = useState<'downloads' | 'rating' | 'latest' | 'name'>('downloads');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryApps() {
      setIsLoading(true);
      try {
        const catsRes = await fetch('/api/categories');
        if (!catsRes.ok) throw new Error('Categories fetch failed');
        const cats: Category[] = await catsRes.json();
        const found = cats.find((c) => c.slug === slug);

        if (found) {
          setCategory(found);
          const appsRes = await fetch(`/api/apps?categoryId=${found.id}&sort=${sort}`);
          if (appsRes.ok) {
            const data = await appsRes.json();
            setApps(data.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load category apps:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadCategoryApps();
    }
  }, [slug, sort]);

  if (!isLoading && !category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Category Not Found</h2>
        <p className="text-slate-400 mt-2 mb-6">The requested category slug does not exist.</p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/categories' },
          { label: category ? category.name : 'Category' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {category?.isGame ? 'Gaming Genre' : 'Application Category'}
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            {category?.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {category?.description || `Browse curated listings in ${category?.name}.`}
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="latest">Latest Updated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No listings in this category yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Check back soon as our catalog is continuously updated with verified apps.
          </p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            <span>Explore All Apps</span>
          </Link>
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
