import React, { useState } from 'react';
import { Flag, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';

export function ReportPage() {
  const [appName, setAppName] = useState('');
  const [reason, setReason] = useState<'broken_link' | 'wrong_information' | 'copyright_concern' | 'security_concern' | 'other'>('broken_link');
  const [details, setDetails] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !details.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: appName.trim(),
          reason,
          details: details.trim(),
          contactEmail: contactEmail.trim() || undefined
        })
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Report Issue' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-3 border border-rose-500/20">
          <Flag className="w-4 h-4" />
          <span>Community Quality Control</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Report an Issue or Broken Link
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Help us maintain the highest link safety and directory accuracy. Submit broken links, outdated metadata, or safety concerns directly to the site administrators.
        </p>
      </div>

      <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-lg text-white">Report Logged Successfully</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Thank you for keeping HushAPK accurate and safe. Our administrative team will verify and resolve this issue promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Application Name / Link URL on HushAPK
              </label>
              <input
                type="text"
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. WhatsApp Messenger or https://hushapk.org/app/whatsapp"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              >
                <option value="broken_link">Broken External Link (404, Page Expired)</option>
                <option value="wrong_information">Wrong App Specifications / Version Mismatch</option>
                <option value="copyright_concern">Copyright or Trademark Grievance</option>
                <option value="security_concern">Malware / Security Warning</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Detailed Explanation
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what is broken or what information needs correction..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Your Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com (if you'd like follow-up confirmation)"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Issue Report'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
