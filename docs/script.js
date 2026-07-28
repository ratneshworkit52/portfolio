const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (_error) {
    return null;
  }
}

const prefersDark = getPreferredTheme();
const storedTheme = getStoredTheme();
const effectiveTheme = storedTheme || prefersDark;

function syncNavButton() {
  if (!navToggle) return;
  const expanded = siteNav && siteNav.classList.contains('active');
  navToggle.setAttribute('aria-expanded', String(Boolean(expanded)));
  const label = navToggle.querySelector('.nav-toggle-label');
  if (label) {
    label.textContent = expanded ? 'Close' : 'Menu';
  }
}

function closeNavMenu() {
  if (siteNav) {
    siteNav.classList.remove('active');
  }
  syncNavButton();
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
  try {
    localStorage.setItem('theme', resolvedTheme);
  } catch (_error) {
    // Ignore storage failures in private or blocked contexts.
  }
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
    const shouldOpen = !siteNav.classList.contains('active');
    siteNav.classList.toggle('active', shouldOpen);
    syncNavButton();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNavMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      closeNavMenu();
    }
  });

  syncNavButton();
}

const links = document.querySelectorAll('.site-nav a');
links.forEach((link) => {
  link.addEventListener('click', () => {
    closeNavMenu();
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
