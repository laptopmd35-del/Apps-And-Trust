import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { SettingsProvider } from './context/SettingsContext.js';

import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';

// Public Pages
import { HomePage } from './pages/HomePage.js';
import { AppsPage } from './pages/AppsPage.js';
import { GamesPage } from './pages/GamesPage.js';
import { CategoriesPage } from './pages/CategoriesPage.js';
import { CategoryDetailPage } from './pages/CategoryDetailPage.js';
import { AppDetailPage } from './pages/AppDetailPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { LatestPage } from './pages/LatestPage.js';
import { TrendingPage } from './pages/TrendingPage.js';

// Legal & Informational Pages
import { AboutPage } from './pages/legal/AboutPage.js';
import { ContactPage } from './pages/legal/ContactPage.js';
import { PrivacyPage } from './pages/legal/PrivacyPage.js';
import { TermsPage } from './pages/legal/TermsPage.js';
import { DisclaimerPage } from './pages/legal/DisclaimerPage.js';
import { CopyrightPage } from './pages/legal/CopyrightPage.js';
import { DmcaPage } from './pages/legal/DmcaPage.js';
import { ReportPage } from './pages/legal/ReportPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

// 404 Fallback
function NotFoundPage() {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-6xl font-black text-emerald-400">404</h1>
      <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mx-auto">
        The application directory link you followed might have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
        >
          Return to HushAPK Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
              <Navbar />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
                <ErrorBoundary>
                  <Routes>
                    {/* Directory Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/apps" element={<AppsPage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/category/:slug" element={<CategoryDetailPage />} />
                    <Route path="/app/:slug" element={<AppDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/latest" element={<LatestPage />} />
                    <Route path="/trending" element={<TrendingPage />} />

                    {/* Legal & Informational Routes */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/disclaimer" element={<DisclaimerPage />} />
                    <Route path="/copyright" element={<CopyrightPage />} />
                    <Route path="/dmca" element={<DmcaPage />} />
                    <Route path="/report" element={<ReportPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/apps" element={<AdminDashboard />} />
                    <Route path="/admin/apps/new" element={<AdminDashboard />} />
                    <Route path="/admin/apps/:id/edit" element={<AdminDashboard />} />
                    <Route path="/admin/categories" element={<AdminDashboard />} />
                    <Route path="/admin/reviews" element={<AdminDashboard />} />
                    <Route path="/admin/reports" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminDashboard />} />
                    <Route path="/admin/analytics" element={<AdminDashboard />} />
                    <Route path="/admin/settings" element={<AdminDashboard />} />
                    <Route path="/admin/activity" element={<AdminDashboard />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
