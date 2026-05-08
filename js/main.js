import Lenis from 'https://unpkg.com/lenis@1.1.14/dist/lenis.mjs';

// Smooth scroll

const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sticky nav — add/remove .scrolled class
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
}

// Hamburger / mobile menu toggle
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMenu(open) {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('open'));
  });
}

// Close mobile menu when any nav link or tel is tapped
document.querySelectorAll('.mobile-nav-link, .mobile-tel').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close mobile menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu(false);
});
