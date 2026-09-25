# How to Attach & Update Your Video Editor .EXE File

This website is already pre-configured to distribute your Windows Video Editing software executable (`.exe`).

Here is how you and your friend can attach and update your application `.exe` file:

---

## Method 1: Automatic 1-Click Script (Recommended on Windows)

We created a PowerShell automation script `update_exe.ps1` in the project root.

1. Open PowerShell in this folder.
2. Run the script with your `.exe` file path and version:
   ```powershell
   .\update_exe.ps1 -SourceExe "C:\Path\To\Your_Video_Editor_Setup.exe" -Version "2.5.0"
   ```
3. What this script does automatically:
   - Copies your `.exe` into the `downloads/` folder.
   - Calculates the exact file size in MB.
   - Computes the cryptographic **SHA-256 hash**.
   - Automatically updates `js/config.js` with the file name, size, hash, and release date!

---

## Method 2: Drag & Drop via Web Admin Panel

1. Open `admin.html` in your web browser.
2. Enter the PIN: `1234` (or your customized PIN).
3. In the **"📦 App & .EXE Attachment"** tab, drag and drop your `.exe` file into the dashed box.
4. The browser will instantly calculate the file size and compute the SHA-256 hash using the Web Crypto API.
5. Click **"Save & Apply Changes"** or **"Export config.js"**.
6. Make sure to copy your `.exe` file into the `downloads/` directory so visitors can download it.

---

## Method 3: Manual File Placement

1. Place your compiled `.exe` file into the `downloads/` folder:
   ```text
   apexcut-video-editor/
   ├── downloads/
   │   └── ApexCut-Setup-v2.5.0.exe   <-- Place your .exe here!
   ```
2. Open `js/config.js` in any text editor.
3. Update the `download` block:
   ```javascript
   download: {
     fileName: "ApexCut-Setup-v2.5.0.exe",
     downloadPath: "downloads/ApexCut-Setup-v2.5.0.exe",
     version: "2.5.0",
     fileSize: "85.4 MB",
     releaseDate: "September 25, 2026",
     sha256: "YOUR_CALCULATED_SHA256_HASH_HERE",
     // ...
   }
   ```
4. To calculate the SHA-256 hash in PowerShell:
   ```powershell
   Get-FileHash downloads\ApexCut-Setup-v2.5.0.exe -Algorithm SHA256
   ```

---

## Verifying the Download

1. Open `index.html` in your browser.
2. Click any of the **"Download for Windows (.exe)"** buttons.
3. Your browser will prompt to save the `.exe` file and show the post-download setup guidance modal!
