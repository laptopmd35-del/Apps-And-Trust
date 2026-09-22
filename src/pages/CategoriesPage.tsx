import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Gamepad2, ArrowRight, Grid } from 'lucide-react';
import { Category } from '../types.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCats();
  }, []);

  const appCategories = categories.filter((c) => !c.isGame);
  const gameCategories = categories.filter((c) => c.isGame);

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse All Categories
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Explore mobile applications and games organized by functional genre and use case.
        </p>
      </div>

      {/* Application Categories */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Layers className="w-4 h-4" />
          <span>Application Categories</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                    {cat.appCount || 0} apps
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cat.description || 'Explore curated tools and software in this category.'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-4 pt-3 border-t border-slate-800/60">
                <span>View listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gaming Categories */}
      <section className="space-y-4 pt-6 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Gamepad2 className="w-4 h-4" />
          <span>Gaming Genres</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                    {cat.appCount || 0} games
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cat.description || 'Action-packed games and entertainment adventures.'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold mt-4 pt-3 border-t border-slate-800/60">
                <span>View listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
