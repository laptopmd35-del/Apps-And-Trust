import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';

export function CopyrightPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Copyright Notice' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Copyright Notice</h1>
        <p className="text-sm text-slate-400 mt-2">
          Ownership of trademarks, logos, and editorial materials.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white">Trademark and Logo Rights</h2>
        <p>
          All trademarks, registered logos, trade names, and product names referenced across HushAPK belong solely to their respective developers and companies. Their presence on this directory serves solely to identify software products. HushAPK is not affiliated with, sponsored by, or endorsed by Google LLC, Android, or third-party developers listed herein.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">Original Content & Directory Architecture</h2>
        <p>
          The textual reviews, layout designs, curation architecture, search algorithms, and proprietary code of HushAPK are protected under intellectual property legislation.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">Operator Responsibilities</h2>
        <p>
          HushAPK administrators ensure that software listings are added in good faith to reference authorized sources, official mirrors, or open-source releases. If any publisher wishes to modify their listing details or external links, please reach out to our team.
        </p>
      </div>
    </div>
  );
}
