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
