import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';
import { useSettings } from '../../context/SettingsContext.js';

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'About HushAPK' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Our Mission & Core Philosophy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          About HushAPK
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          {settings.tagline || 'Safe Apps. Simple Downloads.'} — An independent, transparent software directory designed to help users discover authentic mobile applications with direct publisher links.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white">What is HushAPK?</h2>
        <p>
          HushAPK is an online mobile software catalog. In a web ecosystem cluttered with adware installers, deceitful popups, and modified application binaries, HushAPK was founded on one simple premise: <strong>No hosting, no altering, no automatic installation.</strong>
        </p>
        <p>
          We curate detailed technical metadata—including package identifiers, version logs, target Android API levels, release notes, and developer credentials—and provide clean, verified links directly to the external publisher or authorized distribution mirror.
        </p>

        <h2 className="text-xl font-bold text-white pt-4">Key Operating Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero APK Hosting</span>
            </div>
            <p className="text-xs text-slate-400">
              Our servers do not store APK files. Download buttons navigate your browser to external sources selected by administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transparent Metadata</span>
            </div>
            <p className="text-xs text-slate-400">
              Every listing displays the authentic developer name, official package name, file size, and date of verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Respect for Copyright</span>
            </div>
            <p className="text-xs text-slate-400">
              We respond promptly to DMCA requests and publisher requests to update or remove listings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Community Reviews</span>
            </div>
            <p className="text-xs text-slate-400">
              Users can submit honest feedback and star ratings to guide fellow community members.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mt-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Important Safety Notice:</strong> While HushAPK verifies link validity and developer domains at the time of publication, external hosts may update their files independently. We encourage users to verify package checksums and scan downloaded files with reputable on-device antivirus protection.
          </div>
        </div>
      </div>
    </div>
  );
}
