import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gamepad2, Search, ArrowUpDown, RefreshCw, Trophy, AlertTriangle } from 'lucide-react';
import { AppItem, Category } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'downloads';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setDbError(false);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('isGame', 'true');
        if (selectedCategory) queryParams.set('categoryId', selectedCategory);
        if (selectedSort) queryParams.set('sort', selectedSort);
        if (searchQuery) queryParams.set('search', searchQuery);

        const [gamesRes, catsRes] = await Promise.all([
          fetch(`/api/apps?${queryParams.toString()}`),
          fetch('/api/categories')
        ]);

        if (gamesRes.ok) {
          const data = await gamesRes.json();
          setGames(data.data || []);
        } else {
          setDbError(true);
        }

        if (catsRes.ok) {
          const cats = await catsRes.json();
          setCategories((cats || []).filter((c: Category) => c.isGame));
        }
      } catch (err) {
        console.error('Failed to load games:', err);
        setDbError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, selectedSort, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('q', searchInput.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const handleCategoryChange = (catId: string) => {
    const next = new URLSearchParams(searchParams);
    if (catId) {
      next.set('category', catId);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSortChange = (sortVal: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sortVal);
    setSearchParams(next);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Games' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Mobile Gaming Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mobile Games
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore arcade classics, racing simulators, action blockbusters, and puzzle adventures.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </form>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
          >
            All Genres
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Sort:</span>
          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <option value="downloads">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="latest">Recently Updated</option>
            <option value="name">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Database Failure Notification */}
      {dbError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center justify-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Apps are temporarily unavailable. Please try again later.</span>
        </div>
      )}

      {/* Games Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80">
          <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No games found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            No games match your selected genre or search query.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <AppCard key={game.id} app={game} />
          ))}
        </div>
      )}
    </div>
  );
}
