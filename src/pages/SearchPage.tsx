import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Layers, AlertTriangle } from 'lucide-react';
import { AppItem } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/apps?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || []);
        } else {
          setErrorMessage('Apps are temporarily unavailable. Please try again later.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setErrorMessage('Apps are temporarily unavailable. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setErrorMessage(null);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Search Directory
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {query ? (
            <>
              Showing results for <span className="text-emerald-400 font-semibold">"{query}"</span>
            </>
          ) : (
            'Enter keywords to search across application names, developers, and categories.'
          )}
        </p>

        {/* Large Search Input */}
        <form onSubmit={handleSubmit} className="mt-5 max-w-xl flex gap-2">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search apps, games, developers, package names..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Database or network error */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : !query.trim() ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Looking for something specific?</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Type any software utility, communication tool, or genre name above to filter our verified directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['VLC', 'Telegram', 'Brave', 'Tools', 'Media'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchInput(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No results found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            We couldn't find any apps matching "{query}". Try checking for spelling errors or using broader keywords.
          </p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            Browse All Applications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
