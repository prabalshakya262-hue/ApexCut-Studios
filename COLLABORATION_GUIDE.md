# Co-Owner Collaboration Guide: Managing the Website Together

This guide explains how you and your friend can control, update, and co-manage the **ApexCut Video Studio** website.

---

## 1. The Web Admin Control Panel (`admin.html`)

You and your friend can access the built-in control panel at any time:
- **URL**: Open `admin.html` (e.g. `http://localhost:3000/admin.html` or your hosted domain).
- **Default PIN**: `1234`

### What You & Your Friend Can Control in the Panel:
1. **📦 App & .EXE Downloads**:
   - Change version string (e.g. `2.5.0` &rarr; `2.6.0`).
   - Drag & drop new `.exe` builds to automatically calculate file size & SHA-256 hash.
   - Update download paths or external mirror links.
2. **📢 Top Announcement Banner**:
   - Toggle banner on or off.
   - Announce new features (e.g., *"Hotfix 2.5.1: NVIDIA 40-series NVENC fix released"*).
3. **💻 System Requirements**:
   - Adjust minimum & recommended specs (RAM, GPU, CPU, OS).
4. **👥 Shared Team Notes**:
   - Leave messages, build change logs, or to-do lists for each other.
5. **🔒 Security & PIN**:
   - Set a private 4-digit or 6-digit PIN known only to the two of you.

---

## 2. Collaboration & Code Syncing Options

### Option A: Cloudflare Pages + GitHub (Primary Recommended Setup)
This gives both you and your friend full collaborative control with automated deployments, zero egress fees, and custom domain support:
1. Push your repository to GitHub and invite your friend as a Collaborator.
2. In Cloudflare Dashboard, connect Cloudflare Pages to your repo (Framework: None, Output dir: `.`).
3. Whenever either of you pushes (`git push`), Cloudflare automatically deploys the latest version to edge servers worldwide in ~30 seconds!
4. For step-by-step instructions, see [`CLOUDFLARE_DEPLOYMENT_GUIDE.md`](./CLOUDFLARE_DEPLOYMENT_GUIDE.md).

### Option B: Hosting Large `.EXE` Installers (> 25 MB on Cloudflare)
- Use **Cloudflare R2** (10 GB free storage, $0 bandwidth fees) or **GitHub Releases** (up to 2GB per file free).
- Paste your R2 or GitHub release download link directly into `cfgDownloadPath` in `admin.html` or `js/config.js`.
- All download buttons on your website will stream the file directly from Cloudflare's high-speed CDN.

---

## 3. Working Locally on Your Computers

To test and preview the website locally:

```powershell
# Using Python
python -m http.server 3000

# OR using Node.js
npx serve .
```

Open your browser to:
- Website: `http://localhost:3000`
- Admin Control Panel: `http://localhost:3000/admin.html`
