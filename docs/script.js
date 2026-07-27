const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
const effectiveTheme = storedTheme || (prefersDark ? 'dark' : 'light');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
  localStorage.setItem('theme', theme);
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
    const expanded = siteNav.classList.contains('active');
    navToggle.setAttribute('aria-expanded', expanded);
  });
}

const links = document.querySelectorAll('.site-nav a');
links.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
