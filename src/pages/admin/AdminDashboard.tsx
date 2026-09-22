import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Gamepad2,
  FolderTree,
  MessageSquare,
  Flag,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Star,
  Activity,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Lock,
  Key,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { AppItem, Category, Review, Report, AnalyticsSummary } from '../../types.js';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { AppFormModal } from '../../components/admin/AppFormModal.js';

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout, isAuthenticated } = useAuth();
  const { settings, updateSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'categories' | 'reviews' | 'reports' | 'settings'>('overview');

  // Data states
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // App Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  // App Filter / Search
  const [appSearch, setAppSearch] = useState('');
  const [appCatFilter, setAppCatFilter] = useState('');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIsGame, setCatIsGame] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Settings local state
  const [siteSettings, setSiteSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadAllAdminData();
  }, [isAuthenticated]);

  useEffect(() => {
    setSiteSettings(settings);
  }, [settings]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === '/admin/apps/new') {
      setActiveTab('apps');
      setEditingApp(null);
      setIsAppModalOpen(true);
    } else if (path.startsWith('/admin/apps/') && path.endsWith('/edit')) {
      setActiveTab('apps');
      const parts = path.split('/');
      const editId = parts[3];
      if (editId && apps.length > 0) {
        const found = apps.find((a) => a.id === editId);
        if (found) {
          setEditingApp(found);
          setIsAppModalOpen(true);
        }
      }
    } else if (path.startsWith('/admin/apps')) {
      setActiveTab('apps');
    } else if (path.startsWith('/admin/categories')) {
      setActiveTab('categories');
    } else if (path.startsWith('/admin/reviews')) {
      setActiveTab('reviews');
    } else if (path.startsWith('/admin/reports')) {
      setActiveTab('reports');
    } else if (path.startsWith('/admin/settings') || path.startsWith('/admin/users')) {
      setActiveTab('settings');
    } else if (path.startsWith('/admin/analytics') || path.startsWith('/admin/activity') || path === '/admin') {
      setActiveTab('overview');
    }
  }, [location.pathname, apps]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [appsRes, catsRes, revRes, repRes, analRes, actRes] = await Promise.all([
        fetch('/api/apps?limit=100'),
        fetch('/api/categories'),
        fetch('/api/reviews', { headers }),
        fetch('/api/reports', { headers }),
        fetch('/api/analytics', { headers }),
        fetch('/api/activity', { headers })
      ]);

      if (appsRes.ok) {
        const d = await appsRes.json();
        setApps(d.data || []);
      } else {
        setLoadError(true);
      }
      if (catsRes.ok) {
        const d = await catsRes.json();
        setCategories(d || []);
      }
      if (revRes.ok) {
        const d = await revRes.json();
        setReviews(d || []);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setReports(d || []);
      }
      if (analRes.ok) {
        const d = await analRes.json();
        setAnalytics(d);
      }
      if (actRes.ok) {
        const d = await actRes.json();
        setActivity(d || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Save / Update App
  const handleSaveApp = async (appData: Partial<AppItem>) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    if (editingApp) {
      const res = await fetch(`/api/apps/${editingApp.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(appData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update app');
      }
      const updated = await res.json();
      setApps(apps.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers,
        body: JSON.stringify(appData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create app');
      }
      const created = await res.json();
      setApps([created, ...apps]);
    }
    loadAllAdminData();
  };

  // Delete App
  const handleDeleteApp = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from directory?`)) return;

    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApps(apps.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Category Create / Edit
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    try {
      if (editingCatId) {
        const res = await fetch(`/api/categories/${editingCatId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ name: catName, description: catDesc, isGame: catIsGame })
        });
        if (res.ok) {
          const updated = await res.json();
          setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
          setEditingCatId(null);
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: catName, description: catDesc, isGame: catIsGame })
        });
        if (res.ok) {
          const created = await res.json();
          setCategories([...categories, created]);
        }
      }
      setCatName('');
      setCatDesc('');
      setCatIsGame(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Apps in this category will need updating.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review status
  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'hidden') => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Report status
  const handleUpdateReportStatus = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(siteSettings);
    if (success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!currentPassword) {
      setPwdError('Current password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirm password do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPwdSuccess('Administrator password changed successfully! Your new password is now active.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        setPwdError(data.error || 'Failed to update password. Please check your current password.');
      }
    } catch (err: any) {
      setPwdError(err.message || 'Error occurred while updating password.');
    } finally {
      setPwdLoading(false);
    }
  };

  // Filtered Apps
  const filteredApps = apps.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.developer.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.packageName.toLowerCase().includes(appSearch.toLowerCase());
    const matchesCat = !appCatFilter || a.categoryId === appCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Administrative Control Panel
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            HushAPK Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAllAdminData()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Account Security & Password Settings"
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Change Password</span>
          </button>
          <div className="text-xs text-right hidden sm:block">
            <p className="font-bold text-white">{user?.username || 'Administrator'}</p>
            <p className="text-slate-400 text-[11px] font-mono">{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Database/Service Error Alert */}
      {loadError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Database or administrative services are temporarily unavailable. Please retry.</span>
          </div>
          <button
            onClick={() => loadAllAdminData()}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'apps'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Apps & Games ({apps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>User Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Issue Reports ({reports.filter((r) => r.status === 'open').length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Site Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Total Applications</span>
              <p className="text-2xl font-extrabold text-white">{analytics?.totalApps || apps.length}</p>
              <span className="text-[10px] text-emerald-400">Active listings</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Mobile Games</span>
              <p className="text-2xl font-extrabold text-cyan-400">{analytics?.totalGames || 0}</p>
              <span className="text-[10px] text-slate-400">Entertainment titles</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Categories</span>
              <p className="text-2xl font-extrabold text-purple-400">{categories.length}</p>
              <span className="text-[10px] text-slate-400">Taxonomy groups</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Total Downloads/Clicks</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                {(analytics?.totalDownloads || 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-400">External redirects</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Pending Reports</span>
              <p className="text-2xl font-extrabold text-rose-400">
                {analytics?.pendingReports || 0}
              </p>
              <span className="text-[10px] text-rose-400">Requires review</span>
            </div>
          </div>

          {/* Top 5 Most Downloaded Apps & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Downloaded */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Top Downloaded Applications</span>
                </h3>
                <span className="text-xs text-slate-400">Redirect Traffic</span>
              </div>

              <div className="space-y-3">
                {(analytics?.topApps || apps.slice(0, 5)).map((item: AppItem, idx: number) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-9 h-9 rounded-xl object-cover bg-slate-700 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{item.developer}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-emerald-400">
                        {item.downloadCount.toLocaleString()} clicks
                      </p>
                      <p className="text-[10px] text-slate-400">v{item.version}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Admin Activity */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Recent Editorial Actions</span>
                </h3>
                <span className="text-xs text-slate-400">Audit Trail</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activity.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No recent log entries.</p>
                ) : (
                  activity.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-800/50 border border-slate-750 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{act.action}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{act.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPS MANAGEMENT */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Filter apps by name, package..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <select
                value={appCatFilter}
                onChange={(e) => setAppCatFilter(e.target.value)}
                className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingApp(null);
                setIsAppModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New App Listing</span>
            </button>
          </div>

          {/* Apps Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Application</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Version & Size</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Clicks</th>
                    <th className="py-3 px-4">External URL</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.icon}
                            alt={a.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700/60 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white truncate">{a.name}</span>
                              {a.featured && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{a.developer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {a.categoryName || (a.isGame ? 'Game' : 'App')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span>v{a.version}</span>
                        <span className="text-slate-400 block text-[10px]">{a.fileSize}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{a.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {a.downloadCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                        <a
                          href={a.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{a.downloadUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/app/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="View public page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setEditingApp(a);
                              setIsAppModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(a.id, a.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create / Edit Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">
              {editingCatId ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Photography & Video"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Short summary of tools in this category..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={catIsGame}
                  onChange={(e) => setCatIsGame(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/40"
                />
                <span>Is Gaming Genre</span>
              </label>

              <div className="flex items-center gap-2 pt-2">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatId(null);
                      setCatName('');
                      setCatDesc('');
                      setCatIsGame(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editingCatId ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm">Existing Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.isGame ? 'Gaming' : 'App'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-2">
                      {c.appCount || 0} listings assigned
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCatId(c.id);
                        setCatName(c.name);
                        setCatDesc(c.description || '');
                        setCatIsGame(c.isGame || false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm">User Reviews Moderation</h3>
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No reviews submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{r.userName}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        r.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-slate-400">
                      Target App ID: <span className="font-mono">{r.appId}</span> • {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateReviewStatus(r.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-rose-400"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REPORTS RESOLUTION */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm">Issue Reports & Broken Link Alerts</h3>
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No reports filed.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rep.appName || 'Unknown Application'}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold text-[10px]">
                        {rep.reason.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{rep.details}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3">
                      {rep.contactEmail && <span>Contact: {rep.contactEmail}</span>}
                      <span>Logged: {new Date(rep.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                        <button
                          onClick={() => handleUpdateReportStatus(rep.id, 'dismissed')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Card 1: Admin Security & Password Change */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Admin Security & Password</h3>
                  <p className="text-[11px] text-slate-400">All passwords are encrypted and masked</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
                {user?.username || 'admin'}
              </span>
            </div>

            {/* Account Info Pill */}
            <div className="p-3 rounded-2xl bg-slate-850/90 border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Account: <strong className="text-white">{user?.username}</strong></span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Role: {user?.role || 'admin'}</span>
            </div>

            {pwdSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              {/* Current Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (minimum 6 characters)"
                    autoComplete="new-password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters.</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    autoComplete="new-password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword && (
                  <p className={`text-[11px] mt-1 font-medium ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {pwdLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card 2: Website Identity & General Settings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Website Identity & General</h3>
                  <p className="text-[11px] text-slate-400">Public directory branding and metadata</p>
                </div>
              </div>
              {settingsSaved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Site Title</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={siteSettings.description}
                  onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Public Contact Email</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={siteSettings.footerText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow"
              >
                <Save className="w-4 h-4" />
                <span>Save General Settings</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* App Form Modal */}
      <AppFormModal
        isOpen={isAppModalOpen}
        onClose={() => {
          setIsAppModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        initialData={editingApp}
        categories={categories}
      />
    </div>
  );
}
