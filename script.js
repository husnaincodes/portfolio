const body = document.body;
const loadingScreen = document.getElementById('loadingScreen');
const siteHeader = document.getElementById('siteHeader');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('primaryNav');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const downloadResume = document.getElementById('downloadResume');
const copyEmail = document.getElementById('copyEmail');
const contactForm = document.getElementById('contactForm');
const projectFilters = document.getElementById('projectFilters');
const projectSearch = document.getElementById('projectSearch');
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const typingText = document.getElementById('typingText');
const particles = document.getElementById('particles');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const counters = Array.from(document.querySelectorAll('[data-counter]'));
const skillBars = Array.from(document.querySelectorAll('.skill-bar'));
const navLinks = Array.from(document.querySelectorAll('.nav-panel a[href^="#"]'));
const allButtons = Array.from(document.querySelectorAll('.ripple'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const storedTheme = localStorage.getItem('portfolio-theme');

if (storedTheme === 'light' || storedTheme === 'dark') {
  body.dataset.theme = storedTheme;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    window.setTimeout(() => toast.remove(), 260);
  }, 2200);
}

function throttleScroll(fn) {
  let ticking = false;
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
      ticking = true;
    }
  };
}

function updateScrollState() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  if (siteHeader) siteHeader.classList.toggle('scrolled', scrollTop > 16);
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 700);
}

function updateActiveNav() {
  if (!navLinks.length) return;
  const offset = 160;
  let current = '';

  document.querySelectorAll('main section[id]').forEach((section) => {
    const top = section.offsetTop;
    if (window.scrollY >= top - offset) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.counter || '0');
    const duration = 1200;
    const start = performance.now();

    const step = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target.toString();
      }
    };

    window.requestAnimationFrame(step);
  });
}

function revealOnView() {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        if (entry.target.classList.contains('skill-bar')) {
          const level = Number(entry.target.dataset.level || '0');
          entry.target.style.setProperty('--skill-level', level);
        }

        if (entry.target.querySelector?.('[data-counter]')) {
          animateCounters();
        }

        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -80px 0px' });

  revealItems.forEach((item) => observer.observe(item));
  skillBars.forEach((bar) => observer.observe(bar));
}

function createParticles() {
  if (!particles) return;
  const count = prefersReducedMotion ? 6 : 18;

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${55 + Math.random() * 40}%`;
    particle.style.animationDuration = `${14 + Math.random() * 16}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.opacity = `${0.25 + Math.random() * 0.35}`;
    particle.style.transform = `scale(${0.7 + Math.random() * 1.3})`;
    particles.appendChild(particle);
  }
}

function setupTypingEffect() {
  if (!typingText) return;
  const phrases = [
    'Software Engineer',
    'UI-Focused Builder',
    'AI Product Enthusiast',
    'Automation Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      charIndex += 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        return window.setTimeout(tick, 1400);
      }
    } else {
      charIndex -= 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const delay = deleting ? 42 : 74;
    window.setTimeout(tick, delay);
  };

  typingText.textContent = '';
  tick();
}

function setupThemeToggle() {
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'dark') {
      delete body.dataset.theme;
    } else {
      body.dataset.theme = 'light';
    }
    localStorage.setItem('portfolio-theme', nextTheme);
  });
}

function setupMobileNav() {
  if (!navToggle || !navPanel) return;
  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupProjectFiltering() {
  if (!projectFilters || !projectSearch) return;
  const applyFilters = () => {
    const activeFilter = projectFilters.querySelector('.active')?.dataset.filter || 'all';
    const query = projectSearch.value.trim().toLowerCase();

    projectCards.forEach((card) => {
      const category = card.dataset.category || '';
      const title = card.dataset.title || '';
      const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
      const matchesQuery = !query || title.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
      card.classList.toggle('hidden', !(matchesFilter && matchesQuery));
    });
  };

  projectFilters.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) return;
    projectFilters.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    applyFilters();
  });

  projectSearch.addEventListener('input', applyFilters);
}

function setupTestimonials() {
  if (!testimonialCards.length || !testimonialPrev || !testimonialNext) return;
  let current = 0;

  const render = () => {
    testimonialCards.forEach((card, index) => card.classList.toggle('active', index === current));
  };

  const next = () => {
    current = (current + 1) % testimonialCards.length;
    render();
  };

  const prev = () => {
    current = (current - 1 + testimonialCards.length) % testimonialCards.length;
    render();
  };

  testimonialNext.addEventListener('click', next);
  testimonialPrev.addEventListener('click', prev);
  window.setInterval(next, 7000);
}

function setupResumeDownload() {
  if (!downloadResume) return;
  downloadResume.addEventListener('click', () => {
    const resume = `Husnain Tayab\nSoftware Engineer Portfolio\n\nSummary:\nFrontend-focused builder with experience in web development, AI tools, Python automation, dashboards, and data-driven projects.\n\nCore Skills:\nHTML, CSS, JavaScript, Python, React, Node.js, SQL, Git, Prompt Engineering\n\nContact:\nhusnaintayab47@gmail.com\nhttps://github.com/husnaincodes\nhttps://www.linkedin.com/in/husnaintayab/\n`;
    const blob = new Blob([resume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Husnain-Tayab-Resume.txt';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Resume download started.');
  });
}

function setupCopyEmail() {
  if (!copyEmail) return;
  copyEmail.addEventListener('click', async () => {
    const email = 'husnaintayab47@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard.');
    } catch {
      showToast(email);
    }
  });
}

function setupContactForm() {
  if (!contactForm) return;
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message || !email.includes('@')) {
      showToast('Please fill out all fields with a valid email.');
      return;
    }

    contactForm.reset();
    showToast('Message validated. Connect this form to EmailJS or a backend next.');
  });
}

function setupBackToTop() {
  if (!backToTop) return;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function setupButtons() {
  allButtons.forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      button.style.setProperty('--ripple-x', `${x}px`);
      button.style.setProperty('--ripple-y', `${y}px`);
      button.classList.remove('is-rippling');
      void button.offsetWidth;
      button.classList.add('is-rippling');
    });

    button.addEventListener('animationend', () => {
      button.classList.remove('is-rippling');
    });
  });
}

function setupCursorGlow() {
  if (prefersReducedMotion || !cursorGlow) return;
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function setupNavObserver() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.38 });

  sections.forEach((section) => observer.observe(section));
}

function initTiltCards() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${y * -6}deg) rotateY(${x * 8}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

window.addEventListener('scroll', throttleScroll(() => {
  updateScrollState();
  updateActiveNav();
}));

window.addEventListener('resize', updateScrollState);

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setupTypingEffect();
  setupThemeToggle();
  setupMobileNav();
  setupProjectFiltering();
  setupTestimonials();
  setupResumeDownload();
  setupCopyEmail();
  setupContactForm();
  setupBackToTop();
  setupButtons();
  setupCursorGlow();
  setupNavObserver();
  revealOnView();
  initTiltCards();
  updateScrollState();
  updateActiveNav();

  if (!prefersReducedMotion) {
    window.setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 900);
  } else {
    if (loadingScreen) loadingScreen.classList.add('hidden');
  }
});
