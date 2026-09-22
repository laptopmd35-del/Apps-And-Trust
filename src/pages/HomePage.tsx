import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Layers,
  Flame,
  Clock,
  CheckCircle2,
  ExternalLink,
  Lock,
  Zap,
  Star,
  Download,
  AlertTriangle
} from 'lucide-react';
import { AppItem, Category } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredApps, setFeaturedApps] = useState<AppItem[]>([]);
  const [trendingGames, setTrendingGames] = useState<AppItem[]>([]);
  const [latestApps, setLatestApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setDbError(false);
      try {
        const [appsRes, gamesRes, latestRes, catsRes] = await Promise.all([
          fetch('/api/apps?featured=true&limit=6'),
          fetch('/api/apps?isGame=true&sort=downloads&limit=4'),
          fetch('/api/apps?sort=latest&limit=6'),
          fetch('/api/categories')
        ]);

        if (appsRes.ok) {
          const data = await appsRes.json();
          setFeaturedApps(data.data || []);
        } else {
          setDbError(true);
        }

        if (gamesRes.ok) {
          const data = await gamesRes.json();
          setTrendingGames(data.data || []);
        }
        if (latestRes.ok) {
          const data = await latestRes.json();
          setLatestApps(data.data || []);
        }
        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setDbError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Safe Apps. Simple Downloads.</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Discover Apps <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              You Can Trust
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse useful apps and games from HushAPK. Find verified app specifications and follow direct publisher download links safely.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="flex flex-col sm:flex-row items-center gap-2.5 max-w-xl mx-auto pt-2"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, games, developers..."
                className="w-full pl-12 pr-4 py-3 text-base rounded-2xl bg-slate-900/95 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-700/25 shrink-0 flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/apps"
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700/60 transition-all flex items-center gap-2 shadow"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Explore Apps</span>
            </Link>
            <Link
              to="/games"
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700/60 transition-all flex items-center gap-2 shadow"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Browse Games</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No APK Hosting</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Mirrors</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Malware Scripts</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Privacy-Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Database Failure Notification */}
      {dbError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Apps are temporarily unavailable. Please try again later.</span>
        </div>
      )}

      {/* Featured Apps Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Featured Applications
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Staff-curated essential tools and high-quality utilities
              </p>
            </div>
          </div>
          <Link
            to="/apps"
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : featuredApps.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No featured apps curated yet. Browse all available apps in our directory.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Games Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Trending Games
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Most downloaded action, racing, and arcade adventures
              </p>
            </div>
          </div>
          <Link
            to="/games"
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>Browse Games</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {trendingGames.length === 0 && !isLoading ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            Explore the gaming section for the complete catalog of games.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {trendingGames.map((game) => (
              <AppCard key={game.id} app={game} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Browse By Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore specialized collections of tools and games
              </p>
            </div>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between h-32"
            >
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                  {cat.isGame ? 'Gaming' : 'App'}
                </span>
                <h3 className="font-bold text-base text-slate-200 group-hover:text-white mt-2 truncate">
                  {cat.name}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{cat.appCount || 0} listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-emerald-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Recently Updated
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Fresh releases and newest version rollouts
              </p>
            </div>
          </div>
          <Link
            to="/latest"
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>See New Releases</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestApps.length === 0 && !isLoading ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No updates released yet. Check back soon for fresh versions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Safety & Protocol Banner */}
      <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Lock className="w-3.5 h-3.5" />
              <span>Official Publisher Redirect Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How HushAPK Guarantees Download Integrity
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike unauthorized mirror repositories that inject third-party ad-wrappers or repackage binaries, HushAPK never touches application files. When you click DOWNLOAD, our directory routes your browser straight to the official mirror, GitHub repository release, or author site registered by administrators.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/disclaimer"
              className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-center text-sm border border-slate-700 transition-colors"
            >
              Read Verification Policy
            </Link>
            <Link
              to="/report"
              className="w-full py-3 px-5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-center text-sm border border-rose-500/30 transition-colors"
            >
              Report an Issue / Broken Link
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
