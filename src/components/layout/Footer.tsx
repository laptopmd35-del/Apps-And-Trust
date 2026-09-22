import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, AlertTriangle, Heart, Mail, Github, Twitter } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.js';

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-20">
      {/* Important Legal Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Notice:</strong> HushAPK is an independent app directory. We do <strong>NOT</strong> host or upload APK files. All downloads redirect to verified external publisher links.
            </span>
          </div>
          <Link
            to="/disclaimer"
            className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            Read Disclaimer & Safety Guidelines
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {settings.siteName || 'HushAPK'}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.description ||
                'Safe Apps. Simple Downloads. HushAPK provides curated mobile software specifications and safe external links directly to authentic publisher sources.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Directory Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/apps" className="hover:text-emerald-400 transition-colors">
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-emerald-400 transition-colors">
                  Mobile Games
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/latest" className="hover:text-emerald-400 transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-emerald-400 transition-colors">
                  Trending Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/tools" className="hover:text-emerald-400 transition-colors">
                  Tools & Utilities
                </Link>
              </li>
              <li>
                <Link to="/category/productivity" className="hover:text-emerald-400 transition-colors">
                  Productivity
                </Link>
              </li>
              <li>
                <Link to="/category/communication" className="hover:text-emerald-400 transition-colors">
                  Communication
                </Link>
              </li>
              <li>
                <Link to="/category/video-audio" className="hover:text-emerald-400 transition-colors">
                  Video & Audio
                </Link>
              </li>
              <li>
                <Link to="/category/arcade-games" className="hover:text-emerald-400 transition-colors">
                  Arcade Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About HushAPK
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-emerald-400 transition-colors">
                  Copyright Notice
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="hover:text-emerald-400 transition-colors">
                  DMCA Takedown
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Report Broken Link / Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and note */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{settings.footerText || '© 2026 HushAPK. All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Contact Admin
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">
              Publisher / Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
