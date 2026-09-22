import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AppItem, Category, Review, Report, DownloadClick, AdminActivity, SiteSettings, AdminUser } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  apps: AppItem[];
  categories: Category[];
  reviews: Review[];
  reports: Report[];
  clicks: DownloadClick[];
  activities: AdminActivity[];
  settings: SiteSettings;
  users: (AdminUser & { passwordHash: string })[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-tools', name: 'Tools', slug: 'tools', description: 'Essential utilities, file managers, and system enhancements.', iconName: 'Wrench', isGame: false },
  { id: 'cat-productivity', name: 'Productivity', slug: 'productivity', description: 'Office suites, notes, task managers, and workflow boosters.', iconName: 'Briefcase', isGame: false },
  { id: 'cat-social', name: 'Social', slug: 'social', description: 'Connect with friends, social networks, and community spaces.', iconName: 'Users', isGame: false },
  { id: 'cat-communication', name: 'Communication', slug: 'communication', description: 'Instant messaging, video conferencing, and VoIP calling.', iconName: 'MessageSquare', isGame: false },
  { id: 'cat-media', name: 'Video & Audio', slug: 'video-audio', description: 'High-definition media players, podcast players, and streaming.', iconName: 'PlayCircle', isGame: false },
  { id: 'cat-photography', name: 'Photography', slug: 'photography', description: 'Photo editing, camera tools, and visual creative suites.', iconName: 'Camera', isGame: false },
  { id: 'cat-education', name: 'Education', slug: 'education', description: 'Language learning, science tools, and interactive tutorials.', iconName: 'GraduationCap', isGame: false },
  { id: 'cat-finance', name: 'Finance', slug: 'finance', description: 'Budget trackers, currency converters, and investment trackers.', iconName: 'DollarSign', isGame: false },
  { id: 'cat-utilities', name: 'Utilities', slug: 'utilities', description: 'Handy mobile calculators, sensors, battery tools, and benchmarks.', iconName: 'Sliders', isGame: false },
  // Games
  { id: 'cat-action', name: 'Action Games', slug: 'action-games', description: 'Fast-paced combat, platformers, and shooting games.', iconName: 'Zap', isGame: true },
  { id: 'cat-adventure', name: 'Adventure Games', slug: 'adventure-games', description: 'Immersive stories, exploration, and questing journeys.', iconName: 'Compass', isGame: true },
  { id: 'cat-arcade', name: 'Arcade Games', slug: 'arcade-games', description: 'Retro classics, endless runners, and high-score chasers.', iconName: 'Gamepad2', isGame: true },
  { id: 'cat-puzzle', name: 'Puzzle Games', slug: 'puzzle-games', description: 'Brain teasers, logic challenges, and mind benders.', iconName: 'Puzzle', isGame: true },
  { id: 'cat-racing', name: 'Racing Games', slug: 'racing-games', description: 'High-speed motorsport, drifting, and street racing.', iconName: 'Gauge', isGame: true },
  { id: 'cat-simulation', name: 'Simulation', slug: 'simulation', description: 'City builders, life simulations, and vehicle operators.', iconName: 'Cpu', isGame: true },
  { id: 'cat-strategy', name: 'Strategy Games', slug: 'strategy-games', description: 'Tactical conquest, tower defense, and resource warfare.', iconName: 'Shield', isGame: true },
  { id: 'cat-casual', name: 'Casual Games', slug: 'casual-games', description: 'Relaxing gameplay, match-3, and quick pick-up fun.', iconName: 'Smile', isGame: true },
];

const DEFAULT_SETTINGS: SiteSettings = {
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

const DEFAULT_APPS: AppItem[] = [
  {
    id: 'app-vlc',
    name: 'VLC Media Player',
    slug: 'vlc-media-player',
    developer: 'VideoLAN Organization',
    categoryId: 'cat-media',
    categoryName: 'Video & Audio',
    isGame: false,
    icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&auto=format&fit=crop&q=80',
    description: 'VLC media player is a free and open source cross-platform multimedia player that plays most multimedia files as well as discs, devices, and network streaming protocols.\n\nThis Android port plays most video and audio files, as well as network streams, network shares and drives, and DVD ISOs. VLC for Android has a full music player, a media database, equalizer and filters, and a multitude of other features.',
    features: [
      'Plays all formats: MKV, MP4, AVI, MOV, Ogg, FLAC, TS, M2TS, Wv and AAC',
      'Hardware decoding support for smooth 4K/8K playback',
      'Multi-track audio and subtitles support with auto-download',
      'Zero spyware, zero ads and no user tracking',
      'Advanced equalizer with audio presets'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    ],
    version: '3.5.4',
    fileSize: '36.8 MB',
    androidRequirement: 'Android 5.0 and up',
    packageName: 'org.videolan.vlc',
    downloadUrl: 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-arm64-v8a.apk',
    rating: 4.8,
    ratingCount: 14200,
    downloadCount: 452100,
    published: true,
    featured: true,
    whatsNew: 'Added playback speed memory per file. Improved Chromecast discovery and fixed SMB2/3 streaming stutter on Android 14+.',
    previousVersions: [
      { version: '3.5.3', releaseDate: '2026-04-12', downloadUrl: 'https://get.videolan.org/vlc-android/3.5.3/VLC-Android-3.5.3-arm64-v8a.apk', fileSize: '36.2 MB' },
      { version: '3.5.2', releaseDate: '2026-01-20', downloadUrl: 'https://get.videolan.org/vlc-android/3.5.2/VLC-Android-3.5.2-arm64-v8a.apk', fileSize: '35.9 MB' }
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'app-telegram',
    name: 'Telegram Messenger',
    slug: 'telegram-messenger',
    developer: 'Telegram FZ-LLC',
    categoryId: 'cat-communication',
    categoryName: 'Communication',
    isGame: false,
    icon: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=160&auto=format&fit=crop&q=80',
    description: 'Pure instant messaging — simple, fast, secure, and synced across all your devices. Over 900 million active users worldwide.\n\nTelegram delivers messages faster than any other application. Cloud-based architecture gives you seamless access to chats from multiple phones, tablets and computers at once.',
    features: [
      'Unlimited media & document sharing up to 2 GB per file',
      'End-to-end encrypted Secret Chats with self-destruct timers',
      'Public & private channels supporting millions of subscribers',
      'Powerful bot platform for automation and mini-apps',
      'Custom animated sticker maker and video stories'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80'
    ],
    version: '10.14.5',
    fileSize: '68.4 MB',
    androidRequirement: 'Android 6.0 and up',
    packageName: 'org.telegram.messenger.web',
    downloadUrl: 'https://telegram.org/dl/android/apk',
    rating: 4.7,
    ratingCount: 38900,
    downloadCount: 890400,
    published: true,
    featured: true,
    whatsNew: 'Direct APK version with fewer restrictions and automatic in-app updates. Enhanced mini-app performance and group boosts.',
    previousVersions: [
      { version: '10.14.0', releaseDate: '2026-05-18', downloadUrl: 'https://telegram.org/dl/android/apk', fileSize: '67.8 MB' }
    ],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-09-02T11:20:00Z',
  },
  {
    id: 'app-obsidian',
    name: 'Obsidian Notes & Knowledge Base',
    slug: 'obsidian-notes',
    developer: 'Dynalist Inc.',
    categoryId: 'cat-productivity',
    categoryName: 'Productivity',
    isGame: false,
    icon: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=160&auto=format&fit=crop&q=80',
    description: 'Obsidian is a powerful knowledge base on top of a local folder of plain text Markdown files. It acts as a second brain, for you, forever.\n\nIn Obsidian, your notes live on your device, not in the cloud. You own your data. Connect thoughts using bi-directional links, graph views, and hundreds of community plugins.',
    features: [
      '100% local plain text files (Markdown formatted)',
      'Interactive Graph View showing note connections',
      'Extensive plugin ecosystem with themes and automations',
      'Canvas tool for visual mind mapping and brainstorming',
      'End-to-end encrypted Obsidian Sync support'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
    ],
    version: '1.6.7',
    fileSize: '18.2 MB',
    androidRequirement: 'Android 7.0 and up',
    packageName: 'md.obsidian',
    downloadUrl: 'https://github.com/obsidianmd/obsidian-releases/releases/download/v1.6.7/Obsidian-1.6.7.apk',
    rating: 4.9,
    ratingCount: 8200,
    downloadCount: 164000,
    published: true,
    featured: true,
    whatsNew: 'Faster mobile startup indexing, table formula improvements, and stability fixes for Android 15 edge-to-edge.',
    previousVersions: [
      { version: '1.6.5', releaseDate: '2026-03-10', downloadUrl: 'https://github.com/obsidianmd/obsidian-releases/releases', fileSize: '17.9 MB' }
    ],
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
  },
  {
    id: 'app-retroarch',
    name: 'RetroArch Emulation Suite',
    slug: 'retroarch-suite',
    developer: 'Libretro Project',
    categoryId: 'cat-arcade',
    categoryName: 'Arcade Games',
    isGame: true,
    icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    description: 'RetroArch is an open-source multi-engine emulator frontend that enables you to run classic games on a wide range of devices. Through its modular architecture (Cores), play systems from the golden era of arcade, 8-bit, 16-bit, and 3D consoles.\n\nEquipped with next-frame response time (Run-Ahead), cross-platform netplay, shader filters, and real-time rewind.',
    features: [
      'Universal modular core engine supporting 80+ classic gaming systems',
      'Run-Ahead latency reduction for responsive inputs',
      'Advanced CRT and LCD shader pipelines',
      'Real-time gameplay rewind and automatic state saving',
      'Full external gamepad support with automatic controller profiling'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    ],
    version: '1.19.1',
    fileSize: '54.5 MB',
    androidRequirement: 'Android 8.0 and up',
    packageName: 'com.retroarch.aarch64',
    downloadUrl: 'https://buildbot.libretro.com/stable/1.19.1/android/RetroArch_aarch64.apk',
    rating: 4.6,
    ratingCount: 19500,
    downloadCount: 312000,
    published: true,
    featured: true,
    whatsNew: 'Updated Vulkan swapchain handlers. Added fast-forward sound pitch shifting and updated core downloader mirrors.',
    previousVersions: [
      { version: '1.18.0', releaseDate: '2026-02-14', downloadUrl: 'https://buildbot.libretro.com/stable/1.18.0/android/RetroArch_aarch64.apk', fileSize: '53.9 MB' }
    ],
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'app-asphalt',
    name: 'Asphalt Legends Racer',
    slug: 'asphalt-legends-racer',
    developer: 'Gameloft SE',
    categoryId: 'cat-racing',
    categoryName: 'Racing Games',
    isGame: true,
    icon: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=160&auto=format&fit=crop&q=80',
    description: 'Take the wheel of hypercars from renowned manufacturers like Ferrari, Porsche, Lamborghini and W Motors. Drift through awe-inspiring real-world tracks across Shanghai, San Francisco, the Himalayas, and Cairo.\n\nMaster the revolutionary TouchDrive steering or unleash pure manual controls to outmaneuver rivals in 8-player live multiplayer events.',
    features: [
      'Over 200 officially licensed luxury hypercars to customize and race',
      'Spectacular HDR visuals, dynamic weather, and particle physics',
      'Intuitive TouchDrive controls or full manual gyroscope steering',
      'Dynamic nitro shockwave boosts and 360-degree aerial spins',
      'Online Club championships and cooperative team syndicates'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    version: '4.7.1a',
    fileSize: '2.8 GB',
    androidRequirement: 'Android 9.0 and up',
    packageName: 'com.gameloft.android.ANMP.GloftA9HM',
    downloadUrl: 'https://example.com/download/asphalt-legends-installer.apk',
    rating: 4.5,
    ratingCount: 42000,
    downloadCount: 780000,
    published: true,
    featured: true,
    whatsNew: 'New Season: Cyber Syndicate featuring futuristic prototype vehicles and Tokyo neon raceways.',
    previousVersions: [],
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-09-01T18:00:00Z',
  },
  {
    id: 'app-firefox',
    name: 'Firefox Fast & Private Browser',
    slug: 'firefox-browser',
    developer: 'Mozilla',
    categoryId: 'cat-tools',
    categoryName: 'Tools',
    isGame: false,
    icon: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&auto=format&fit=crop&q=80',
    description: 'Firefox for Android is a lightning-fast, privacy-first web browser backed by the non-profit Mozilla. Block intrusive trackers, enjoy seamless extension add-on support, and sync bookmarks, logins, and open tabs across devices.\n\nExperience total internet freedom with an independent Gecko rendering engine built outside the Chromium monopoly.',
    features: [
      'Comprehensive Enhanced Tracking Protection blocking 2,000+ trackers',
      'Full desktop-grade Add-on extension support (uBlock Origin, Dark Reader)',
      'Customizable toolbar position (top or bottom of screen)',
      'Seamless multi-device sync with zero knowledge encryption',
      'Integrated reader mode for distraction-free articles'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
    ],
    version: '128.0.2',
    fileSize: '92.1 MB',
    androidRequirement: 'Android 5.0 and up',
    packageName: 'org.mozilla.firefox',
    downloadUrl: 'https://download.mozilla.org/?product=fennec-latest&os=android&lang=multi',
    rating: 4.7,
    ratingCount: 31000,
    downloadCount: 540000,
    published: true,
    featured: false,
    whatsNew: 'Security hardening, smoother page zooming animations, and improved battery efficiency when streaming background audio.',
    previousVersions: [
      { version: '128.0.0', releaseDate: '2026-07-09', downloadUrl: 'https://download.mozilla.org/?product=fennec-latest&os=android&lang=multi', fileSize: '91.8 MB' }
    ],
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'app-subway-surfers',
    name: 'Subway Surfers World Tour',
    slug: 'subway-surfers',
    developer: 'SYBO Games',
    categoryId: 'cat-arcade',
    categoryName: 'Arcade Games',
    isGame: true,
    icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&auto=format&fit=crop&q=80',
    description: 'DASH as fast as you can! DODGE the oncoming trains! Help Jake, Tricky & Fresh escape from the grumpy Inspector and his dog in the most popular endless runner of all time.\n\nGrind trains with your cool crew, jump on hoverboards, and surf colorful subways across the globe.',
    features: [
      'Grind trains with your cool high-tech crew',
      'Colorful and vivid HD graphics with fluid acrobatics',
      'Hoverboard surfing and paint-powered jetpacks',
      'Lightning-fast swipe acrobatics',
      'Monthly World Tour updates visiting new iconic cities'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    version: '3.31.0',
    fileSize: '158 MB',
    androidRequirement: 'Android 6.0 and up',
    packageName: 'com.kiloo.subwaysurf',
    downloadUrl: 'https://example.com/download/subway-surfers-v3.31.0.apk',
    rating: 4.6,
    ratingCount: 65000,
    downloadCount: 1200000,
    published: true,
    featured: true,
    whatsNew: 'Welcome to Subway Surfers World Tour: Rio! Unlock the Samba Hoverboard and new street runner costumes.',
    previousVersions: [],
    createdAt: '2026-02-12T07:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'app-duolingo',
    name: 'Duolingo: Language Lessons',
    slug: 'duolingo-language-lessons',
    developer: 'Duolingo',
    categoryId: 'cat-education',
    categoryName: 'Education',
    isGame: false,
    icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=160&auto=format&fit=crop&q=80',
    description: 'Learn Spanish, French, German, Italian, Japanese, Korean, and 30+ other languages with fun, bite-sized lessons. Practice speaking, reading, listening, and writing to build your vocabulary and grammar skills.\n\nDesigned by language specialists and backed by science, Duolingo makes education accessible and delightfully gamified.',
    features: [
      'Bite-sized game-like lessons designed for quick daily learning',
      'Speech recognition for real-time pronunciation feedback',
      'Daily streaks and XP leaderboards to keep you motivated',
      'Personalized review sessions to reinforce challenging words',
      'Completely free core curriculum for all world languages'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'
    ],
    version: '6.12.3',
    fileSize: '48.9 MB',
    androidRequirement: 'Android 8.0 and up',
    packageName: 'com.duolingo',
    downloadUrl: 'https://example.com/download/duolingo-v6.12.3.apk',
    rating: 4.8,
    ratingCount: 52000,
    downloadCount: 940000,
    published: true,
    featured: false,
    whatsNew: 'Added intermediate storytelling modules for Japanese and Spanish curricula. Enhanced audio clarity.',
    previousVersions: [],
    createdAt: '2026-03-05T09:30:00Z',
    updatedAt: '2026-08-20T15:00:00Z',
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    appId: 'app-vlc',
    appName: 'VLC Media Player',
    userName: 'Marcus Sterling',
    rating: 5,
    comment: 'The absolute gold standard for media playback on Android. Plays every strange codec I throw at it without lag.',
    status: 'approved',
    createdAt: '2026-08-12T14:22:00Z'
  },
  {
    id: 'rev-2',
    appId: 'app-telegram',
    appName: 'Telegram Messenger',
    userName: 'Elena Rostova',
    rating: 5,
    comment: 'Direct publisher APK is much faster and doesn’t get restricted. Downloading it directly through HushAPK link worked smoothly!',
    status: 'approved',
    createdAt: '2026-08-28T09:14:00Z'
  },
  {
    id: 'rev-3',
    appId: 'app-obsidian',
    appName: 'Obsidian Notes & Knowledge Base',
    userName: 'Devin K.',
    rating: 5,
    comment: 'Best markdown note taker hands down. My local vault synced perfectly.',
    status: 'approved',
    createdAt: '2026-09-01T16:04:00Z'
  }
];

// In-memory cache to guarantee zero runtime crashes on read-only serverless runtimes (like Vercel Lambdas)
let memoryCache: DatabaseSchema | null = null;

function buildInitialSeed(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const initialPassword = process.env.ADMIN_INIT_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(initialPassword, salt);

  return {
    apps: DEFAULT_APPS,
    categories: DEFAULT_CATEGORIES,
    reviews: DEFAULT_REVIEWS,
    reports: [],
    clicks: [
      {
        id: 'click-seed-1',
        appId: 'app-vlc',
        appName: 'VLC Media Player',
        date: new Date().toISOString().split('T')[0],
        time: '12:00:00',
        timestamp: Date.now() - 3600000 * 2,
        ipHash: 'seed-ip-hash-1',
        userAgent: 'Mozilla/5.0 (Android; Mobile)',
        categoryId: 'cat-media',
      },
      {
        id: 'click-seed-2',
        appId: 'app-telegram',
        appName: 'Telegram Messenger',
        date: new Date().toISOString().split('T')[0],
        time: '13:00:00',
        timestamp: Date.now() - 3600000,
        ipHash: 'seed-ip-hash-2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        categoryId: 'cat-communication',
      }
    ],
    activities: [
      {
        id: 'act-1',
        action: 'System Initialized',
        details: 'HushAPK database seeded with initial verified applications.',
        adminEmail: 'admin@hushapk.org',
        timestamp: new Date().toISOString()
      }
    ],
    settings: DEFAULT_SETTINGS,
    users: [
      {
        id: 'usr-admin-1',
        username: 'admin',
        email: 'admin@hushapk.org',
        role: 'super_admin',
        passwordHash,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ]
  };
}

// Helper to initialize database
function ensureDatabase(): DatabaseSchema {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (mkdirErr) {
        console.warn('Cannot create data directory, operating in-memory:', mkdirErr);
      }
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryCache = parsed;
      return parsed;
    }

    // DB_FILE doesn't exist yet, seed it
    const initialData = buildInitialSeed();
    memoryCache = initialData;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('Cannot write initial DB to disk, operating in-memory:', writeErr);
    }
    return initialData;
  } catch (err) {
    console.warn('Filesystem access failed or unreadable, using in-memory dataset:', err);
    if (!memoryCache) {
      memoryCache = buildInitialSeed();
    }
    return memoryCache;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  memoryCache = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Graceful fallback for read-only lambdas / Vercel serverless environment
    console.warn('Filesystem write not permitted in this runtime environment. Updated in-memory state.');
  }
}

export const db = {
  getRaw(): DatabaseSchema {
    return ensureDatabase();
  },

  // Apps
  getApps(filter?: {
    search?: string;
    categoryId?: string;
    isGame?: boolean;
    featured?: boolean;
    sort?: 'downloads' | 'rating' | 'latest' | 'name';
    onlyPublished?: boolean;
  }): AppItem[] {
    const data = ensureDatabase();
    let apps = [...data.apps];

    if (filter?.onlyPublished !== false) {
      apps = apps.filter(a => a.published);
    }

    if (filter?.isGame !== undefined) {
      apps = apps.filter(a => a.isGame === filter.isGame);
    }

    if (filter?.categoryId) {
      apps = apps.filter(a => a.categoryId === filter.categoryId);
    }

    if (filter?.featured) {
      apps = apps.filter(a => a.featured);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      apps = apps.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q) ||
        (a.categoryName && a.categoryName.toLowerCase().includes(q)) ||
        a.description.toLowerCase().includes(q) ||
        a.packageName.toLowerCase().includes(q)
      );
    }

    if (filter?.sort) {
      if (filter.sort === 'downloads') {
        apps.sort((a, b) => b.downloadCount - a.downloadCount);
      } else if (filter.sort === 'rating') {
        apps.sort((a, b) => b.rating - a.rating);
      } else if (filter.sort === 'latest') {
        apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else if (filter.sort === 'name') {
        apps.sort((a, b) => a.name.localeCompare(b.name));
      }
    } else {
      apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return apps;
  },

  getAppBySlug(slug: string): AppItem | undefined {
    const data = ensureDatabase();
    return data.apps.find(a => a.slug === slug);
  },

  getAppById(id: string): AppItem | undefined {
    const data = ensureDatabase();
    return data.apps.find(a => a.id === id);
  },

  createApp(item: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'ratingCount'> & { id?: string }): AppItem {
    const data = ensureDatabase();
    const now = new Date().toISOString();
    const newId = item.id || `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Auto-fill categoryName if missing
    const cat = data.categories.find(c => c.id === item.categoryId);
    const categoryName = cat ? cat.name : (item.categoryName || 'General');

    const newApp: AppItem = {
      ...item,
      id: newId,
      categoryName,
      downloadCount: 0,
      ratingCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    data.apps.unshift(newApp);
    writeDatabase(data);
    return newApp;
  },

  updateApp(id: string, updates: Partial<AppItem>): AppItem | null {
    const data = ensureDatabase();
    const idx = data.apps.findIndex(a => a.id === id);
    if (idx === -1) return null;

    if (updates.categoryId && updates.categoryId !== data.apps[idx].categoryId) {
      const cat = data.categories.find(c => c.id === updates.categoryId);
      if (cat) updates.categoryName = cat.name;
    }

    const updated: AppItem = {
      ...data.apps[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    data.apps[idx] = updated;
    writeDatabase(data);
    return updated;
  },

  deleteApp(id: string): boolean {
    const data = ensureDatabase();
    const beforeLen = data.apps.length;
    data.apps = data.apps.filter(a => a.id !== id);
    if (data.apps.length < beforeLen) {
      writeDatabase(data);
      return true;
    }
    return false;
  },

  recordClick(appId: string, ip: string, userAgent: string): { success: boolean; downloadUrl?: string } {
    const data = ensureDatabase();
    const app = data.apps.find(a => a.id === appId);
    if (!app) return { success: false };

    // Increment count
    app.downloadCount = (app.downloadCount || 0) + 1;

    // Privacy-safe IP hashing
    const ipHash = crypto.createHash('sha256').update(ip + '-hushapk-salt').digest('hex').substring(0, 16);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const click: DownloadClick = {
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      appId: app.id,
      appName: app.name,
      date: dateStr,
      time: timeStr,
      timestamp: now.getTime(),
      ipHash,
      userAgent: userAgent ? userAgent.substring(0, 150) : 'Unknown',
      categoryId: app.categoryId,
    };

    data.clicks.push(click);
    writeDatabase(data);

    return { success: true, downloadUrl: app.downloadUrl };
  },

  // Categories
  getCategories(): Category[] {
    const data = ensureDatabase();
    // compute real-time app counts
    return data.categories.map(c => ({
      ...c,
      appCount: data.apps.filter(a => a.categoryId === c.id && a.published).length
    }));
  },

  createCategory(cat: Omit<Category, 'id' | 'appCount'>): Category {
    const data = ensureDatabase();
    const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCat: Category = { ...cat, id };
    data.categories.push(newCat);
    writeDatabase(data);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const data = ensureDatabase();
    const idx = data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    data.categories[idx] = { ...data.categories[idx], ...updates };
    writeDatabase(data);
    return data.categories[idx];
  },

  deleteCategory(id: string): boolean {
    const data = ensureDatabase();
    const before = data.categories.length;
    data.categories = data.categories.filter(c => c.id !== id);
    if (data.categories.length < before) {
      writeDatabase(data);
      return true;
    }
    return false;
  },

  // Reviews
  getReviews(appId?: string, status?: 'pending' | 'approved' | 'hidden'): Review[] {
    const data = ensureDatabase();
    let revs = [...data.reviews];
    if (appId) revs = revs.filter(r => r.appId === appId);
    if (status) revs = revs.filter(r => r.status === status);
    revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return revs;
  },

  createReview(rev: Omit<Review, 'id' | 'createdAt' | 'status'> & { status?: 'pending' | 'approved' | 'hidden' }): Review {
    const data = ensureDatabase();
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: rev.status || 'pending',
      createdAt: new Date().toISOString()
    };
    data.reviews.unshift(newRev);

    // If approved, update app rating calculation
    if (newRev.status === 'approved') {
      const app = data.apps.find(a => a.id === newRev.appId);
      if (app) {
        const approvedRevs = data.reviews.filter(r => r.appId === app.id && r.status === 'approved');
        const sum = approvedRevs.reduce((acc, curr) => acc + curr.rating, 0);
        app.rating = Number((sum / approvedRevs.length).toFixed(1));
        app.ratingCount = approvedRevs.length;
      }
    }

    writeDatabase(data);
    return newRev;
  },

  updateReviewStatus(id: string, status: 'pending' | 'approved' | 'hidden'): Review | null {
    const data = ensureDatabase();
    const rev = data.reviews.find(r => r.id === id);
    if (!rev) return null;
    rev.status = status;

    // Recalculate app rating
    const app = data.apps.find(a => a.id === rev.appId);
    if (app) {
      const approvedRevs = data.reviews.filter(r => r.appId === app.id && r.status === 'approved');
      if (approvedRevs.length > 0) {
        const sum = approvedRevs.reduce((acc, curr) => acc + curr.rating, 0);
        app.rating = Number((sum / approvedRevs.length).toFixed(1));
        app.ratingCount = approvedRevs.length;
      }
    }

    writeDatabase(data);
    return rev;
  },

  deleteReview(id: string): boolean {
    const data = ensureDatabase();
    const before = data.reviews.length;
    data.reviews = data.reviews.filter(r => r.id !== id);
    if (data.reviews.length < before) {
      writeDatabase(data);
      return true;
    }
    return false;
  },

  // Reports
  getReports(): Report[] {
    const data = ensureDatabase();
    return [...data.reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createReport(rep: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
    const data = ensureDatabase();
    const newRep: Report = {
      ...rep,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    data.reports.unshift(newRep);
    writeDatabase(data);
    return newRep;
  },

  updateReportStatus(id: string, status: 'open' | 'investigating' | 'resolved' | 'dismissed'): Report | null {
    const data = ensureDatabase();
    const rep = data.reports.find(r => r.id === id);
    if (!rep) return null;
    rep.status = status;
    writeDatabase(data);
    return rep;
  },

  // Activity
  logActivity(action: string, details: string, adminEmail: string): AdminActivity {
    const data = ensureDatabase();
    const act: AdminActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      details,
      adminEmail,
      timestamp: new Date().toISOString()
    };
    data.activities.unshift(act);
    if (data.activities.length > 100) data.activities.pop(); // keep latest 100
    writeDatabase(data);
    return act;
  },

  getActivities(): AdminActivity[] {
    const data = ensureDatabase();
    return data.activities || [];
  },

  // Settings
  getSettings(): SiteSettings {
    const data = ensureDatabase();
    return data.settings || DEFAULT_SETTINGS;
  },

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const data = ensureDatabase();
    data.settings = { ...data.settings, ...updates };
    writeDatabase(data);
    return data.settings;
  },

  // Users
  getUsers(): AdminUser[] {
    const data = ensureDatabase();
    return data.users.map(({ passwordHash, ...u }) => u);
  },

  getUserByUsername(username: string): (AdminUser & { passwordHash: string }) | undefined {
    const data = ensureDatabase();
    return data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  updateUserPassword(userId: string, newPassword: string): boolean {
    const data = ensureDatabase();
    const u = data.users.find(user => user.id === userId);
    if (!u) return false;
    const salt = bcrypt.genSaltSync(10);
    u.passwordHash = bcrypt.hashSync(newPassword, salt);
    writeDatabase(data);
    return true;
  },

  createUser(user: { username: string; email: string; role: 'super_admin' | 'admin' | 'editor'; password: string }): AdminUser {
    const data = ensureDatabase();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(user.password, salt);
    const newUser: AdminUser & { passwordHash: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: user.username,
      email: user.email,
      role: user.role,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeDatabase(data);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  deleteUser(userId: string): boolean {
    const data = ensureDatabase();
    if (data.users.length <= 1) return false; // cannot delete sole admin
    const before = data.users.length;
    data.users = data.users.filter(u => u.id !== userId);
    if (data.users.length < before) {
      writeDatabase(data);
      return true;
    }
    return false;
  },

  // Analytics Real Stats
  getAnalytics() {
    const data = ensureDatabase();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    const totalApps = data.apps.length;
    const totalGames = data.apps.filter(a => a.isGame).length;
    const publishedApps = data.apps.filter(a => a.published).length;
    const draftApps = data.apps.filter(a => !a.published).length;
    const totalCategories = data.categories.length;

    const clicks = data.clicks || [];
    const totalDownloads = clicks.length;
    const clicksToday = clicks.filter(c => c.date === todayStr).length;
    const clicksThisWeek = clicks.filter(c => c.timestamp >= sevenDaysAgo).length;
    const clicksThisMonth = clicks.filter(c => c.timestamp >= thirtyDaysAgo).length;

    // Most clicked apps (from real clicks)
    const appClickMap: Record<string, { appName: string; count: number; appId: string }> = {};
    clicks.forEach(c => {
      if (!appClickMap[c.appId]) {
        appClickMap[c.appId] = { appName: c.appName, count: 0, appId: c.appId };
      }
      appClickMap[c.appId].count += 1;
    });

    const mostClickedApps = Object.values(appClickMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Clicks by category
    const catMap: Record<string, number> = {};
    clicks.forEach(c => {
      const catId = c.categoryId || 'unknown';
      catMap[catId] = (catMap[catId] || 0) + 1;
    });

    const clicksByCategory = Object.entries(catMap).map(([catId, count]) => {
      const category = data.categories.find(c => c.id === catId);
      return {
        categoryId: catId,
        categoryName: category ? category.name : 'Other',
        count
      };
    }).sort((a, b) => b.count - a.count);

    // Clicks over the last 7 days
    const last7Days: { date: string; clicks: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = d.toISOString().split('T')[0];
      const count = clicks.filter(c => c.date === dStr).length;
      last7Days.push({ date: dStr, clicks: count });
    }

    const recentClicks = clicks.slice(-20).reverse();

    return {
      totalApps,
      totalGames,
      publishedApps,
      draftApps,
      totalCategories,
      totalDownloads,
      clicksToday,
      clicksThisWeek,
      clicksThisMonth,
      mostClickedApps,
      clicksByCategory,
      clicksByDay: last7Days,
      recentClicks
    };
  }
};
