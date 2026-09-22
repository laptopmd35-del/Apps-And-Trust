import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';

export function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4" />
          <span>Operational Disclosure</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Disclaimer & Safe Download Policy
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Please read this disclosure carefully before browsing software entries or utilizing external publisher download links on HushAPK.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white">1. Informational Directory Service Only</h2>
        <p>
          HushAPK operates exclusively as an index and directory service providing technical specifications, developer descriptions, and publicly available download links for mobile applications. <strong>HushAPK does NOT upload, store, host, mirror, or modify APK files or installer archives on its own infrastructure.</strong>
        </p>

        <h2 className="text-xl font-bold text-white pt-3">2. External Redirection & Zero Automatic Installation</h2>
        <p>
          When you click the "DOWNLOAD" button on any listing within HushAPK:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
          <li>The web application triggers standard browser navigation to the external URL registered by website administrators (such as the developer's official site, GitHub release repository, or authorized mirror).</li>
          <li>HushAPK does <strong>NOT</strong> automatically install applications or execute installation intents on your device.</li>
          <li>Any file transfer that takes place occurs directly between your web browser and the third-party publisher server hosting the resource.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-3">3. External Content & Security Warranty</h2>
        <p>
          While HushAPK verifies link validity and developer credentials prior to listing, we do not control third-party servers. We explicitly do not warrant that external files are free of malware, viruses, or defects unless an explicit authenticated cryptographic checksum has been validated. Users are strongly urged to inspect file hashes and maintain updated endpoint security software.
        </p>

        <h2 className="text-xl font-bold text-white pt-3">4. Intellectual Property & Trademarks</h2>
        <p>
          All trademarks, registered logos, trade names, and copyrighted materials appearing on HushAPK are the property of their respective owners. Their inclusion in this software catalog is strictly for identification and editorial evaluation purposes.
        </p>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mt-6 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Reporting Compromised Links:</strong> If you identify any link that is broken, outdated, leads to an unauthorized third-party file, or presents security hazards, please use our{' '}
            <a href="/report" className="text-emerald-400 underline font-semibold">
              Issue Report Center
            </a>{' '}
            for immediate editorial review and removal.
          </div>
        </div>
      </div>
    </div>
  );
}
