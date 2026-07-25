const langData = {
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من أنا",
    nav_skills: "المهارات",
    nav_projects: "المشاريع",
    nav_contact: "التواصل",
    hero_greeting: "مرحباً، أنا",
    hero_cta1: "عرض المشاريع",
    hero_cta2: "تواصل معي",
    scroll_down: "اسحب للأسفل",
    about_title: "من أنا",
    about_subtitle: "تعرف عليّ أكثر",
    tag_remote: "Remote",
    tag_available: "متاح للعمل",
    stat_experience: "سنوات خبرة",
    stat_projects: "مشروع",
    skills_title: "المهارات",
    skills_subtitle: "التقنيات والأدوات التي أستخدمها",
    projects_title: "المشاريع",
    projects_subtitle: "أبرز مشاريعي وتقنياتي",
    filter_all: "الكل",
    filter_featured: "المميزة",
    contact_title: "التواصل",
    contact_subtitle: "تواصل معي لأي استفسار",
    project_github: "GitHub",
    project_demo: "معاينة",
    footer_rights: "جميع الحقوق محفوظة.",
    hero_bio_default: "مطور ويب متخصص في بناء APIs وتطبيقات الويب باستخدام Laravel و Express.js. أحب بناء حلول تقنية مبتكرة وتحسين أداء التطبيقات.",
    page_prev: "السابق",
    page_next: "التالي"
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_contact: "Contact",
    hero_greeting: "Hello, I'm",
    hero_cta1: "View Projects",
    hero_cta2: "Contact Me",
    scroll_down: "Scroll Down",
    about_title: "About Me",
    about_subtitle: "Get to know me better",
    tag_remote: "Remote",
    tag_available: "Available for Work",
    stat_experience: "Years Experience",
    stat_projects: "Projects",
    skills_title: "Skills",
    skills_subtitle: "Technologies and tools I use",
    projects_title: "Projects",
    projects_subtitle: "My featured projects and technologies",
    filter_all: "All",
    filter_featured: "Featured",
    contact_title: "Contact",
    contact_subtitle: "Get in touch for any inquiries",
    project_github: "GitHub",
    project_demo: "Demo",
    footer_rights: "All rights reserved.",
    hero_bio_default: "Web developer specialized in building APIs and web applications using Laravel, Express.js. I love building innovative technical solutions and optimizing application performance.",
    page_prev: "Prev",
    page_next: "Next"
  }
};

const svgIcons = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
};

let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';
let portfolioData = null;
let currentFilter = 'all';
let currentProjectPage = 1;
let filteredProjects = [];
const PROJECTS_PER_PAGE = 2;
let typingTimeout;
let deleteTimeout;

document.addEventListener('DOMContentLoaded', () => {
  if (window.__PORTFOLIO_DATA__) {
    portfolioData = window.__PORTFOLIO_DATA__;
    renderAll();
  } else {
    fetch('data/portfolio.json')
      .then(r => r.json())
      .then(data => { portfolioData = data; renderAll(); })
      .catch(err => console.error('Failed to load portfolio data:', err));
  }

  setTheme(currentTheme);
  setupHamburger();
  setupThemeToggle();
  setupLangToggle();
  setupScrollAnimations();
});

function renderAll() {
  if (!portfolioData) return;
  setLang(currentLang);
  renderSkills();
  renderProjects(currentFilter);
  renderContact();
  renderFooter();
  setupFilter();
  startTypingEffect();
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';

  const t = langData[lang];
  const p = portfolioData.profile;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });

  const heroName = document.getElementById('heroName');
  if (heroName) heroName.textContent = p.name;

  const heroBio = document.getElementById('heroBio');
  if (heroBio) heroBio.textContent = p.bio[lang] || t.hero_bio_default;

  const aboutName = document.getElementById('aboutName');
  if (aboutName) aboutName.textContent = p.name;

  const aboutRole = document.getElementById('aboutRole');
  if (aboutRole) aboutRole.textContent = p.title[lang] || '';

  const aboutBio = document.getElementById('aboutBio');
  if (aboutBio) aboutBio.textContent = p.bio[lang] || '';
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid || !portfolioData.skills) return;

  grid.innerHTML = portfolioData.skills.map(skill => `
    <div class="skill-card glass fade-up">
      <div class="skill-header">
        <div class="skill-icon">${skill.name.substring(0, 2)}</div>
        <div><div class="skill-name">${skill.name}</div></div>
      </div>
      <div class="skill-desc">${skill.description[currentLang] || ''}</div>
      <div class="skill-bar-bg"><div class="skill-bar-fill" data-level="${skill.level}"></div></div>
      <div class="skill-percent">${skill.level}%</div>
    </div>
  `).join('');

  setupSkillBarAnimations();
}

function nl2br(str) {
  if (!str) return '';
  return str
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function renderProjects(filter) {
  const grid = document.getElementById('projectsGrid');
  const pagination = document.getElementById('projectsPagination');
  if (!grid || !portfolioData.projects) return;

  currentFilter = filter;
  currentProjectPage = 1;
  filteredProjects = portfolioData.projects;
  if (filter === 'featured') filteredProjects = filteredProjects.filter(p => p.featured);

  renderProjectPage();
}

function renderProjectPage() {
  const grid = document.getElementById('projectsGrid');
  const pag = document.getElementById('projectsPagination');

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const start = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
  const pageProjects = filteredProjects.slice(start, start + PROJECTS_PER_PAGE);

  grid.innerHTML = pageProjects.map(project => {
    const desc = project.description[currentLang] || '';
    return `
    <div class="project-card glass fade-up">
      <div class="project-img">
        <div class="project-img-icon">🚀</div>
        ${project.featured ? `<div class="project-featured">★ ${langData[currentLang].filter_featured}</div>` : ''}
      </div>
      <div class="project-body">
        <h3 class="project-title">${project.title[currentLang] || ''}</h3>
        <div class="project-desc">${nl2br(desc)}</div>
        <div class="project-techs">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank">↗ ${langData[currentLang].project_github}</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank">↗ ${langData[currentLang].project_demo}</a>` : ''}
        </div>
      </div>
    </div>
    `;
  }).join('');

  if (pag) {
    if (totalPages <= 1) {
      pag.innerHTML = '';
    } else {
      pag.innerHTML = `
        <button class="page-btn" id="pagePrev" ${currentProjectPage === 1 ? 'disabled' : ''}>← ${langData[currentLang].page_prev}</button>
        <span class="page-info">${currentProjectPage} / ${totalPages}</span>
        <button class="page-btn" id="pageNext" ${currentProjectPage === totalPages ? 'disabled' : ''}>${langData[currentLang].page_next} →</button>
      `;
      document.getElementById('pagePrev').addEventListener('click', () => {
        if (currentProjectPage > 1) { currentProjectPage--; renderProjectPage(); }
      });
      document.getElementById('pageNext').addEventListener('click', () => {
        if (currentProjectPage < totalPages) { currentProjectPage++; renderProjectPage(); }
      });
    }
  }

  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  });
}

function renderContact() {
  const container = document.getElementById('contactInfo');
  if (!container || !portfolioData.profile) return;

  const p = portfolioData.profile;
  const linkedinUrl = p.linkedin && !p.linkedin.startsWith('http') ? 'https://' + p.linkedin : p.linkedin;

  container.innerHTML = `
    <div class="contact-card glass fade-up">
      <div class="contact-card-icon">${svgIcons.email}</div>
      <div>
        <div class="contact-card-title">Email</div>
        <div class="contact-card-value"><a href="mailto:${p.email}">${p.email}</a></div>
      </div>
    </div>
    <div class="contact-card glass fade-up">
      <div class="contact-card-icon">${svgIcons.github}</div>
      <div>
        <div class="contact-card-title">GitHub</div>
        <div class="contact-card-value"><a href="${p.github}" target="_blank">${p.github.replace('https://', '')}</a></div>
      </div>
    </div>
    <div class="contact-card glass fade-up">
      <div class="contact-card-icon">${svgIcons.linkedin}</div>
      <div>
        <div class="contact-card-title">LinkedIn</div>
        <div class="contact-card-value"><a href="${linkedinUrl}" target="_blank">${p.linkedin}</a></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  });
}

function renderFooter() {
  const container = document.getElementById('footerSocial');
  if (!container || !portfolioData.profile) return;

  const p = portfolioData.profile;
  const linkedinUrl = p.linkedin && !p.linkedin.startsWith('http') ? 'https://' + p.linkedin : p.linkedin;

  container.innerHTML = `
    <a href="${p.github}" target="_blank" aria-label="GitHub">${svgIcons.github}</a>
    <a href="${linkedinUrl}" target="_blank" aria-label="LinkedIn">${svgIcons.linkedin}</a>
    <a href="mailto:${p.email}" aria-label="Email">${svgIcons.email}</a>
  `;
}

function setupFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  });
}

function startTypingEffect() {
  const el = document.getElementById('heroTitle');
  if (!el || !portfolioData.profile) return;

  const title = portfolioData.profile.title[currentLang] || '';
  if (!title) return;

  let charIdx = 0;
  let deleting = false;

  clearTimeout(typingTimeout);
  clearTimeout(deleteTimeout);
  el.innerHTML = '<span class="cursor">|</span>';

  function type() {
    if (!deleting) {
      el.innerHTML = title.substring(0, charIdx + 1) + '<span class="cursor">|</span>';
      charIdx++;
      if (charIdx === title.length) {
        setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
      typingTimeout = setTimeout(type, 60);
    } else {
      el.innerHTML = title.substring(0, charIdx - 1) + '<span class="cursor">|</span>';
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        setTimeout(type, 500);
        return;
      }
      deleteTimeout = setTimeout(type, 30);
    }
  }

  setTimeout(type, 1000);
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  const aboutStats = document.getElementById('aboutStats');
  if (aboutStats) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCountUp();
          statsObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(aboutStats);
  }
}

function setupSkillBarAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-level') + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-bar-fill').forEach(el => observer.observe(el));
}

function animateCountUp() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = '+' + current;
    }, 30);
  });
}

function setupHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
}

function setupThemeToggle() {
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }
}

function setupLangToggle() {
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setLang(currentLang === 'ar' ? 'en' : 'ar');
    });
  }
}
