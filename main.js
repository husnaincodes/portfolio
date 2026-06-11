/* main.js */

// ── Ticker typewriter ──
const phrases = [
  "FinTech Undergraduate",
  "Data Scientist",
  "Web Developer",
  "ITU Lahore · 2025–2029",
];
let pIdx = 0, cIdx = 0, deleting = false;
const el = document.getElementById("ticker");
function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    el.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    el.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// ── Scroll: reveal skill cards ──
const cards = document.querySelectorAll(".skill-card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add("visible"), delay);
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);
cards.forEach((c) => observer.observe(c));

// ── Nav scroll style ──
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.style.background =
    window.scrollY > 60 ? "rgba(10,10,15,0.97)" : "rgba(10,10,15,0.85)";
});

// ── Hamburger (mobile) ──
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  const open = navLinks.style.display === "flex";
  navLinks.style.cssText = open
    ? ""
    : "display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;padding:1.5rem;background:rgba(10,10,15,0.98);border-bottom:1px solid rgba(255,255,255,0.07);gap:1.25rem;";
});
// Close on link click (mobile)
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => { navLinks.style.cssText = ""; })
);

// ── Active nav link highlight ──
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-links a");
const activateLink = () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach((a) => {
    a.style.color = a.getAttribute("href") === `#${current}` ? "var(--accent)" : "";
  });
};
window.addEventListener("scroll", activateLink);