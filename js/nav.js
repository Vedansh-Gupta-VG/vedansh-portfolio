// ============================================================
// NAV BAR: scroll-direction morph (collapses on scroll down past
// threshold, reopens on any scroll up) + mobile hamburger menu.
// Matches css/nav.css (site-header / nav-pill / nav-dots classes).
// ============================================================

const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

const SCROLL_THRESHOLD = 120;
let lastScrollY = window.scrollY;
let navScrolling = false; // true while a nav-link click is smooth-scrolling

function handleNavScroll() {
  const currentY = window.scrollY;
  const scrollingDown = currentY > lastScrollY;

  // While a nav link is driving the smooth scroll, keep the pill open
  // so the user doesn't see it collapse during the transition.
  if (!navScrolling) {
    if (currentY > SCROLL_THRESHOLD && scrollingDown) {
      siteHeader.classList.add('scrolled');
    } else if (currentY < SCROLL_THRESHOLD || !scrollingDown) {
      siteHeader.classList.remove('scrolled');
    }
  }

  lastScrollY = currentY;
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

function openMobileMenu() {
  mobileMenu.classList.add('open');
  document.body.classList.add('menu-open');
  navToggle.classList.add('active');
  navToggle.setAttribute('aria-expanded', 'true');
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
mobileMenuClose.addEventListener('click', closeMobileMenu);

mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

document.querySelectorAll('.mmp-list a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

// --- Active-section highlighting: whichever section owns the middle
// of the viewport gets .is-active on its matching nav link. The hero
// has no nav link, so while it's the section in view every link stays
// inactive instead of "About" being highlighted by default. ---
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionMap = new Map();
navLinks.forEach(link => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionMap.set(section, link);
});

const heroSection = document.getElementById('hero');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.target === heroSection) {
      navLinks.forEach(l => l.classList.remove('is-active'));
      return;
    }

    const link = sectionMap.get(entry.target);
    if (!link) return;
    navLinks.forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sectionMap.forEach((_, section) => sectionObserver.observe(section));
if (heroSection) sectionObserver.observe(heroSection);

// --- Suppress nav collapse during smooth-scroll anchor navigation ---
// When a nav link is clicked, the smooth scroll fires many scroll events
// that look like "user scrolling down". Suppress the collapse/expand logic
// for a short window so the pill stays visible during the transition.
let _navScrollTimer;
function suppressNavDuringScroll() {
  navScrolling = true;
  siteHeader.classList.remove('scrolled');

  const checkScrollEnd = () => {
    clearTimeout(_navScrollTimer);
    _navScrollTimer = setTimeout(() => {
      navScrolling = false;
      lastScrollY = window.scrollY;
      window.removeEventListener('scroll', checkScrollEnd);
    }, 100);
  };

  // Wait a tiny bit for the smooth scroll to actually begin before
  // attaching the listener that detects when it ends.
  setTimeout(() => {
    window.addEventListener('scroll', checkScrollEnd, { passive: true });
  }, 50);
}

// Desktop pill links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener('click', suppressNavDuringScroll);
});

// Mobile menu links
document.querySelectorAll('.mmp-list a[href^="#"]').forEach(link => {
  link.addEventListener('click', suppressNavDuringScroll);
});

// Hero CTA links that point to sections (e.g. "Explore My Work → #projects")
document.querySelectorAll('.hero__ctas a[href^="#"]').forEach(link => {
  link.addEventListener('click', suppressNavDuringScroll);
});

// --- Hide navbar when footer is in view (footer already has nav links) ---
const footerEl = document.getElementById('end');
if (footerEl) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        siteHeader.classList.add('nav-hidden');
      } else {
        siteHeader.classList.remove('nav-hidden');
      }
    });
  }, { threshold: 0.15 });
  footerObserver.observe(footerEl);
}

