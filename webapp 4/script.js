/**
 * ショキゼロ LP - Main Script
 *
 * IMPORTANT: This script does NOT intercept the contact form submission.
 * The <form> uses Netlify's standard form handling:
 *   name="contact" data-netlify="true" action="thankyou.html" method="POST"
 * The browser submits the form natively via POST, Netlify processes it,
 * and the user is redirected to thankyou.html.
 */

// ========================================
// HAMBURGER MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburger.classList.toggle('active');
  });
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add('hidden');
  if (hamburger) hamburger.classList.remove('active');
}

// ========================================
// STICKY HEADER SHADOW
// ========================================
const header = document.getElementById('site-header');
function updateHeaderShadow() {
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add('shadow-md');
  } else {
    header.classList.remove('shadow-md');
  }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
      closeMobileMenu();
    }
  });
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const revealElements = document.querySelectorAll('.reveal, .problem-card, .strength-card, .flow-step, .coverage-item');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ========================================
// HERO PERSON FADE-IN ANIMATION
// ========================================
window.addEventListener('load', () => {
  const heroPerson = document.getElementById('hero-person');
  const badgeApply = document.getElementById('hero-badge-apply');
  const badgeAccept = document.getElementById('hero-badge-accept');

  if (heroPerson) {
    setTimeout(() => {
      heroPerson.classList.add('hero-person-visible');
    }, 300);
  }

  if (badgeApply) {
    setTimeout(() => {
      badgeApply.classList.add('hero-badge-visible');
    }, 1000);
  }

  if (badgeAccept) {
    setTimeout(() => {
      badgeAccept.classList.add('hero-badge-visible');
    }, 1300);
  }
});

// ========================================
// BACK TO TOP BUTTON
// ========================================
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 500) {
    backToTop.classList.add('opacity-100', 'pointer-events-auto');
    backToTop.classList.remove('opacity-0', 'pointer-events-none');
  } else {
    backToTop.classList.remove('opacity-100', 'pointer-events-auto');
    backToTop.classList.add('opacity-0', 'pointer-events-none');
  }
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// CONTACT FORM — Netlify native submission
// ========================================
// The form uses Netlify's standard data-netlify="true" attribute.
// NO JavaScript intercepts the submit event.
// Netlify handles POST → stores data → sends notification email.
// The form's action="thankyou.html" handles the redirect.
//
// The only JS here is lightweight UX: visual field-error styling
// on blur (HTML5 required + pattern still handles actual validation).
// ========================================
(function () {
  const form = document.querySelector('form[name="contact"]');
  if (!form) return;

  // Add visual error styling on blur for better UX (does NOT prevent submission)
  const fields = ['company', 'name', 'email', 'phone', 'message'];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('blur', () => {
      if (!field.value.trim() || (field.type === 'email' && !field.validity.valid)) {
        field.classList.add('field-error');
      } else {
        field.classList.remove('field-error');
      }
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('field-error')) {
        if (field.value.trim() && (field.type !== 'email' || field.validity.valid)) {
          field.classList.remove('field-error');
        }
      }
    });
  });
})();

// ========================================
// ACTIVE NAV LINK HIGHLIGHT
// ========================================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const scrollPos = window.scrollY + 100;
  let currentSection = '';
  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) currentSection = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('text-primary', 'font-bold');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('text-primary', 'font-bold');
    }
  });
}

// ========================================
// SCROLL EVENT LISTENERS
// ========================================
window.addEventListener('scroll', () => {
  updateHeaderShadow();
  updateBackToTop();
  updateActiveNav();
}, { passive: true });

// ========================================
// INIT
// ========================================
updateHeaderShadow();
updateBackToTop();

console.log('ショキゼロ LP loaded ✓');
