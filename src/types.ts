export interface AppItem {
  id: string;
  name: string;
  slug: string;
  developer: string;
  categoryId: string;
  categoryName?: string;
  isGame: boolean;
  icon: string;
  description: string;
  features: string[];
  screenshots: string[];
  version: string;
  fileSize: string;
  androidRequirement: string;
  packageName: string;
  downloadUrl: string;
  rating: number;
  ratingCount: number;
  downloadCount: number;
  published: boolean;
  featured: boolean;
  whatsNew: string;
  previousVersions: AppVersionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AppVersionItem {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  fileSize: string;
}

export type PreviousVersion = AppVersionItem;

export interface AnalyticsSummary {
  totalApps: number;
  totalGames: number;
  totalCategories: number;
  totalDownloads: number;
  totalReviews: number;
  pendingReports: number;
  topApps: AppItem[];
  recentClicks: DownloadClick[];
  clicksByDay: { date: string; count: number }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isGame: boolean;
  appCount?: number;
}

export interface Review {
  id: string;
  appId: string;
  appName: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export interface Report {
  id: string;
  appId: string;
  appName: string;
  reason: 'broken_link' | 'wrong_information' | 'copyright_concern' | 'security_concern' | 'other';
  details: string;
  contactEmail?: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface DownloadClick {
  id: string;
  appId: string;
  appName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  timestamp: number;
  ipHash: string;
  userAgent: string;
  categoryId?: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    github?: string;
    discord?: string;
  };
  footerText: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  googleAnalyticsId: string;
  themePreference: 'dark' | 'light' | 'system';
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}
