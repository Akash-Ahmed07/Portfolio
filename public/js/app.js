import {
  PROFILE,
  PROJECTS,
  SKILLS,
  filterProjects,
  filterSkills,
  validateContactForm,
  buildMailtoHref,
} from './portfolioData.js';

function renderProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.dataset.category = project.category;

  const meta = document.createElement('div');
  meta.className = 'meta-line';
  const categorySpan = document.createElement('span');
  categorySpan.className = 'meta-accent';
  categorySpan.textContent = project.categoryLabel;
  const dot = document.createElement('span');
  dot.setAttribute('aria-hidden', 'true');
  dot.textContent = '·';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = project.status;
  meta.append(categorySpan, dot, statusSpan);

  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.title;

  const subtitle = document.createElement('p');
  subtitle.className = 'project-subtitle';
  subtitle.textContent = project.subtitle;

  const desc = document.createElement('p');
  desc.className = 'project-desc';
  desc.textContent = project.description;

  const footer = document.createElement('div');
  footer.className = 'project-footer';

  const link = document.createElement('a');
  link.className = 'btn btn-secondary';
  link.href = project.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = project.linkLabel;

  footer.appendChild(link);
  article.append(meta, title, subtitle, desc, footer);
  return article;
}

function initProjectFilters() {
  const grid = document.getElementById('projectsGrid');
  const countEl = document.getElementById('projectsCount');
  const tabButtons = document.querySelectorAll('[data-project-filter]');
  if (!grid || !tabButtons.length) return;

  function applyFilter(category) {
    const filtered = filterProjects(PROJECTS, category);
    grid.replaceChildren(...filtered.map(renderProjectCard));

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${PROJECTS.length} items`;
    }

    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-project-filter') === category;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-project-filter') || 'all';
      applyFilter(category);
    });
  });

  applyFilter('all');
}

function renderSkillCard(skill) {
  const article = document.createElement('article');
  article.className = 'skill-card';
  article.dataset.category = skill.category;

  const header = document.createElement('div');
  header.className = 'skill-card-head';

  const titleGroup = document.createElement('div');
  const title = document.createElement('h3');
  title.className = 'skill-name';
  title.textContent = skill.name;

  const meta = document.createElement('p');
  meta.className = 'skill-meta';
  meta.textContent = `${skill.categoryLabel} · ${skill.note}`;

  titleGroup.append(title, meta);

  const percent = document.createElement('span');
  percent.className = 'skill-percent';
  percent.textContent = `${skill.level}%`;

  header.append(titleGroup, percent);

  const track = document.createElement('div');
  track.className = 'skill-track';
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-label', `${skill.name} proficiency`);
  track.setAttribute('aria-valuenow', String(skill.level));
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');

  const fill = document.createElement('div');
  fill.className = 'skill-fill';
  fill.style.width = `${skill.level}%`;
  track.appendChild(fill);

  article.append(header, track);
  return article;
}

function initSkillFilters() {
  const grid = document.getElementById('skillsGrid');
  const countEl = document.getElementById('skillsCount');
  const tabButtons = document.querySelectorAll('[data-skill-filter]');
  if (!grid || !tabButtons.length) return;

  function applyFilter(category) {
    const filtered = filterSkills(SKILLS, category);
    grid.replaceChildren(...filtered.map(renderSkillCard));

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${SKILLS.length} skills`;
    }

    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-skill-filter') === category;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-skill-filter') || 'all';
      applyFilter(category);
    });
  });

  applyFilter('all');
}

function initCertificateModal() {
  const modal = document.getElementById('certificateModal');
  const openButtons = document.querySelectorAll('[data-open-certificate]');
  const closeBtn = document.getElementById('closeCertificateModal');

  if (!modal || !openButtons.length) return;

  let lastFocused = null;

  function openModal(triggerEl) {
    lastFocused = triggerEl || document.activeElement;
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    closeBtn?.focus();
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      if (modal.open) modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn));
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });
}

function initMobileNavigation() {
  const toggleBtn = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('mobileNavDrawer');
  if (!toggleBtn || !navDrawer) return;

  function setMenuOpen(open) {
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggleBtn.classList.toggle('is-open', open);
    navDrawer.hidden = !open;
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isExpanded);
  });

  navDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  });
}

function initCopyButtons() {
  const buttons = document.querySelectorAll('[data-copy-value]');
  buttons.forEach((btn) => {
    const defaultLabel = btn.textContent?.trim() || 'Copy';
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy-value') || '';
      if (!value) return;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        }
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
      } catch {
        btn.textContent = value;
      }

      setTimeout(() => {
        btn.textContent = defaultLabel;
        btn.classList.remove('is-copied');
      }, 2000);
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formMessage');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (!form || !statusEl || !submitBtn) return;

  form.setAttribute('novalidate', 'true');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById('name')?.value ?? '',
      email: document.getElementById('email')?.value ?? '',
      subject: document.getElementById('subject')?.value ?? '',
      message: document.getElementById('message')?.value ?? '',
    };

    const validation = validateContactForm(payload);
    if (!validation.valid) {
      statusEl.textContent = validation.error;
      statusEl.className = 'form-status is-error';
      statusEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening Email Client...';

    const href = buildMailtoHref(PROFILE.email, validation.sanitized);
    const link = document.createElement('a');
    link.href = href;
    link.style.display = 'none';
    document.body.appendChild(link);
    try {
      link.click();
    } catch {
      // Headless or restricted environments may block mailto navigation
    }
    link.remove();

    statusEl.textContent = `Message prepared for ${PROFILE.email}. If your email client did not open automatically, copy the address directly on the left.`;
    statusEl.className = 'form-status is-success';
    statusEl.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    form.reset();
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initPortraitFallback() {
  const img = document.getElementById('heroPortrait');
  const fallback = document.getElementById('portraitFallback');
  if (!img || !fallback) return;

  img.addEventListener('error', () => {
    img.hidden = true;
    fallback.hidden = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initSkillFilters();
  initCertificateModal();
  initMobileNavigation();
  initCopyButtons();
  initContactForm();
  initScrollProgress();
  initPortraitFallback();
});
