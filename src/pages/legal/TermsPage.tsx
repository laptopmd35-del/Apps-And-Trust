import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
        <p className="text-sm text-slate-400 mt-2">
          Terms governing the use and browsing of the HushAPK web directory.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By visiting or using the HushAPK website, you acknowledge and agree to comply with these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">2. Directory Nature & Third-Party Software</h2>
        <p>
          HushAPK serves solely as an index of software listings. HushAPK does not manufacture, modify, reverse-engineer, or host APK files. Any download occurs via external third-party links provided for convenience and reference.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">3. Acceptable Use</h2>
        <p>
          You agree not to scrape, flood, or disrupt our directory servers through automated query mechanisms. You also agree not to submit fraudulent reviews, spam, or abusive report tickets.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">4. Disclaimer of Warranties</h2>
        <p>
          The materials on HushAPK are provided on an 'as is' basis. HushAPK makes no warranties, expressed or implied, regarding uptime, accuracy of third-party specs, or fitness for a particular purpose.
        </p>
      </div>
    </div>
  );
}
