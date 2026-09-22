import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  ShieldCheck,
  Check,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AppItem, Category, PreviousVersion } from '../../types.js';
import { useAuth } from '../../context/AuthContext.js';

interface AppFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<AppItem>) => Promise<void>;
  initialData?: AppItem | null;
  categories: Category[];
}

const SAMPLE_ICONS = [
  { label: 'Gradient Sphere', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80' },
  { label: 'Camera / Visual', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&auto=format&fit=crop&q=80' },
  { label: 'Music & Audio', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&auto=format&fit=crop&q=80' },
  { label: 'Cyber Gaming', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80' },
  { label: 'Productivity Tech', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=160&auto=format&fit=crop&q=80' }
];

const SAMPLE_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80'
];

export function AppFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}: AppFormModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isGame, setIsGame] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const [fileSize, setFileSize] = useState('45 MB');
  const [packageName, setPackageName] = useState('com.example.app');
  const [androidRequirement, setAndroidRequirement] = useState('Android 8.0+');
  const [rating, setRating] = useState(4.5);
  const [featured, setFeatured] = useState(false);
  const [icon, setIcon] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80');
  const [downloadUrl, setDownloadUrl] = useState('https://example.com/download/app.apk');
  const [description, setDescription] = useState('');
  const [whatsNew, setWhatsNew] = useState('');
  const [features, setFeatures] = useState<string[]>(['Clean intuitive interface', 'Fast performance']);
  const [newFeature, setNewFeature] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80'
  ]);
  const [newScreenshot, setNewScreenshot] = useState('');
  const [previousVersions, setPreviousVersions] = useState<PreviousVersion[]>([]);
  const [newPrevVer, setNewPrevVer] = useState({ version: '', releaseDate: '', fileSize: '', downloadUrl: '' });

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [isDraggingScreenshots, setIsDraggingScreenshots] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const screenshotsFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDeveloper(initialData.developer || '');
      setCategoryId(initialData.categoryId || (categories[0]?.id || ''));
      setIsGame(initialData.isGame || false);
      setVersion(initialData.version || '');
      setFileSize(initialData.fileSize || '');
      setPackageName(initialData.packageName || '');
      setAndroidRequirement(initialData.androidRequirement || 'Android 8.0+');
      setRating(initialData.rating || 4.5);
      setFeatured(initialData.featured || false);
      setIcon(initialData.icon || '');
      setDownloadUrl(initialData.downloadUrl || '');
      setDescription(initialData.description || '');
      setWhatsNew(initialData.whatsNew || '');
      setFeatures(initialData.features || []);
      setScreenshots(initialData.screenshots || []);
      setPreviousVersions(initialData.previousVersions || []);
    } else {
      setName('');
      setDeveloper('');
      setCategoryId(categories[0]?.id || '');
      setIsGame(false);
      setVersion('1.0.0');
      setFileSize('45 MB');
      setPackageName('com.example.app');
      setAndroidRequirement('Android 8.0+');
      setRating(4.5);
      setFeatured(false);
      setIcon('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80');
      setDownloadUrl('https://example.com/download/app.apk');
      setDescription('Detailed application description and capabilities...');
      setWhatsNew('Initial stable release.');
      setFeatures(['Clean intuitive interface', 'No intrusive ads', 'Optimized for high efficiency']);
      setScreenshots([
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80'
      ]);
      setPreviousVersions([]);
    }
    setError('');
    setUploadSuccessMessage('');
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const processFileToUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              dataUrl: base64Data,
              image: base64Data,
              filename: file.name
            })
          });

          if (res.ok) {
            const data = await res.json();
            resolve(data.url || base64Data);
          } else {
            // Direct base64 fallback ensures photo addition never fails
            console.warn('Server upload response non-OK, using direct dataUrl fallback');
            resolve(base64Data);
          }
        } catch (err) {
          console.warn('Network upload request error, using direct dataUrl fallback', err);
          resolve(base64Data);
        }
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'icon' | 'screenshot'
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setError('');
    setUploadSuccessMessage('');
    try {
      if (target === 'icon') {
        const url = await processFileToUpload(fileList[0]);
        if (url) {
          setIcon(url);
          setUploadSuccessMessage('App icon successfully loaded!');
        }
      } else {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < fileList.length; i++) {
          const url = await processFileToUpload(fileList[i]);
          if (url) uploadedUrls.push(url);
        }
        if (uploadedUrls.length > 0) {
          setScreenshots((prev) => [...prev, ...uploadedUrls]);
          setUploadSuccessMessage(`${uploadedUrls.length} screenshot(s) loaded!`);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process image file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
      setTimeout(() => setUploadSuccessMessage(''), 3000);
    }
  };

  const handleDropFiles = async (
    e: React.DragEvent,
    target: 'icon' | 'screenshot'
  ) => {
    e.preventDefault();
    if (target === 'icon') setIsDraggingIcon(false);
    else setIsDraggingScreenshots(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError('');
    setUploadSuccessMessage('');
    try {
      if (target === 'icon') {
        const file = Array.from(files).find((f) => f.type.startsWith('image/')) || files[0];
        const url = await processFileToUpload(file);
        if (url) {
          setIcon(url);
          setUploadSuccessMessage('App icon successfully loaded!');
        }
      } else {
        const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        const filesToProcess = imageFiles.length > 0 ? imageFiles : Array.from(files);
        const uploadedUrls: string[] = [];
        for (const file of filesToProcess) {
          const url = await processFileToUpload(file);
          if (url) uploadedUrls.push(url);
        }
        if (uploadedUrls.length > 0) {
          setScreenshots((prev) => [...prev, ...uploadedUrls]);
          setUploadSuccessMessage(`${uploadedUrls.length} screenshot(s) loaded!`);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not process dropped image file.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadSuccessMessage(''), 3000);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddScreenshot = () => {
    if (newScreenshot.trim()) {
      setScreenshots([...screenshots, newScreenshot.trim()]);
      setNewScreenshot('');
    }
  };

  const handleRemoveScreenshot = (idx: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx));
  };

  const handleAddPreviousVersion = () => {
    if (newPrevVer.version && newPrevVer.downloadUrl) {
      setPreviousVersions([
        ...previousVersions,
        {
          version: newPrevVer.version.trim(),
          releaseDate: newPrevVer.releaseDate.trim() || new Date().toISOString().split('T')[0],
          fileSize: newPrevVer.fileSize.trim() || fileSize,
          downloadUrl: newPrevVer.downloadUrl.trim()
        }
      ]);
      setNewPrevVer({ version: '', releaseDate: '', fileSize: '', downloadUrl: '' });
    }
  };

  const handleRemovePreviousVersion = (idx: number) => {
    setPreviousVersions(previousVersions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Safety check on external download URL
    if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
      setError('Download URL must begin with https:// or http://');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      await onSave({
        name: name.trim(),
        developer: developer.trim(),
        categoryId,
        categoryName: selectedCat?.name || '',
        isGame,
        version: version.trim(),
        fileSize: fileSize.trim(),
        packageName: packageName.trim(),
        androidRequirement: androidRequirement.trim(),
        rating: Number(rating),
        featured,
        icon: icon.trim(),
        downloadUrl: downloadUrl.trim(),
        description: description.trim(),
        whatsNew: whatsNew.trim(),
        features,
        screenshots,
        previousVersions
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save application');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? `Edit Listing: ${initialData.name}` : 'Add New Application Listing'}
            </h2>
            <p className="text-xs text-slate-400">
              Provide application specifications and verified external download link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              General Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Application Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VLC for Android"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Developer / Organization *</label>
                <input
                  type="text"
                  required
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  placeholder="e.g. Videolabs Mobile"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const selected = categories.find((c) => c.id === e.target.value);
                    if (selected) setIsGame(selected.isGame);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isGame ? '(Game)' : '(App)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. org.videolan.vlc"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Version String *</label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 3.5.4"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">File Size *</label>
                <input
                  type="text"
                  required
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="e.g. 34.2 MB"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Requires Android *</label>
                <input
                  type="text"
                  required
                  value={androidRequirement}
                  onChange={(e) => setAndroidRequirement(e.target.value)}
                  placeholder="e.g. Android 6.0 and up"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Initial Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value) || 4.5)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isGame}
                    onChange={(e) => setIsGame(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Is Game</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/40"
                  />
                  <span>Featured Listing</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Download Link (CRITICAL) */}
          <div className="space-y-3 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">External Download Redirect URL *</h3>
            </div>
            <p className="text-slate-400 text-[11px]">
              This is the external URL the user's browser will be redirected to when they click DOWNLOAD. HushAPK does not upload or host APK binaries.
            </p>
            <input
              type="url"
              required
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://example.com/downloads/app-v1.0.apk"
              className="w-full p-2.5 rounded-xl bg-slate-850 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Section 3: App Icon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Application Icon *</span>
              </h3>
              <span className="text-[11px] text-slate-400">PNG, JPG, WEBP, or SVG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              {/* Icon Preview */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center">
                <img
                  src={icon || 'https://via.placeholder.com/120?text=App+Icon'}
                  alt="Icon preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Invalid+Image';
                  }}
                  className="w-20 h-20 rounded-2xl object-cover bg-slate-800 border-2 border-emerald-500/30 shadow-md"
                />
                <span className="text-[10px] text-slate-400 font-medium">Live Icon Preview</span>
              </div>

              {/* Upload Controls & URL */}
              <div className="sm:col-span-3 space-y-3">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingIcon(true);
                  }}
                  onDragLeave={() => setIsDraggingIcon(false)}
                  onDrop={(e) => handleDropFiles(e, 'icon')}
                  onClick={() => iconFileInputRef.current?.click()}
                  className={`p-3.5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isDraggingIcon
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/30 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <Upload className="w-5 h-5 text-emerald-400 mb-1" />
                  <p className="text-xs font-semibold">
                    {isDraggingIcon ? 'Drop icon file now' : 'Click to select or drag & drop icon image here'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports instant local file upload</p>
                  <input
                    ref={iconFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'icon')}
                    className="hidden"
                  />
                </div>

                {/* Direct URL input */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Or paste direct Image Web URL:</label>
                  <input
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Sample Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Quick presets:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_ICONS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIcon(sample.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Description & What's New */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              Description & Release Notes
            </h3>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive overview of application functionality and specifications..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">What's New in this Version</label>
              <textarea
                rows={2}
                value={whatsNew}
                onChange={(e) => setWhatsNew(e.target.value)}
                placeholder="e.g. Added background player, fixed crash on Android 14, UI optimizations."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Section 5: Features Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              Key Features
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature highlight..."
                className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold"
              >
                Add Feature
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 6: Screenshots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Application Screenshots ({screenshots.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Add 1 to 5 visual previews</span>
            </div>

            {/* Drag & Drop Multi-file Upload Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingScreenshots(true);
              }}
              onDragLeave={() => setIsDraggingScreenshots(false)}
              onDrop={(e) => handleDropFiles(e, 'screenshot')}
              onClick={() => screenshotsFileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDraggingScreenshots
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/30 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Upload className="w-5 h-5 text-emerald-400 mb-1" />
              <p className="text-xs font-semibold">
                {isDraggingScreenshots
                  ? 'Drop screenshot file(s) now'
                  : 'Click to select or drag & drop multiple screenshots here'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Select one or multiple images at once (PNG, JPG, WEBP)
              </p>
              <input
                ref={screenshotsFileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'screenshot')}
                className="hidden"
              />
            </div>

            {/* Manual URL input & Sample button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newScreenshot}
                onChange={(e) => setNewScreenshot(e.target.value)}
                placeholder="Or paste screenshot image URL..."
                className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddScreenshot();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold shrink-0"
                >
                  Add URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextSample = SAMPLE_SCREENSHOTS[screenshots.length % SAMPLE_SCREENSHOTS.length];
                    setScreenshots([...screenshots, nextSample]);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sample</span>
                </button>
              </div>
            </div>

            {/* Screenshots Gallery Preview */}
            {screenshots.length === 0 ? (
              <p className="text-slate-400 text-xs italic py-2">
                No screenshots added yet. Upload local images or add URLs above.
              </p>
            ) : (
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin">
                {screenshots.map((s, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <img
                      src={s}
                      alt={`Preview ${idx + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x200?text=Broken+Image';
                      }}
                      className="h-28 w-20 object-cover rounded-xl border border-slate-700 bg-slate-800 shadow"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(idx)}
                      className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1 shadow-md transition-colors"
                      title="Remove screenshot"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Previous Versions */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              Previous Versions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Version (e.g. 1.2.0)"
                value={newPrevVer.version}
                onChange={(e) => setNewPrevVer({ ...newPrevVer, version: e.target.value })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Release Date (YYYY-MM-DD)"
                value={newPrevVer.releaseDate}
                onChange={(e) => setNewPrevVer({ ...newPrevVer, releaseDate: e.target.value })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Size (e.g. 42 MB)"
                value={newPrevVer.fileSize}
                onChange={(e) => setNewPrevVer({ ...newPrevVer, fileSize: e.target.value })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                type="url"
                placeholder="External Download URL"
                value={newPrevVer.downloadUrl}
                onChange={(e) => setNewPrevVer({ ...newPrevVer, downloadUrl: e.target.value })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleAddPreviousVersion}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold"
            >
              + Add Previous Version
            </button>

            {previousVersions.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {previousVersions.map((pv, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300"
                  >
                    <span>v{pv.version} ({pv.releaseDate}, {pv.fileSize})</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-emerald-400 truncate max-w-xs">{pv.downloadUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreviousVersion(i)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-700/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{initialData ? 'Update Listing' : 'Publish Listing'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
