// [build-note] The page works with zero JS (anchors + <details> are native).
// JS only adds three conveniences — progressive enhancement, not a dependency.

// (1) Copy email → aria-live toast confirms it for screen readers too.
const toast = document.getElementById("toast");
let toastTimer;
function ping(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}
document.getElementById("copy-mail").addEventListener("click", async () => {
  const email = "abahojomacynthia@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    ping("Email copied ✓");
  } catch {
    ping(email);
  } // clipboard blocked (e.g. file://) — show it instead
});

// (2) Mobile menu — toggle the nav panel and keep ARIA honest.
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
function setMenu(open) {
  primaryNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () =>
  setMenu(!primaryNav.classList.contains("is-open")),
);
// Close after tapping a link, on Escape, and if the viewport grows back to desktop.
primaryNav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenu(false);
});

// (2) Highlight the nav link for whichever section is on screen.
const links = [...document.querySelectorAll('.nav a[href^="#"]')];
const byId = Object.fromEntries(
  links.map((a) => [a.getAttribute("href").slice(1), a]),
);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      const a = byId[e.target.id];
      if (a) a.style.color = e.isIntersecting ? "var(--iris)" : "";
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

// (3) Footer year — set once, never think about it again. (kept for future use)

/* ═══════════════════════════════════════════════════════════════════════════
   (4) VIDEO CARDS — added in v2. Documented at §500 in DOCUMENTATION.md.

   Ground rule, same as the rest of this file: the page already works without
   any of this. Each card's stage is a plain <a href="assets/video/*.mp4">, so
   with JavaScript off a click just opens the clip in the browser's own player.
   Everything below is an upgrade on top of that, never a prerequisite.
   ═══════════════════════════════════════════════════════════════════════════ */

const MAX_SECONDS = 60; // the brief's cap — enforced here, not typed by hand.
const cards = [...document.querySelectorAll(".vcard")];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// m:ss — 58 → "0:58", 61 → "1:01".
const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

cards.forEach((card) => {
  const video = card.querySelector(".vcard__video");
  const chip = card.querySelector("[data-dur]");
  const link = card.querySelector(".vcard__open");
  if (!video || !link) return;

  // Progress hairline is injected, not hand-written into the markup: it exists
  // only to visualise the preview, so it belongs to the enhancement layer.
  const progress = document.createElement("span");
  progress.className = "vcard__progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<i></i>";
  link.appendChild(progress);
  const bar = progress.firstElementChild;

  // The clip exists → upgrade the stage, and publish the REAL duration.
  const applyMeta = () => {
    card.classList.add("has-clip");
    if (!Number.isFinite(video.duration)) return;
    chip.textContent = fmt(video.duration);
    // Over the cap is a build error, so it is shown as one rather than hidden.
    const over = video.duration > MAX_SECONDS + 0.5;
    chip.classList.toggle("is-over", over);
    if (over) {
      console.warn(
        `[video] ${card.dataset.slug} runs ${fmt(video.duration)} — the brief caps clips at ${MAX_SECONDS}s.`,
      );
    }
  };
  video.addEventListener("loadedmetadata", applyMeta);
  // …and once immediately: this script is deferred, so a local or cached clip
  // can finish loading its metadata BEFORE the listener above is attached, and
  // the event never fires. Listening alone silently loses the fast path.
  if (video.readyState >= 1) applyMeta();

  // Missing file → stay on the designed slate. No broken player, no console spam.
  video.addEventListener("error", () => card.classList.remove("has-clip"));

  // Silent hover / focus preview. Muted + playsinline keeps mobile browsers
  // happy; play() is a promise that rejects when autoplay is blocked, so it is
  // caught rather than left to throw.
  const preview = (on) => {
    if (reduceMotion || !card.classList.contains("has-clip")) return;
    if (on) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      bar.style.width = "0%";
    }
  };
  video.addEventListener("timeupdate", () => {
    if (video.duration)
      bar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  });
  card.addEventListener("mouseenter", () => preview(true));
  card.addEventListener("mouseleave", () => preview(false));
  link.addEventListener("focus", () => preview(true));
  link.addEventListener("blur", () => preview(false));

  // Click → the shared lightbox. Modified clicks (new tab, download) are left
  // alone so the link keeps behaving like a link.
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openLightbox(card);
  });
});

/* ── (5) THE LIGHTBOX ────────────────────────────────────────────────────────
   One dialog, borrowed by whichever card was clicked. It traps Tab, closes on
   Escape or backdrop, pauses on close, and hands focus back to the card that
   opened it — the things a <div role="dialog"> has to do by hand. */

const lb = document.getElementById("lightbox");
const lbVideo = document.getElementById("lightboxVideo");
const lbTitle = document.getElementById("lightboxTitle");
const lbFile = document.getElementById("lightboxFile");
const lbDur = document.getElementById("lightboxDur");
const lbClose = document.getElementById("lightboxClose");
let lastFocused = null;

function openLightbox(card) {
  const src = card.querySelector(".vcard__open").getAttribute("href");
  const slug = card.dataset.slug;
  lastFocused = card.querySelector(".vcard__open");

  lbVideo.pause();
  lbVideo.innerHTML = ""; // drop the previous clip's caption track
  lbVideo.src = src;
  lbVideo.poster = `assets/poster/${slug}.jpg`;

  // Captions attach automatically when a .vtt sits beside the clip.
  const track = document.createElement("track");
  track.kind = "captions";
  track.label = "English";
  track.srclang = "en";
  track.src = `assets/video/${slug}.vtt`;
  track.default = true;
  lbVideo.appendChild(track);

  lbTitle.textContent = card.querySelector("h3").textContent.trim();
  lbFile.textContent = `${slug}.mp4`;
  lbDur.textContent = card.querySelector("[data-dur]").textContent;

  lb.hidden = false;
  document.body.classList.add("is-locked");
  lbClose.focus();
  lbVideo.play().catch(() => {}); // blocked autoplay just leaves the controls
}

function closeLightbox() {
  if (lb.hidden) return;
  lbVideo.pause();
  lbVideo.removeAttribute("src");
  lbVideo.load(); // stop the download; without this the file keeps streaming
  lb.hidden = true;
  document.body.classList.remove("is-locked");
  if (lastFocused) lastFocused.focus();
}

lb.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeLightbox();
});
lbClose.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key !== "Tab") return;
  // Focus trap: two stops (close button, video controls) cycled by hand.
  const stops = [lbClose, lbVideo];
  const i = stops.indexOf(document.activeElement);
  e.preventDefault();
  stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
});
