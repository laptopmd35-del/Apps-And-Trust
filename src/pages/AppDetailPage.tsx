import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Star,
  HardDrive,
  Calendar,
  Smartphone,
  Package,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  History,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Share2,
  Loader2,
  Send,
  Flag,
  RefreshCw
} from 'lucide-react';
import { AppItem, Review } from '../types.js';
import { AppCard } from '../components/common/AppCard.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { openExternalDownloadUrl } from '../utils/urlSecurity.js';
import { handleImageError, DEFAULT_SCREENSHOT } from '../utils/imageFallback.js';

export function AppDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [app, setApp] = useState<AppItem | null>(null);
  const [related, setRelated] = useState<AppItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbUnavailable, setIsDbUnavailable] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'broken_link' | 'wrong_information' | 'copyright_concern' | 'security_concern' | 'other'>('broken_link');
  const [reportDetails, setReportDetails] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Active enlarged screenshot modal
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  useEffect(() => {
    async function loadAppDetails() {
      setIsLoading(true);
      setIsDbUnavailable(false);
      try {
        const res = await fetch(`/api/apps/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setApp(data.app);
          setRelated(data.related || []);
          setReviews(data.reviews || []);

          // Update page title
          document.title = `${data.app.name} v${data.app.version} Download - HushAPK`;
        } else if (res.status === 404) {
          setApp(null);
          setIsDbUnavailable(false);
        } else {
          setApp(null);
          setIsDbUnavailable(true);
        }
      } catch (err) {
        console.error('Failed to load app:', err);
        setApp(null);
        setIsDbUnavailable(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadAppDetails();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const handleDownload = async (customUrl?: string) => {
    if (!app) return;
    setIsRedirecting(true);

    try {
      const res = await fetch(`/api/apps/${app.id}/click`, { method: 'POST' });
      const data = await res.json();
      const targetUrl = customUrl || data.downloadUrl || app.downloadUrl;

      // Navigate to external download link safely
      openExternalDownloadUrl(targetUrl);
    } catch (err) {
      openExternalDownloadUrl(customUrl || app.downloadUrl);
    } finally {
      setTimeout(() => {
        setIsRedirecting(false);
      }, 1500);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !reviewName.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        })
      });

      if (res.ok) {
        const newRev = await res.json();
        setReviews([newRev, ...reviews]);
        setReviewSuccess(true);
        setReviewComment('');
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !reportDetails.trim()) return;

    setReportSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appName: app.name,
          reason: reportReason,
          details: reportDetails.trim(),
          contactEmail: reportEmail.trim() || undefined
        })
      });

      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportSuccess(false);
          setReportModalOpen(false);
          setReportDetails('');
        }, 2000);
      }
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setReportSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading application details...</p>
      </div>
    );
  }

  if (!app) {
    if (isDbUnavailable) {
      return (
        <div className="text-center py-20 px-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Database Unavailable</h2>
          <p className="text-slate-400 mt-2 mb-6 text-sm">
            App details are temporarily unavailable. Please try again later.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Apps</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Application Not Found</h2>
        <p className="text-slate-400 mt-2 mb-6">
          The requested application could not be found or may have been unlisted.
        </p>
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Apps</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(app.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Schema.org JSON-LD Structured Data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    operatingSystem: 'Android',
    applicationCategory: app.categoryName || (app.isGame ? 'Game' : 'Utility'),
    softwareVersion: app.version,
    fileSize: app.fileSize,
    author: {
      '@type': 'Organization',
      name: app.developer
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: app.rating,
      ratingCount: app.ratingCount || 10
    }
  };

  return (
    <div className="space-y-8">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Breadcrumbs
        items={[
          { label: app.isGame ? 'Games' : 'Apps', href: app.isGame ? '/games' : '/apps' },
          { label: app.categoryName || 'Category', href: `/category/${app.categoryId.replace('cat-', '')}` },
          { label: app.name }
        ]}
      />

      {/* Main App Header Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* Large App Icon */}
            <img
              src={app.icon}
              alt={app.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-800 border-2 border-slate-700/60 shadow-lg shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {app.categoryName || 'General'}
                </span>
                {app.featured && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {app.name}
              </h1>
              <p className="text-sm text-slate-300 font-medium">By {app.developer}</p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                <div className="flex items-center text-amber-400 font-bold gap-1">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span className="text-sm">{app.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({app.ratingCount || 1} reviews)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-400 font-medium">
                  {app.downloadCount.toLocaleString()} downloads
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: DOWNLOAD & Share / Report */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleDownload()}
              disabled={isRedirecting}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-emerald-700/25 flex items-center justify-center gap-2.5 disabled:opacity-75"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Redirecting to Publisher...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>DOWNLOAD ({app.fileSize})</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/70 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="sm:hidden">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/70 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
              title="Report an issue with this link"
            >
              <Flag className="w-4 h-4" />
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>

        {/* Technical Specifications Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400">Current Version</span>
            <p className="font-bold text-slate-100 text-sm">v{app.version}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Package Identifier</span>
            <p className="font-mono text-slate-100 text-xs truncate" title={app.packageName}>
              {app.packageName}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Android Requirement</span>
            <p className="font-bold text-slate-100 text-sm">{app.androidRequirement}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Last Verified & Updated</span>
            <p className="font-bold text-slate-100 text-sm">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Safety Notice & External Redirection Explanation */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-3 text-emerald-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-200">Safe Download Protocol:</strong> HushAPK does not host APK installation files. Clicking <strong>DOWNLOAD</strong> redirects your browser directly to the verified publisher mirror at{' '}
          <span className="font-mono text-emerald-400 underline">{app.downloadUrl}</span>.
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Screenshots, Description, Features, What's New */}
        <div className="lg:col-span-2 space-y-8">
          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Application Screenshots</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({app.screenshots.length} previews)
                </span>
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
                {app.screenshots.map((s, idx) => (
                  <img
                    key={idx}
                    src={s}
                    alt={`${app.name} preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_SCREENSHOT)}
                    onClick={() => setActiveScreenshot(s)}
                    className="h-64 sm:h-72 w-auto rounded-2xl object-cover border border-slate-800 shadow-md cursor-pointer hover:scale-[1.02] transition-transform shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">About {app.name}</h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
              {app.description}
            </div>
          </div>

          {/* Features */}
          {app.features && app.features.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's New */}
          {app.whatsNew && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>What's New in v{app.version}</span>
              </h2>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                {app.whatsNew}
              </div>
            </div>
          )}

          {/* Previous Versions Table */}
          {app.previousVersions && app.previousVersions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Previous Versions</span>
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Version</th>
                      <th className="py-3 px-4">Release Date</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {app.previousVersions.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">v{v.version}</td>
                        <td className="py-3 px-4 text-slate-400">{v.releaseDate}</td>
                        <td className="py-3 px-4 text-slate-300">{v.fileSize}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDownload(v.downloadUrl)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-medium transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Reviews & Comments */}
          <div className="space-y-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>User Reviews ({reviews.length})</span>
              </h2>
            </div>

            {/* Submit Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
            >
              <h3 className="font-bold text-sm text-slate-200">Leave a Review</h3>
              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  Thank you! Your review has been submitted successfully.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Alex M."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rating</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Your Feedback / Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience using this app..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {reviewSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Submit Review</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this application!</p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{rev.userName}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Information Sidebar & Related Apps */}
        <div className="space-y-6">
          {/* Quick Specifications Box */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white">App Information</h3>
            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Developer</span>
                <span className="text-slate-200 font-semibold">{app.developer}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Category</span>
                <span className="text-emerald-400 font-medium">{app.categoryName || 'General'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Latest Version</span>
                <span className="text-slate-200 font-mono">v{app.version}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Download Size</span>
                <span className="text-slate-200">{app.fileSize}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Requires Android</span>
                <span className="text-slate-200">{app.androidRequirement}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Package Name</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[150px]">{app.packageName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Directory Status</span>
                <span className="text-emerald-400 font-bold">Verified Direct URL</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload()}
              disabled={isRedirecting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20"
            >
              <Download className="w-4 h-4" />
              <span>Get Application</span>
            </button>
          </div>

          {/* Related Apps in Same Category */}
          {related.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white">Related Applications</h3>
              <div className="space-y-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/app/${rel.slug}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors group"
                  >
                    <img
                      src={rel.icon}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 truncate">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{rel.developer}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="flex items-center text-amber-400 font-semibold gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {rel.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{rel.fileSize}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Screenshot Modal */}
      {activeScreenshot && (
        <div
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <img
            src={activeScreenshot}
            alt="Enlarged screenshot"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain border border-slate-700 shadow-2xl"
          />
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>Report Issue: {app.name}</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                Your report has been logged for review by the HushAPK administration team. Thank you!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="broken_link">Broken / Invalid External Link</option>
                    <option value="wrong_information">Wrong App Specifications / Information</option>
                    <option value="copyright_concern">Copyright / Trademark Concern</option>
                    <option value="security_concern">Security / Safety Warning</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Details & Description</label>
                  <textarea
                    required
                    rows={4}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe the problem or provide reference details..."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors disabled:opacity-50"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
