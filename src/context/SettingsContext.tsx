import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types.js';

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

const defaultSettings: SiteSettings = {
  siteName: 'HushAPK',
  tagline: 'Safe Apps. Simple Downloads.',
  description: 'HushAPK is a curated software directory providing verified application metadata and safe publisher download links. We never host or alter installation files.',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'contact@hushapk.org',
  socialLinks: {
    twitter: 'https://twitter.com/hushapk',
    telegram: 'https://t.me/hushapk',
    github: 'https://github.com/hushapk',
  },
  footerText: '© 2026 HushAPK Directory. All trademarks, service marks and company names are properties of their respective owners. HushAPK does not host APK packages.',
  defaultSeoTitle: 'HushAPK - Safe Apps. Simple Downloads.',
  defaultSeoDescription: 'Browse useful apps and games from HushAPK. Find verified app specifications and follow direct publisher download links safely.',
  googleAnalyticsId: '',
  themePreference: 'dark',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const token = localStorage.getItem('hushapk_admin_token');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
