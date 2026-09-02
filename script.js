const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (window.matchMedia('(min-width: 1000px)').matches) {
  window.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, .email-card, .service-row, .step').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ---------------------------------------------------------
   EMAIL PREVIEW HOVER
   Each email keeps its real/natural height.
   On Windows/desktop hover, calculate the exact distance
   needed to move from the top to the bottom of the email.
   --------------------------------------------------------- */
const emailCards = document.querySelectorAll('.email-card');

function updateEmailShift(card) {
  const img = card.querySelector('img');
  if (!img) return;

  const cardHeight = card.clientHeight;
  const imageHeight = img.getBoundingClientRect().height;

  // Only move upward when the email is taller than its preview frame.
  const shift = Math.max(0, Math.round(imageHeight - cardHeight));

  card.style.setProperty('--email-shift', `-${shift}px`);
}

function updateAllEmailShifts() {
  emailCards.forEach(card => updateEmailShift(card));
}

emailCards.forEach(card => {
  const img = card.querySelector('img');

  if (img) {
    if (img.complete) {
      updateEmailShift(card);
    } else {
      img.addEventListener('load', () => updateEmailShift(card), { once: true });
    }
  }

  card.addEventListener('mouseenter', () => {
    updateEmailShift(card);
    card.classList.add('is-email-hovered');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('is-email-hovered');
  });
});

window.addEventListener('load', updateAllEmailShifts);
window.addEventListener('resize', updateAllEmailShifts);

if ('ResizeObserver' in window) {
  const emailGrid = document.querySelector('.email-grid');
  if (emailGrid) {
    const resizeObserver = new ResizeObserver(updateAllEmailShifts);
    resizeObserver.observe(emailGrid);
  }
}

/* Smooth anchor scrolling with the sticky header offset */
function smoothScrollToTarget(target) {
  if (!target) return;
  const header = document.querySelector('.site-header');
  const offset = header ? header.getBoundingClientRect().height + 14 : 14;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"], [data-scroll-target]').forEach(link => {
  link.addEventListener('click', e => {
    const selector = link.dataset.scrollTarget || link.getAttribute('href');
    if (!selector || selector === '#') return;

    const target = document.querySelector(selector);
    if (!target) return;

    e.preventDefault();
    smoothScrollToTarget(target);

    if (history.replaceState) {
      history.replaceState(null, '', selector);
    }
  });
});

/* Scroll reveal animations */
const revealSelectors = [
  '.hero > *', '.category-strip', '.portfolio > .eyebrow', '.portfolio > h2',
  '.portfolio > .title-line', '.email-card', '.services > .eyebrow', '.services > h2',
  '.services > .section-lead', '.service-row', '.process > .eyebrow', '.process > h2',
  '.step', '.about > .eyebrow', '.about-card', '.cta > .eyebrow', '.cta-card', '.footer'
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.classList.add('scroll-reveal');

    if (selector === '.email-card' || selector === '.service-row' || selector === '.step') {
      el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    }
  });
});

const revealItems = document.querySelectorAll('.scroll-reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-visible'));
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  revealItems.forEach(el => el.classList.add('is-visible'));
}
