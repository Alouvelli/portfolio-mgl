/**
 * navigation.js
 * Header sticky, hamburger mobile, scroll spy, barre de progression
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initScrollSpy();
  initReadingProgress();
  initSmoothScroll();
});

/* ===== HEADER STICKY ===== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== MENU HAMBURGER MOBILE ===== */
function initHamburger() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer au clic sur un lien
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* ===== SCROLL SPY — Navigation de sections ===== */
function initScrollSpy() {
  const sectionLinks = document.querySelectorAll('.nav-section-link[href^="#"]');
  const headerLinks  = document.querySelectorAll('.header-nav .nav-link[href]');
  if (!sectionLinks.length && !headerLinks.length) return;

  // Marquer la page active dans le header selon l'URL courante
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  headerLinks.forEach(link => {
    const linkFile = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkFile === currentPath);
  });

  // Scroll spy pour les ancres sur la même page
  if (!sectionLinks.length) return;

  const sections = Array.from(sectionLinks)
    .map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  const onScroll = () => {
    const scrollPos = window.scrollY + 150;
    let activeId = null;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) activeId = sec.id;
    });

    sectionLinks.forEach(link => {
      const id = link.getAttribute('href').substring(1);
      link.classList.toggle('active', id === activeId);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== BARRE DE PROGRESSION DE LECTURE ===== */
function initReadingProgress() {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;

  const onScroll = () => {
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = window.scrollY;
    const pct          = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ===== SMOOTH SCROLL ANCRES ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').substring(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72'
      );
      const offset  = target.getBoundingClientRect().top + window.scrollY - headerH - 60;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

/* ===== SIDEBAR ADMIN TOGGLE MOBILE ===== */
const adminToggle  = document.getElementById('admin-sidebar-toggle');
const adminSidebar = document.getElementById('admin-sidebar');

if (adminToggle && adminSidebar) {
  adminToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!adminSidebar.contains(e.target) && !adminToggle.contains(e.target)) {
      adminSidebar.classList.remove('open');
    }
  });
}
