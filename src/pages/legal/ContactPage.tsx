import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.js';
import { useSettings } from '../../context/SettingsContext.js';

export function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Contact Administration</h1>
        <p className="text-sm text-slate-400 mt-2">
          Have an inquiry, partnership proposal, or suggestion for a new app listing? Reach out to the HushAPK editorial team.
        </p>
      </div>

      <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-lg text-white">Message Dispatched</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Thank you for contacting HushAPK. Our administration team typically reviews correspondence within 24 to 48 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Listing Request: New Open Source Tool"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed information regarding your inquiry..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Direct Contact Email:</span>
          <a
            href={`mailto:${settings.contactEmail || 'contact@hushapk.org'}`}
            className="text-emerald-400 hover:underline font-mono"
          >
            {settings.contactEmail || 'contact@hushapk.org'}
          </a>
        </div>
      </div>
    </div>
  );
}
