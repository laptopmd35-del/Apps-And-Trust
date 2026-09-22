# HushAPK — Safe Apps. Simple Downloads.

A high-performance, responsive web application and app directory built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Express**.

> **Important Operating Principle:** HushAPK is an informational app directory. **HushAPK does NOT upload, store, or host APK files.** The "DOWNLOAD" button securely logs click analytics and redirects the user's browser directly to verified external publisher links or official developer releases. HushAPK never executes automatic installations.

---

## 🌟 Key Features

### 📱 Public Directory & Discovery
- **Hero Hub**: Real-time keyword search across names, developers, package names, and genres with trust verification badges.
- **Curated Catalog**:
  - **Applications**: Filter by category, sort by download volume, rating, release date, or name.
  - **Mobile Games**: Dedicated gaming hub with genre classification and ratings.
  - **Categories Taxonomy**: Detailed directory structure with app counts and category descriptions.
  - **Trending & Latest**: Dedicated views for trending downloads and newly released updates.
- **Comprehensive App Details (`/app/:slug`)**:
  - High-resolution icons and responsive preview screenshot carousel (with lightbox).
  - Technical metadata: Package identifier, Android OS minimum requirements, version, file size, developer name, and last verified date.
  - **Download Protocol**: External download button that registers click events and safely navigates to the admin-specified external URL.
  - What's New changelog & Previous versions download table.
  - Interactive community reviews with star ratings and feedback submission.
  - Report App modal for community quality control (broken links, copyright, wrong info).
  - Schema.org `SoftwareApplication` JSON-LD structured data for SEO.

### 🛡️ Legal & Compliance Pages
- **About Us (`/about`)**: Directory mission, verification procedures, and zero-binary-hosting explanation.
- **Disclaimer (`/disclaimer`)**: Safe download policy, absence of automatic installation, and external mirror security disclosures.
- **DMCA Takedown (`/dmca`)**: Complete DMCA notice requirements and interactive takedown submission form.
- **Privacy Policy (`/privacy`)**: Anonymized IP hash logging for download stats, zero tracking cookies.
- **Terms of Service (`/terms`)**: Directory usage rules and third-party software disclaimers.
- **Copyright Notice (`/copyright`)**: Trademark attributions and publisher rights.
- **Report Issue (`/report`)**: Community reporting for broken links or security concerns.
- **Contact (`/contact`)**: Inquiries, editorial submissions, and admin correspondence.

### 🔐 Administrative Management Console (`/admin`)
- **JWT Authentication**: Secure admin login with password hashing and session management.
  - Default Username: `admin`
  - Default Password: `admin123`
- **Dashboard Overview**:
  - Real-time analytics: Total apps, games, categories, download redirects, pending reports.
  - Top 5 downloaded applications ranking.
  - Recent editorial actions log.
- **Applications Manager**:
  - Full CRUD: Add, edit, delete, search, and filter apps.
  - Support for multi-screenshot galleries, features checklists, previous version archives, and image uploads (base64).
  - URL safety validator (ensuring `https://` or `http://` protocols).
- **Categories Manager**:
  - Add, edit, and remove categories with gaming genre toggles and app count metrics.
- **User Reviews Moderation**:
  - Approve or delete community reviews.
- **Issue Reports Desk**:
  - View user-reported broken links and safety concerns; mark as resolved or dismissed.
- **Site Identity & Settings**:
  - Configurable site name, tagline, description, contact email, and footer text.

---

## 🚀 Getting Started & Deployment

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Local Development
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start full-stack development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
```bash
# 1. Build Vite frontend and bundle Express server with esbuild
npm run build

# 2. Launch production server
npm run start
```

---

## 🔒 Security & Data Integrity
1. **Zero Malware / Zero Binary Hosting**: No binaries are stored on the server.
2. **Download URL Sanitization**: Enforces strict URL scheme checking (`http://` and `https://` only) to eliminate `javascript:`, `data:`, or `vbscript:` injection.
3. **Anonymized Analytics**: User IP addresses are hashed using SHA-256 before storing click logs, preserving user privacy while preventing fraudulent click counts.
4. **Persistent JSON Database**: Data is stored securely in `data/database.json` with automatic directory initialization and default seed data.
