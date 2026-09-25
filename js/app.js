/**
 * ApexCut Video Studio - Main Application Logic
 * Interactive NLE Video Editor Mockup, Download Manager, and UI Interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load and Apply Site Configuration
  initSiteConfiguration();

  // 2. Initialize Interactive Video Editor Canvas & Controls
  initVideoEditorMockup();

  // 3. Initialize Download Triggers & Modal
  initDownloadFlow();

  // 4. Initialize Checksum Copy & Toasts
  initChecksumHelper();

  // 5. Initialize FAQ Accordion
  initFaqAccordion();

  // 6. Initialize Mobile Navigation
  initMobileMenu();
});

/* ==========================================================================
   1. Site Configuration Hydration
   ========================================================================== */
function initSiteConfiguration() {
  const config = window.ApexCutConfig ? window.ApexCutConfig.get() : null;
  if (!config) return;

  // Hydrate Brand Details
  document.querySelectorAll("[data-config='brand-name']").forEach(el => el.textContent = config.brand.name);
  document.querySelectorAll("[data-config='brand-tagline']").forEach(el => el.textContent = config.brand.tagline);
  document.querySelectorAll("[data-config='brand-subheadline']").forEach(el => el.textContent = config.brand.subheadline);
  document.querySelectorAll("[data-config='brand-badge']").forEach(el => el.textContent = config.brand.badge);

  // Hydrate Announcement Banner
  const bannerEl = document.getElementById("announcementBanner");
  if (bannerEl) {
    if (config.announcement && config.announcement.enabled) {
      bannerEl.style.display = "flex";
      const badge = bannerEl.querySelector(".banner-badge");
      const text = bannerEl.querySelector(".banner-text");
      const link = bannerEl.querySelector(".banner-link");
      if (badge) badge.textContent = config.announcement.badge;
      if (text) text.textContent = config.announcement.text;
      if (link) link.textContent = config.announcement.linkText;
    } else {
      bannerEl.style.display = "none";
    }
  }

  // Hydrate Download Info
  const download = config.download;
  if (download) {
    document.querySelectorAll("[data-config='app-version']").forEach(el => el.textContent = "v" + download.version);
    document.querySelectorAll("[data-config='file-name']").forEach(el => el.textContent = download.fileName);
    document.querySelectorAll("[data-config='file-size']").forEach(el => el.textContent = download.fileSize);
    document.querySelectorAll("[data-config='release-date']").forEach(el => el.textContent = download.releaseDate);
    document.querySelectorAll("[data-config='architecture']").forEach(el => el.textContent = download.architecture);
    document.querySelectorAll("[data-config='sha256']").forEach(el => el.textContent = download.sha256);
    document.querySelectorAll("[data-config='total-downloads']").forEach(el => {
      el.textContent = Number(download.totalDownloads || 148920).toLocaleString();
    });

    // Update all download buttons with direct links
    const downloadBtns = document.querySelectorAll(".btn-download-app");
    downloadBtns.forEach(btn => {
      btn.setAttribute("href", download.downloadPath || `downloads/${download.fileName}`);
      btn.setAttribute("download", download.fileName);
    });
  }
}

/* ==========================================================================
   2. Interactive Video Editor Mockup Logic
   ========================================================================== */
function initVideoEditorMockup() {
  const canvas = document.getElementById("editorCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // State
  let isPlaying = true;
  let currentFrame = 2500; // ~00:01:24:18
  const totalFrames = 10800; // 6 mins at 30 fps
  let currentLut = "teal-orange"; // default LUT filter

  // Elements
  const playPauseBtn = document.getElementById("timelinePlayBtn");
  const centerPlayOverlay = document.getElementById("centerPlayOverlay");
  const timecodeDisplay = document.getElementById("timecodeDisplay");
  const playhead = document.getElementById("timelinePlayhead");
  const tracksContainer = document.getElementById("timelineTracks");
  const meterL = document.getElementById("meterLeft");
  const meterR = document.getElementById("meterRight");
  const lutButtons = document.querySelectorAll(".lut-btn");

  // Format frame to SMPTE Timecode HH:MM:SS:FF
  function frameToTimecode(frame) {
    const fps = 30;
    const totalSeconds = Math.floor(frame / fps);
    const ff = String(frame % fps).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    const mm = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    return `${hh}:${mm}:${ss}:${ff}`;
  }

  // Draw interactive video simulation onto canvas
  function renderCanvas() {
    canvas.width = canvas.parentElement.clientWidth || 640;
    canvas.height = canvas.parentElement.clientHeight || 360;

    const w = canvas.width;
    const h = canvas.height;
    const t = currentFrame * 0.04;

    // Background gradient base
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (currentLut === "teal-orange") {
      grad.addColorStop(0, "#082f49"); // deep teal
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#c2410c"); // warm amber
    } else if (currentLut === "cyberpunk") {
      grad.addColorStop(0, "#4a044e"); // deep magenta
      grad.addColorStop(0.5, "#18181b");
      grad.addColorStop(1, "#0284c7"); // electric neon cyan
    } else if (currentLut === "film-noir") {
      grad.addColorStop(0, "#09090b");
      grad.addColorStop(0.5, "#27272a");
      grad.addColorStop(1, "#18181b");
    } else {
      // Clean Cinema
      grad.addColorStop(0, "#1e293b");
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#334155");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Animated geometric cinematic elements
    ctx.save();
    ctx.translate(w / 2, h / 2);

    // Rotating cinematic iris/lens rings
    ctx.strokeStyle = currentLut === "film-noir" ? "rgba(255,255,255,0.15)" : "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(w, h) * 0.28 + Math.sin(t) * 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = currentLut === "film-noir" ? "rgba(255,255,255,0.08)" : "rgba(99, 102, 241, 0.35)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(w, h) * 0.38 + Math.cos(t * 0.8) * 15, 0, Math.PI * 2);
    ctx.stroke();

    // Mountain / Landscape wireframe polygon simulation
    ctx.beginPath();
    ctx.moveTo(-w * 0.45, h * 0.25);
    for (let x = -w * 0.45; x <= w * 0.45; x += 25) {
      const y = h * 0.15 + Math.sin((x * 0.02) + t) * 25 + Math.cos((x * 0.05) - t * 0.5) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w * 0.45, h * 0.45);
    ctx.lineTo(-w * 0.45, h * 0.45);
    ctx.closePath();

    ctx.fillStyle = currentLut === "film-noir" ? "rgba(255,255,255,0.08)" : "rgba(99, 102, 241, 0.25)";
    ctx.fill();

    // Foreground 3D horizon lines
    ctx.strokeStyle = currentLut === "cyberpunk" ? "rgba(236, 72, 153, 0.5)" : "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const lineY = h * 0.2 + (i * 12);
      ctx.beginPath();
      ctx.moveTo(-w * 0.48, lineY);
      ctx.lineTo(w * 0.48, lineY);
      ctx.stroke();
    }

    ctx.restore();

    // On-screen video HUD overlays
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "600 13px 'JetBrains Mono', Consolas, monospace";
    ctx.fillText("CAM 1 • 4K UHD 60FPS • RAW 10-BIT", 20, 36);

    ctx.font = "500 11px 'JetBrains Mono', Consolas, monospace";
    ctx.fillStyle = currentLut === "teal-orange" ? "#38bdf8" : (currentLut === "cyberpunk" ? "#ec4899" : "#10b981");
    ctx.fillText(`LUT: [${currentLut.toUpperCase().replace("-", " ")}]`, 20, 54);

    // Vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.7);
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  // Animation Loop
  function tick() {
    if (isPlaying) {
      currentFrame = (currentFrame + 1) % totalFrames;
      timecodeDisplay.textContent = frameToTimecode(currentFrame);

      // Update playhead position (0% - 100%)
      const progressPercent = (currentFrame / totalFrames) * 100;
      playhead.style.left = `${progressPercent}%`;

      // Animate Audio Meters
      if (meterL && meterR) {
        const randL = 40 + Math.random() * 45;
        const randR = 38 + Math.random() * 48;
        meterL.style.height = `${randL}%`;
        meterR.style.height = `${randR}%`;
      }
    } else {
      if (meterL && meterR) {
        meterL.style.height = "5%";
        meterR.style.height = "5%";
      }
    }

    renderCanvas();
    requestAnimationFrame(tick);
  }

  // Toggle Play / Pause
  function togglePlayback() {
    isPlaying = !isPlaying;
    const playSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const pauseSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    playPauseBtn.innerHTML = isPlaying ? pauseSvg : playSvg;
    centerPlayOverlay.style.display = isPlaying ? "none" : "flex";
  }

  playPauseBtn.addEventListener("click", togglePlayback);
  centerPlayOverlay.addEventListener("click", togglePlayback);

  // Timeline scrubber click / drag
  tracksContainer.addEventListener("click", (e) => {
    const rect = tracksContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    currentFrame = Math.floor(ratio * totalFrames);
    timecodeDisplay.textContent = frameToTimecode(currentFrame);
    playhead.style.left = `${ratio * 100}%`;
  });

  // LUT Selector buttons
  lutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      lutButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLut = btn.dataset.lut || "teal-orange";
    });
  });

  // Start animation loop
  tick();
}

/* ==========================================================================
   3. Download Flow & Modal
   ========================================================================== */
function initDownloadFlow() {
  const downloadBtns = document.querySelectorAll(".btn-download-app");
  const modal = document.getElementById("downloadSuccessModal");
  const closeBtn = document.getElementById("closeDownloadModal");

  downloadBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Trigger modal guidance
      setTimeout(() => {
        if (modal) modal.classList.add("active");
      }, 600);

      // Increment local download count visual feedback
      const countEl = document.querySelector("[data-config='total-downloads']");
      if (countEl) {
        let current = parseInt(countEl.textContent.replace(/,/g, "")) || 148920;
        countEl.textContent = (current + 1).toLocaleString();
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
}

/* ==========================================================================
   4. SHA-256 Copy Helper & Toast
   ========================================================================== */
function initChecksumHelper() {
  const copyBtn = document.getElementById("copyHashBtn");
  const toast = document.getElementById("siteToast");
  const toastMsg = document.getElementById("toastMessage");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const hashEl = document.querySelector("[data-config='sha256']");
      const hash = hashEl ? hashEl.textContent.trim() : "";

      if (hash && navigator.clipboard) {
        navigator.clipboard.writeText(hash).then(() => {
          showToast("✓ SHA-256 hash copied to clipboard!");
        }).catch(() => {
          showToast("Copied: " + hash.substring(0, 16) + "...");
        });
      }
    });
  }

  window.showToast = function (message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach(i => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    }
  });
}

/* ==========================================================================
   6. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.querySelector(".nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = navLinks.style.display === "flex";
      navLinks.style.display = isExpanded ? "none" : "flex";
      if (!isExpanded) {
        navLinks.style.position = "absolute";
        navLinks.style.top = "72px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "#0d111a";
        navLinks.style.flexDirection = "column";
        navLinks.style.padding = "24px";
        navLinks.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        navLinks.style.gap = "16px";
      }
    });
  }
}
