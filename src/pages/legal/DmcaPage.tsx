import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';
import { useSettings } from '../../context/SettingsContext.js';

export function DmcaPage() {
  const { settings } = useSettings();
  const [appName, setAppName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [statement, setStatement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'DMCA Takedown' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-3 border border-rose-500/20">
          <ShieldAlert className="w-4 h-4" />
          <span>Intellectual Property Protection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Digital Millennium Copyright Act (DMCA) Notice
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          HushAPK complies with the provisions of 17 U.S.C. § 512 and the Digital Millennium Copyright Act.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white">DMCA Policy Statement</h2>
        <p>
          HushAPK is an index that links to external developer websites and mirrors. We do not host copyrighted installation packages on our servers. However, we respect all trademark and copyright rights. If you are a copyright owner or an authorized agent and believe that any listing on HushAPK infringes upon your copyright, you may submit a written notice.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">Requirements for Valid Notification</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material on HushAPK that is claimed to be infringing (provide specific URL).</li>
          <li>Contact information, including your full legal name, physical address, and telephone number.</li>
          <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner.</li>
          <li>A statement made under penalty of perjury that the information in the notification is accurate.</li>
        </ul>

        {/* Takedown Submission Form */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Submit a Takedown Notice</h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white">Notice Received</h4>
              <p className="text-xs text-slate-300">
                Your DMCA notice has been logged. Our legal team will review the claim and promptly delist the specified link if verified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Copyright Holder / Organization</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Acme Software Inc."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Agent / Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="legal@acme.com"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Affected Application Name / URL on HushAPK</label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="https://hushapk.org/app/example-app"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Official Proof URL (e.g. Publisher Site or Trademark Registration)</label>
                <input
                  type="url"
                  required
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://example.com/legal"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Perjury Statement & Specific Grievance</label>
                <textarea
                  required
                  rows={4}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="I declare under penalty of perjury that I am authorized to act on behalf of the owner..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit DMCA Takedown Notice</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
