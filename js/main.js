// Sticky nav — add/remove .scrolled class
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
}

// Hamburger / mobile menu toggle
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

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

if (mobileClose) {
  mobileClose.addEventListener('click', () => toggleMenu(false));
}

// Close mobile menu when any nav link or tel is tapped
document.querySelectorAll('.mobile-nav-link, .mobile-tel').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close mobile menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu(false);
});

// Contact form — send via Resend API
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');
const btnSubmit   = document.getElementById('btn-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name     = document.getElementById('name').value.trim();
    const telefon  = document.getElementById('telefon').value.trim();
    const email    = document.getElementById('email').value.trim();
    const nachricht = document.getElementById('nachricht').value.trim();

    if (!name || !telefon || !email || !nachricht) {
      showStatus('Bitte alle Pflichtfelder ausfüllen.', 'error');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Wird gesendet…';
    formStatus.innerHTML = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, telefon, email, nachricht }),
      });

      const data = await res.json();

      if (res.ok) {
        showStatus('Vielen Dank! Ihre Anfrage wurde gesendet. Ich melde mich so bald wie möglich.', 'success');
        contactForm.reset();
      } else {
        showStatus(data.error || 'Fehler beim Senden. Bitte versuchen Sie es erneut.', 'error');
      }
    } catch {
      showStatus('Verbindungsfehler. Bitte versuchen Sie es erneut.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Anfrage absenden';
    }
  });
}

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = 'form-status form-status--' + type;
}
