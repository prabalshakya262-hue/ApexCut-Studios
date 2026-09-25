/**
 * ApexCut Video Studio - Master Site Configuration
 * Managed by Site Owners & Collaborators
 * You and your friend can edit this file directly, or use admin.html to make live changes!
 */

const DEFAULT_SITE_CONFIG = {
  brand: {
    name: "ApexCut Studio",
    tagline: "Cinematic Precision. Instant Playback. Zero Bloat.",
    subheadline: "Next-gen hardware-accelerated video editing suite for Windows. Edit 4K/8K 120 FPS timelines with real-time multi-track effects, AI auto-transcription, and studio color grading.",
    badge: "v2.5.0 STABLE â€¢ 64-BIT WINDOWS",
    owners: ["Team Lead", "Co-Founder"]
  },

  download: {
    fileName: "ApexCut-Setup-v2.5.0.exe",
    downloadPath: "downloads/ApexCut-Setup-v2.5.0.exe",
    version: "2.5.0",
    releaseDate: "September 25, 2026",
    fileSize: "8 KB",
    architecture: "Windows 64-bit (x64 / ARM64)",
    sha256: "ca6bfdb59a91683d4c4c7574e287a9c50158d849eff6d9d6663f322968b57066",
    license: "Free Community Edition (Zero Watermarks)",
    directMirrorUrl: "", // Optional external mirror (e.g. Google Drive, GitHub Releases)
    totalDownloads: 148920
  },

  announcement: {
    enabled: true,
    badge: "NEW UPDATE",
    text: "ApexCut v2.5 released: Native AV1 GPU encoding, AI Speech Enhancer & 10-bit HDR support.",
    linkText: "Download Installer (.exe) â†’",
    targetSection: "#download"
  },

  systemRequirements: {
    minimum: {
      os: "Windows 10 64-bit (v1903 or later)",
      cpu: "Intel Core i5-6th Gen or AMD Ryzen 5 1600",
      gpu: "NVIDIA GTX 960 (4GB) or AMD Radeon RX 560",
      ram: "8 GB DDR4",
      storage: "2 GB free space (SSD recommended)",
      display: "1920 x 1080 resolution"
    },
    recommended: {
      os: "Windows 11 64-bit (Latest Build)",
      cpu: "Intel Core i7-12700K or AMD Ryzen 7 5800X+",
      gpu: "NVIDIA RTX 3060+ (8GB) or AMD Radeon RX 6700 XT",
      ram: "16 GB â€“ 32 GB DDR4/DDR5",
      storage: "10 GB free space on PCIe NVMe M.2 SSD",
      display: "2560 x 1440 or 4K with 100% sRGB / DCI-P3"
    }
  },

  admin: {
    // Default PIN for admin panel control (Change this anytime in admin.html)
    pinHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", // SHA256 of "1234"
    ownersNotes: "Website control handled collaboratively by Co-owners."
  }
};

// Storage helper: loads saved config if modified in admin.html, otherwise returns defaults
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

// Save updated config to localStorage
function saveSiteConfig(config) {
  try {
    localStorage.setItem("apexcut_site_config", JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Failed to save config to localStorage:", e);
    return false;
  }
}

// Reset config to defaults
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

