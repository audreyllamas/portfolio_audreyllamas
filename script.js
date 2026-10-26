'use strict';

// Keep content visible without JavaScript; enable lightweight animation when available.
document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');
function closeMenu() {
  if (!navToggle || !navLinks) return;
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
}
navToggle?.addEventListener('click', () => {
  if (!navLinks) return;
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (navLinks?.classList.contains('open') && !event.target.closest('.nav')) closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {rootMargin: '0px 0px -25px 0px', threshold: 0.05});
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Filter project cards. Hidden cards are removed from keyboard and screen-reader navigation.
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const workCards = Array.from(document.querySelectorAll('[data-category]'));
const filterStatus = document.querySelector('#filter-status');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const chosen = button.dataset.filter;
    let count = 0;
    workCards.forEach(card => {
      const matches = chosen === 'all' || card.dataset.category === chosen;
      card.hidden = !matches;
      if (matches) count++;
    });
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (filterStatus) filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
  });
});

// Accessible image preview: restores focus to the launching control on close.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
const closeButton = lightbox?.querySelector('.lightbox-close');
let returnFocusTo = null;
function closeLightbox() {
  if (!lightbox?.classList.contains('open')) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lightboxImage) lightboxImage.removeAttribute('src');
  returnFocusTo?.focus();
}
document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    returnFocusTo = button;
    lightboxImage.src = button.dataset.lightbox;
    const preview = button.querySelector('img');
    lightboxImage.alt = preview?.alt || button.getAttribute('aria-label') || 'Expanded project preview';
    lightboxCaption.textContent = button.dataset.caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  });
});
closeButton?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => {if (event.target === lightbox) closeLightbox();});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeLightbox(); closeMenu(); }
  if (event.key === 'Tab' && lightbox?.classList.contains('open')) {
    // Only one interactive element belongs to the modal: keep keyboard focus there.
    event.preventDefault();
    closeButton?.focus();
  }
});

// Email copy requires a secure browser context; use a friendly fallback otherwise.
const copyEmail = document.querySelector('#copy-email');
const copyFeedback = document.querySelector('#copy-feedback');
copyEmail?.addEventListener('click', async () => {
  const email = 'audreyllamas2603@gmail.com';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    if (copyFeedback) copyFeedback.textContent = 'Email address copied!';
  } catch (_) {
    if (copyFeedback) copyFeedback.textContent = `Copy this email: ${email}`;
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
