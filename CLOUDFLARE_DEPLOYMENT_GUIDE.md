# Cloudflare Pages Hosting & Deployment Guide

This guide details how to deploy and host the **ApexCut Video Studio** website on **Cloudflare Pages** for global distribution, zero bandwidth costs, and shared control between you and your friend.

---

## 🚀 Why Cloudflare Pages?

- **100% Free**: Unlimited bandwidth, automatic free SSL certificate, global CDN across 300+ cities.
- **Fast Global Downloads**: Delivers your HTML, CSS, JS, and media instantly.
- **Pre-Configured**: We've included [`_headers`](file:///C:/Users/DELL/.gemini/antigravity/scratch/apexcut-video-editor/_headers) (caching & download headers) and [`_redirects`](file:///C:/Users/DELL/.gemini/antigravity/scratch/apexcut-video-editor/_redirects) (clean `/admin` routing).

---

## 🛠️ Step-by-Step Deployment Options

### Method 1: Connected to GitHub (Best for You & Your Friend)

This is the recommended setup so that every change you or your friend push to Git automatically deploys live to Cloudflare.

1. **Push your code to GitHub**:
   ```powershell
   cd C:\Users\DELL\.gemini\antigravity\scratch\apexcut-video-editor
   git init
   git add .
   git commit -m "Initial commit for ApexCut Video Studio"
   git branch -M main
   # Add your remote and push:
   # git remote add origin https://github.com/YourUsername/apexcut-website.git
   # git push -u origin main
   ```
2. **Invite Your Friend**:
   - Go to your GitHub repository &rarr; **Settings** &rarr; **Collaborators** &rarr; **Add people**.
   - Your friend can now make updates and push releases too.

3. **Deploy on Cloudflare**:
   - Log into the [Cloudflare Dashboard](https://dash.cloudflare.com).
   - In the sidebar, navigate to **Compute (Workers & Pages)** &rarr; **Pages** &rarr; **Create application**.
   - Choose **Connect to Git** and select your GitHub repository.
   - Build configuration settings:
     - **Framework preset**: `None`
     - **Build command**: *(leave empty)*
     - **Build output directory**: `.`
   - Click **Save and Deploy**.

Your site will be live at `https://your-project.pages.dev` in less than 60 seconds!

---

### Method 2: Direct Folder Upload (No Git Required)

If you just want to get it online immediately:

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** &rarr; **Pages** &rarr; **Upload assets**.
3. Choose a project name (e.g., `apexcut-studio`).
4. Drag and drop the `apexcut-video-editor` folder directly into Cloudflare.
5. Click **Deploy site**. Done!

---

## 📦 Handling the App .EXE on Cloudflare

Cloudflare Pages has a **25 MB per-file upload limit** on static assets.

### Case A: Installer is < 25 MB
- Simply keep it in `downloads/ApexCut-Setup-v2.5.0.exe`. It deploys directly with the website.

### Case B: Installer is > 25 MB (e.g. 85 MB, 200 MB, 500 MB)
If your compiled video editor installer exceeds 25 MB, choose either of these free high-speed solutions:

#### Option 1: Cloudflare R2 (Zero Egress/Bandwidth Fees)
Cloudflare R2 provides 10 GB free object storage with **$0 bandwidth fees**:
1. In Cloudflare Dashboard, click **R2 Object Storage** &rarr; **Create bucket** (e.g. `apexcut-releases`).
2. Upload your `ApexCut-Setup-v2.5.0.exe` into the bucket.
3. In bucket settings, enable **Public access** (or connect a custom domain like `download.yourdomain.com`).
4. Copy the public URL (e.g. `https://pub-xxxx.r2.dev/ApexCut-Setup-v2.5.0.exe`).
5. Open `admin.html` (or `js/config.js`) and paste this URL into **Relative Download Path / Mirror URL**.
6. Click **Save & Apply**. Visitors clicking "Download" will download from Cloudflare R2 at full speed!

#### Option 2: GitHub Releases (Unlimited & Free)
1. Go to your GitHub repository &rarr; **Releases** &rarr; **Draft a new release**.
2. Tag it `v2.5.0`, upload your `.exe` file (GitHub supports up to 2GB per file).
3. Right-click the uploaded `.exe` in the release and copy the link.
4. Paste it in `admin.html` &rarr; click **Save**.

---

## 👥 Giving Your Friend Shared Access on Cloudflare

To allow your friend to manage Cloudflare deployments, view visitor analytics, and manage domains:
1. In Cloudflare Dashboard, click **Manage Account** (in top-right or sidebar) &rarr; **Members**.
2. Click **Invite Member**.
3. Enter your friend's email address.
4. Assign the **"Cloudflare Pages"** role (or Administrator).
5. Your friend will receive an invitation to log in and co-manage the Cloudflare project!

---

## 🌐 Adding a Custom Domain

1. In your Cloudflare Pages project, go to **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter your domain (e.g., `apexcut.com` or `videoeditor.com`).
4. Cloudflare will automatically provision DNS records and generate a free SSL certificate.
