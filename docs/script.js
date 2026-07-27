const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
const effectiveTheme = storedTheme || (prefersDark ? 'dark' : 'light');

function syncNavButton() {
  if (!navToggle) return;
  const expanded = siteNav && siteNav.classList.contains('active');
  navToggle.setAttribute('aria-expanded', String(Boolean(expanded)));
  const label = navToggle.querySelector('.nav-toggle-label');
  if (label) {
    label.textContent = expanded ? 'Close' : 'Menu';
  }
}

function applyTheme(theme) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  document.documentElement.style.colorScheme = resolvedTheme;
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', resolvedTheme === 'dark');
    const label = themeToggle.querySelector('.theme-text');
    if (label) {
      label.textContent = resolvedTheme === 'dark' ? 'Light' : 'Dark';
    }
  }
  localStorage.setItem('theme', resolvedTheme);
}

if (themeToggle) {
  applyTheme(effectiveTheme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('active');
    syncNavButton();
  });
  syncNavButton();
}

const links = document.querySelectorAll('.site-nav a');
links.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('active');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const label = navToggle.querySelector('.nav-toggle-label');
      if (label) {
        label.textContent = 'Menu';
      }
    }
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));
