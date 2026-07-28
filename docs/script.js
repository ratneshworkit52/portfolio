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

const assistantToggle = document.getElementById('assistantToggle');
const assistantPanel = document.getElementById('assistantPanel');
const assistantClose = document.getElementById('assistantClose');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const assistantMessages = document.getElementById('assistantMessages');
const assistantChips = document.querySelectorAll('.assistant-chip');

function addAssistantMessage(message, isUser = false) {
  if (!assistantMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `assistant-bubble ${isUser ? 'assistant-bubble-user' : 'assistant-bubble-bot'}`;
  bubble.textContent = message;
  assistantMessages.appendChild(bubble);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function getAssistantReply(question) {
  const normalized = question.toLowerCase();

  if (normalized.includes('stack') || normalized.includes('technology') || normalized.includes('skills')) {
    return 'I work across React, Angular, TypeScript, Node.js, AWS, and AI-assisted delivery patterns for enterprise products.';
  }

  if (normalized.includes('year') || normalized.includes('experience')) {
    return 'I bring 11+ years of experience building banking, finance, healthcare, and e-commerce applications for enterprise clients.';
  }

  if (normalized.includes('contact') || normalized.includes('reach') || normalized.includes('email') || normalized.includes('whatsapp')) {
    return 'You can email me at ratneshwork.it52@gmail.com or reach out on WhatsApp at +91 81800 10403.';
  }

  if (normalized.includes('hire') || normalized.includes('availability') || normalized.includes('opportunity')) {
    return 'I am open to senior engineering, architecture, and full-stack leadership conversations for impactful product teams.';
  }

  return 'I can help with my experience, stack, and availability. Try asking about React, AWS, architecture, or how to contact me.';
}

function setAssistantOpen(isOpen) {
  if (!assistantPanel || !assistantToggle) return;
  assistantPanel.hidden = !isOpen;
  assistantToggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen && assistantInput) {
    assistantInput.focus();
  }
}

if (assistantToggle && assistantPanel) {
  assistantToggle.addEventListener('click', () => {
    setAssistantOpen(assistantPanel.hidden);
  });

  if (assistantClose) {
    assistantClose.addEventListener('click', () => {
      setAssistantOpen(false);
    });
  }

  assistantChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question') || '';
      if (!question) return;
      addAssistantMessage(question, true);
      addAssistantMessage(getAssistantReply(question));
    });
  });

  if (assistantForm) {
    assistantForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = assistantInput ? assistantInput.value.trim() : '';
      if (!question) return;
      addAssistantMessage(question, true);
      addAssistantMessage(getAssistantReply(question));
      if (assistantInput) {
        assistantInput.value = '';
        assistantInput.focus();
      }
    });
  }
}

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
