# ApexCut Video Studio - Promotional & Distribution Website

A modern, high-conversion landing page and software distribution website for **ApexCut Video Studio** (Windows 64-bit).

---

## 🌟 Highlights & Features

- **Direct .EXE Download Pipeline**: Pre-wired buttons, file size metadata, release versioning, and cryptographic SHA-256 hash verification with 1-click clipboard copy.
- **Interactive NLE Video Editor Mockup**:
  - Live animated 4K video canvas.
  - Interactive multi-track magnetic timeline with scrubbable playhead.
  - Real-time 3D LUT color grading filter switcher (*Teal & Orange*, *Cyberpunk Neon*, *Film Noir Vintage*, *Clean Cinema*).
  - Synchronized audio level peak meters.
- **Co-Owner Admin Dashboard (`admin.html`)**:
  - PIN-protected control center for you and your friend.
  - Drag-and-drop `.exe` file inspector that automatically extracts file size and computes SHA-256 hash using the Web Crypto API.
  - Live announcement banner toggle and content editor.
  - Shared team collaboration log & notes.
  - 1-click configuration exporter (`config.js`).
- **Complete Hardware Specs & Installation Guide**: Minimum vs. recommended specs table and 3-step setup walkthrough.
- **Post-Download Guidance Modal**: Step-by-step instructions shown immediately when a visitor clicks Download.
- **Cinematic Dark Design System**: WCAG 2.1 AA accessible, responsive across 320px, 768px, 1024px, and 1440px+, zero bloat.

---

## 📂 Project Structure

```text
apexcut-video-editor/
├── index.html                 # Main public landing page & download hub
├── admin.html                 # Co-Owner control panel (for you & your friend)
├── css/
│   ├── styles.css             # Cinematic dark theme styling
│   └── admin.css              # Admin portal styling
├── js/
│   ├── config.js              # Centralized site configuration
│   ├── app.js                 # Interactive editor canvas & download flows
│   └── admin.js               # Admin auth, SHA-256 analyzer & settings logic
├── downloads/
│   ├── ApexCut-Setup-v2.5.0.exe # Working starter Windows installer executable
│   └── InstallerSource.cs     # C# source code for the starter installer
├── _headers                  # Cloudflare Pages security & download headers
├── _redirects                # Cloudflare Pages clean routes (/admin, /latest)
├── CLOUDFLARE_DEPLOYMENT_GUIDE.md # Cloudflare Pages & R2 deployment walkthrough
├── update_exe.ps1             # 1-click PowerShell helper to attach new .exe files
├── SETUP_YOUR_EXE.md          # Guide on attaching and updating your .exe
├── COLLABORATION_GUIDE.md     # Guide for co-owners on managing the site
└── README.md                  # Project overview and quick start
```

---

## ⚡ Hosting on Cloudflare Pages

This website is fully pre-configured for **Cloudflare Pages**:
- Security headers & download MIME types pre-set in `_headers`.
- Clean route shortcuts (`/admin` &rarr; `admin.html`) pre-set in `_redirects`.
- For a complete walkthrough on deploying via GitHub or direct drag-and-drop, plus setting up Cloudflare R2 for zero-cost .exe downloads, read **[`CLOUDFLARE_DEPLOYMENT_GUIDE.md`](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)**.

---

## 🚀 Quick Start (Running Locally)

To launch the website on your local machine:

```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\apexcut-video-editor

# Option 1: Python
python -m http.server 8080

# Option 2: Node.js
npx serve -l 8080
```

Then visit:
- **Main Website**: [http://localhost:8080](http://localhost:8080)
- **Admin Control Panel**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html) *(Default PIN: `1234`)*

---

## 📦 Attaching Your Real Video Editor `.exe`

Run the included PowerShell helper:
```powershell
.\update_exe.ps1 -SourceExe "C:\Path\To\Your_App.exe" -Version "2.5.0"
```
Or use the drag-and-drop tool inside `admin.html`!
