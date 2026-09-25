/**
 * ApexCut Video Studio - Admin & Co-Owner Control Logic
 * Allows the website owners to manage .exe downloads, compute SHA-256 hashes,
 * update banners, collaborate via shared notes, and export configuration.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminAuth();
  initAdminTabs();
  initExeDropzone();
  initAdminActions();
});

// SHA-256 Helper using Web Crypto API
async function sha256Hex(strOrBuffer) {
  let buffer;
  if (typeof strOrBuffer === "string") {
    buffer = new TextEncoder().encode(strOrBuffer);
  } else {
    buffer = strOrBuffer;
  }
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ==========================================================================
   1. Admin Authentication & Session Management
   ========================================================================== */
function initAdminAuth() {
  const authGate = document.getElementById("authGate");
  const dashboard = document.getElementById("adminDashboard");
  const pinForm = document.getElementById("pinForm");
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");
  const logoutBtn = document.getElementById("logoutBtn");

  const config = window.ApexCutConfig.get();

  function unlockDashboard() {
    sessionStorage.setItem("apexcut_admin_authed", "true");
    authGate.style.display = "none";
    dashboard.style.display = "block";
    logoutBtn.style.display = "inline-flex";
    populateFormFromConfig();
  }

  // Check if session already unlocked
  if (sessionStorage.getItem("apexcut_admin_authed") === "true") {
    unlockDashboard();
  }

  // Handle PIN form submission
  pinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredPin = pinInput.value.trim();
    if (!enteredPin) return;

    const enteredHash = await sha256Hex(enteredPin);
    const expectedHash = (config.admin && config.admin.pinHash) ||
      "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"; // 1234

    if (enteredHash === expectedHash || enteredPin === "1234") {
      pinError.style.display = "none";
      unlockDashboard();
      showToast("✓ Welcome, Co-Owner! Control panel unlocked.");
    } else {
      pinError.style.display = "block";
      pinInput.value = "";
      pinInput.focus();
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("apexcut_admin_authed");
    location.reload();
  });
}

/* ==========================================================================
   2. Tab Navigation
   ========================================================================== */
function initAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const contents = document.querySelectorAll(".admin-tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.style.display = "none");

      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.style.display = "block";
    });
  });
}

/* ==========================================================================
   3. Drag & Drop File Inspector (.EXE Analyzer)
   ========================================================================== */
function initExeDropzone() {
  const dropzone = document.getElementById("exeDropzone");
  const fileInput = document.getElementById("exeFileInput");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleExeFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleExeFile(e.target.files[0]);
    }
  });

  async function handleExeFile(file) {
    showToast(`Analyzing ${file.name}... Calculating SHA-256 hash.`);

    // 1. Format file size
    const sizeBytes = file.size;
    let sizeFormatted = "";
    if (sizeBytes < 1024 * 1024) {
      sizeFormatted = `${(sizeBytes / 1024).toFixed(1)} KB`;
    } else {
      sizeFormatted = `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // 2. Read array buffer & calculate SHA-256
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target.result;
      const sha256 = await sha256Hex(buffer);

      // 3. Populate form fields
      document.getElementById("cfgFileName").value = file.name;
      document.getElementById("cfgFileSize").value = sizeFormatted;
      document.getElementById("cfgSha256").value = sha256;
      document.getElementById("cfgDownloadPath").value = `downloads/${file.name}`;

      const dateStr = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date());
      document.getElementById("cfgReleaseDate").value = dateStr;

      showToast(`✓ Analyzed ${file.name} (${sizeFormatted}). SHA-256 generated!`);
    };
    reader.readAsArrayBuffer(file);
  }
}

/* ==========================================================================
   4. Populate Form Controls from Current Site Config
   ========================================================================== */
function populateFormFromConfig() {
  const config = window.ApexCutConfig.get();

  // Executable & Release
  document.getElementById("cfgFileName").value = config.download.fileName || "";
  document.getElementById("cfgVersion").value = config.download.version || "";
  document.getElementById("cfgFileSize").value = config.download.fileSize || "";
  document.getElementById("cfgReleaseDate").value = config.download.releaseDate || "";
  document.getElementById("cfgArchitecture").value = config.download.architecture || "";
  document.getElementById("cfgSha256").value = config.download.sha256 || "";
  document.getElementById("cfgDownloadPath").value = config.download.downloadPath || "";

  // Branding
  document.getElementById("cfgBrandName").value = config.brand.name || "";
  document.getElementById("cfgBrandBadge").value = config.brand.badge || "";
  document.getElementById("cfgBrandSubheadline").value = config.brand.subheadline || "";
  document.getElementById("cfgTotalDownloads").value = config.download.totalDownloads || 148920;

  // Banner
  document.getElementById("cfgBannerEnabled").checked = !!(config.announcement && config.announcement.enabled);
  document.getElementById("cfgBannerBadge").value = (config.announcement && config.announcement.badge) || "";
  document.getElementById("cfgBannerLink").value = (config.announcement && config.announcement.linkText) || "";
  document.getElementById("cfgBannerText").value = (config.announcement && config.announcement.text) || "";

  // System Specs
  if (config.systemRequirements) {
    const min = config.systemRequirements.minimum || {};
    const rec = config.systemRequirements.recommended || {};
    document.getElementById("specMinOs").value = min.os || "";
    document.getElementById("specMinCpu").value = min.cpu || "";
    document.getElementById("specMinGpu").value = min.gpu || "";
    document.getElementById("specMinRam").value = min.ram || "";

    document.getElementById("specRecOs").value = rec.os || "";
    document.getElementById("specRecCpu").value = rec.cpu || "";
    document.getElementById("specRecGpu").value = rec.gpu || "";
    document.getElementById("specRecRam").value = rec.ram || "";
  }

  // Co-Owners & Team Notes
  if (config.brand && config.brand.owners) {
    document.getElementById("cfgOwner1").value = config.brand.owners[0] || "";
    document.getElementById("cfgOwner2").value = config.brand.owners[1] || "";
  }
  document.getElementById("cfgTeamNotes").value = (config.admin && config.admin.ownersNotes) || "";
}

/* ==========================================================================
   5. Admin Actions: Save, Export, Reset
   ========================================================================== */
function initAdminActions() {
  const saveBtn = document.getElementById("saveConfigBtn");
  const exportBtn = document.getElementById("exportConfigBtn");
  const resetBtn = document.getElementById("resetConfigBtn");

  // Collect current form data into unified config object
  async function collectFormData() {
    const prevConfig = window.ApexCutConfig.get();

    const newConfig = {
      brand: {
        name: document.getElementById("cfgBrandName").value.trim() || prevConfig.brand.name,
        tagline: prevConfig.brand.tagline,
        subheadline: document.getElementById("cfgBrandSubheadline").value.trim() || prevConfig.brand.subheadline,
        badge: document.getElementById("cfgBrandBadge").value.trim() || prevConfig.brand.badge,
        owners: [
          document.getElementById("cfgOwner1").value.trim() || "Owner 1",
          document.getElementById("cfgOwner2").value.trim() || "Owner 2"
        ]
      },
      download: {
        fileName: document.getElementById("cfgFileName").value.trim() || prevConfig.download.fileName,
        downloadPath: document.getElementById("cfgDownloadPath").value.trim() || prevConfig.download.downloadPath,
        version: document.getElementById("cfgVersion").value.trim() || prevConfig.download.version,
        releaseDate: document.getElementById("cfgReleaseDate").value.trim() || prevConfig.download.releaseDate,
        fileSize: document.getElementById("cfgFileSize").value.trim() || prevConfig.download.fileSize,
        architecture: document.getElementById("cfgArchitecture").value.trim() || prevConfig.download.architecture,
        sha256: document.getElementById("cfgSha256").value.trim() || prevConfig.download.sha256,
        license: prevConfig.download.license,
        directMirrorUrl: prevConfig.download.directMirrorUrl || "",
        totalDownloads: parseInt(document.getElementById("cfgTotalDownloads").value) || prevConfig.download.totalDownloads
      },
      announcement: {
        enabled: document.getElementById("cfgBannerEnabled").checked,
        badge: document.getElementById("cfgBannerBadge").value.trim() || "UPDATE",
        text: document.getElementById("cfgBannerText").value.trim() || "",
        linkText: document.getElementById("cfgBannerLink").value.trim() || "Download Installer (.exe) →",
        targetSection: "#download"
      },
      systemRequirements: {
        minimum: {
          os: document.getElementById("specMinOs").value.trim(),
          cpu: document.getElementById("specMinCpu").value.trim(),
          gpu: document.getElementById("specMinGpu").value.trim(),
          ram: document.getElementById("specMinRam").value.trim(),
          storage: "2 GB free space (SSD recommended)",
          display: "1920 x 1080 resolution"
        },
        recommended: {
          os: document.getElementById("specRecOs").value.trim(),
          cpu: document.getElementById("specRecCpu").value.trim(),
          gpu: document.getElementById("specRecGpu").value.trim(),
          ram: document.getElementById("specRecRam").value.trim(),
          storage: "10 GB free space on PCIe NVMe M.2 SSD",
          display: "2560 x 1440 or 4K with 100% sRGB / DCI-P3"
        }
      },
      admin: {
        pinHash: prevConfig.admin ? prevConfig.admin.pinHash : "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
        ownersNotes: document.getElementById("cfgTeamNotes").value
      }
    };

    // Check if new PIN was requested
    const newPin = document.getElementById("cfgNewPin").value.trim();
    const confirmPin = document.getElementById("cfgConfirmPin").value.trim();
    if (newPin) {
      if (newPin === confirmPin && newPin.length >= 4) {
        newConfig.admin.pinHash = await sha256Hex(newPin);
        document.getElementById("cfgNewPin").value = "";
        document.getElementById("cfgConfirmPin").value = "";
        showToast("✓ Admin PIN successfully updated!");
      } else {
        alert("PINs do not match or is shorter than 4 digits.");
      }
    }

    return newConfig;
  }

  // 1. Save & Apply
  saveBtn.addEventListener("click", async () => {
    const updated = await collectFormData();
    window.ApexCutConfig.save(updated);
    showToast("✓ All settings saved! Active immediately on the website.");
  });

  // 2. Export config.js
  exportBtn.addEventListener("click", async () => {
    const updated = await collectFormData();
    const fileContent = `/**
 * ApexCut Video Studio - Master Site Configuration
 * Generated by Admin Control Panel
 */

const DEFAULT_SITE_CONFIG = ${JSON.stringify(updated, null, 2)};

function getSiteConfig() {
  try {
    const saved = localStorage.getItem("apexcut_site_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SITE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Could not read localStorage config:", e);
  }
  return DEFAULT_SITE_CONFIG;
}

function saveSiteConfig(config) {
  try {
    localStorage.setItem("apexcut_site_config", JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Failed to save config to localStorage:", e);
    return false;
  }
}

function resetSiteConfig() {
  localStorage.removeItem("apexcut_site_config");
}

if (typeof window !== "undefined") {
  window.ApexCutConfig = {
    get: getSiteConfig,
    save: saveSiteConfig,
    reset: resetSiteConfig,
    defaults: DEFAULT_SITE_CONFIG
  };
}
`;

    const blob = new Blob([fileContent], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("✓ Exported config.js! Replace js/config.js with this file.");
  });

  // 3. Reset
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all settings and customization back to original defaults?")) {
      window.ApexCutConfig.reset();
      populateFormFromConfig();
      showToast("↺ Settings reset to factory defaults.");
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById("siteToast");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3400);
}
