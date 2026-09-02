const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

const desktopPointer = window.matchMedia('(min-width: 1000px)').matches;

if (desktopPointer && dot && ring) {
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('a, .email-card, .service-row, .step').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* Scroll reveal — runs once per element and stays lightweight. */
const revealItems = document.querySelectorAll('.reveal-group, .reveal-stagger');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* Smooth anchor navigation with a small offset for the sticky header. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;

    const target = document.querySelector(selector);
    if (!target) return;

    e.preventDefault();

    const header = document.querySelector('.site-header');
    const offset = (header ? header.offsetHeight : 0) + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
});
