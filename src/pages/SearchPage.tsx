import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Layers, RefreshCw } from 'lucide-react';
import { AppItem } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/apps?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Search Results
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

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No results found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            We couldn't find any apps matching "{query}". Try checking for spelling errors or using broader keywords.
          </p>
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
