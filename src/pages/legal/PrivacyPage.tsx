import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mt-2">
          Last revised: September 2026. How HushAPK respects and protects user privacy.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
        <p>
          HushAPK is built with privacy-first principles. We do not require regular visitors to register for user accounts or provide personal identifiers to browse software catalogs or access download links.
        </p>
        <p>
          When you click a download link, our analytics engine records an anonymized click event containing the application ID, timestamp, and a cryptographically one-way hashed representation of the IP address to prevent click-fraud and measure listing popularity. We cannot reverse this hash into personal identification.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">2. Cookies & Local Storage</h2>
        <p>
          We use local storage strictly for essential user preferences:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
          <li>Theme preference (Dark / Light mode).</li>
          <li>Administrator authentication tokens (only for authorized site operators).</li>
        </ul>

        <h2 className="text-lg font-bold text-white pt-2">3. Third-Party Websites & External Redirections</h2>
        <p>
          When you click on an external download link, you are redirected to third-party publisher servers. HushAPK is not responsible for the privacy practices, tracking cookies, or terms of third-party domains.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">4. User Reviews and Reports</h2>
        <p>
          When you submit an app review or issue report, the screen name and textual comments provided will be stored to display the review or address the reported issue.
        </p>
      </div>
    </div>
  );
}
