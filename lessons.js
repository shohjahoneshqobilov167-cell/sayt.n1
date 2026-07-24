// LevelX — Lessons Library Page Controller

const LS_KEYS = {
  PROGRESS:  'levelx_lesson_progress',
  FAVORITES: 'levelx_lesson_favorites',
  STREAK:    'levelx_streak',
  STREAK_DATE:'levelx_streak_date',
  WATCHING:  'levelx_watching'
};

// ── Storage helpers ──────────────────────────────────────────────────────────
function getProgress()  { return JSON.parse(localStorage.getItem(LS_KEYS.PROGRESS)  || '{}'); }
function getFavorites() { return JSON.parse(localStorage.getItem(LS_KEYS.FAVORITES) || '[]'); }
function getWatching()  { return JSON.parse(localStorage.getItem(LS_KEYS.WATCHING)  || '[]'); }

function isCompleted(id) { return !!getProgress()[id]; }
function isFavorite(id)  { return getFavorites().includes(id); }

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx  = favs.indexOf(id);
  if (idx === -1) favs.push(id); else favs.splice(idx, 1);
  localStorage.setItem(LS_KEYS.FAVORITES, JSON.stringify(favs));
  return idx === -1;
}

function getStreak() {
  const last  = localStorage.getItem(LS_KEYS.STREAK_DATE);
  const today = new Date().toDateString();
  const count = parseInt(localStorage.getItem(LS_KEYS.STREAK) || '0');
  if (!last) return count;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (last === today) return count;
  if (last === yesterday.toDateString()) return count;
  return 0;
}

// ── State ────────────────────────────────────────────────────────────────────
let allLessons = [];
let filteredLessons = [];
let activeFilters = { level: 'all', skill: 'all', teacher: 'all' };
let activeSort = 'newest';
let searchQuery = '';

const LEVEL_ORDER = { A1:1, A2:2, B1:3, B2:4, C1:5, C2:6 };
const SKILL_EMOJI = { grammar:'📝', vocabulary:'📖', speaking:'🗣', listening:'👂', reading:'📰', writing:'✍️' };
const SKILL_LABELS = { grammar:'Grammatika', vocabulary:"Lug'at", speaking:'Gapirish', listening:'Tinglash', reading:"O'qish", writing:'Yozish' };

// Safe wrapper — lessons-data.js exposes window.formatDate; use it or fall back
function _formatDate(iso) {
  if (window.formatDate) return window.formatDate(iso);
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' });
}

// ── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  setupAuthUI();
  setupFilters();
  setupSearch();
  updateStreakDisplay();

  // Load lessons
  const data = await window.fetchAllLessons();
  allLessons  = data.flatMap(d => d.lessons || []);
  filteredLessons = [...allLessons];

  // Update hero stats
  document.getElementById('stat-total-lessons').textContent = allLessons.length;
  document.getElementById('stat-completed').textContent =
    allLessons.filter(l => isCompleted(l.id)).length;

  applyFiltersAndRender();
  renderContinueWatching();
  renderFavorites();
  renderCertProgress();

  // Reveal animations
  document.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
});

// ── Auth UI ──────────────────────────────────────────────────────────────────
function setupAuthUI() {
  const user = State.getCurrentUser();
  const container = document.getElementById('auth-buttons-container');
  if (!container) return;
  if (user) {
    if (user.email === 'admin@test.com')
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    container.innerHTML = `
      <a href="profile.html" class="nav-avatar-pill" aria-label="Profil">
        <span class="nav-avatar-badge">${user.firstName.charAt(0).toUpperCase()}</span>
        <span class="nav-avatar-name">${user.firstName}</span>
      </a>
      <button id="lessons-logout-btn" class="btn btn-danger btn-sm">${window.i18n.t('nav.logout')}</button>`;
    document.getElementById('lessons-logout-btn').addEventListener('click', () => {
      State.logout(); window.location.reload();
    });
  } else {
    container.innerHTML = `<a href="auth.html" class="btn btn-secondary btn-sm">${window.i18n.t('nav.login')}</a>`;
  }
}

// ── Filters ──────────────────────────────────────────────────────────────────
function setupFilters() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-filter');
      const val   = btn.getAttribute('data-value');
      // Deactivate siblings
      document.querySelectorAll(`.filter-chip[data-filter="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters[group] = val;
      applyFiltersAndRender();
    });
  });

  document.getElementById('sort-select').addEventListener('change', e => {
    activeSort = e.target.value;
    applyFiltersAndRender();
  });

  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('clear-search-btn')?.addEventListener('click', resetFilters);
  document.getElementById('see-all-continue')?.addEventListener('click', e => { e.preventDefault(); resetFilters(); });
  document.getElementById('see-all-favorites')?.addEventListener('click', e => { e.preventDefault(); resetFilters(); });
}

function resetFilters() {
  activeFilters = { level: 'all', skill: 'all', teacher: 'all' };
  searchQuery   = '';
  document.getElementById('lessons-search').value = '';
  document.getElementById('search-clear').style.display = 'none';
  document.querySelectorAll('.filter-chip').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-value') === 'all');
  });
  document.getElementById('sort-select').value = 'newest';
  activeSort = 'newest';
  applyFiltersAndRender();
}

// ── Search ───────────────────────────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('lessons-search');
  const clear = document.getElementById('search-clear');
  input.addEventListener('input', () => {
    searchQuery = input.value.toLowerCase().trim();
    clear.style.display = searchQuery ? 'block' : 'none';
    applyFiltersAndRender();
  });
  clear.addEventListener('click', () => {
    input.value = ''; searchQuery = ''; clear.style.display = 'none';
    applyFiltersAndRender();
  });
}

// ── Core filter + sort + render ───────────────────────────────────────────────
function applyFiltersAndRender() {
  let list = [...allLessons];

  if (searchQuery) {
    list = list.filter(l =>
      l.title.toLowerCase().includes(searchQuery) ||
      l.description.toLowerCase().includes(searchQuery) ||
      l.channelName.toLowerCase().includes(searchQuery) ||
      (l.tags || []).some(t => t.toLowerCase().includes(searchQuery))
    );
  }
  if (activeFilters.level  !== 'all') list = list.filter(l => l.level === activeFilters.level);
  if (activeFilters.skill  !== 'all') list = list.filter(l => (l.skills || []).includes(activeFilters.skill));
  if (activeFilters.teacher !== 'all') list = list.filter(l => l.channelId === activeFilters.teacher);

  // Sort
  list.sort((a, b) => {
    if (activeSort === 'newest')     return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (activeSort === 'popular')    return b.viewCount - a.viewCount;
    if (activeSort === 'az')         return a.title.localeCompare(b.title);
    if (activeSort === 'level-asc')  return (LEVEL_ORDER[a.level] || 0) - (LEVEL_ORDER[b.level] || 0);
    if (activeSort === 'level-desc') return (LEVEL_ORDER[b.level] || 0) - (LEVEL_ORDER[a.level] || 0);
    return 0;
  });

  filteredLessons = list;
  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = `${list.length} dars topildi`;

  renderLessonsGrid(list);
}

// ── Render grid ───────────────────────────────────────────────────────────────
function renderLessonsGrid(lessons) {
  const grid  = document.getElementById('lessons-grid');
  const empty = document.getElementById('lessons-empty');

  if (!grid) return;

  // Remove skeletons
  grid.querySelectorAll('.lesson-card-skeleton').forEach(s => s.remove());

  if (lessons.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'flex';
    return;
  }
  grid.style.display = 'grid';
  empty.style.display = 'none';
  grid.innerHTML = lessons.map(buildLessonCard).join('');

  // Bind card events
  grid.querySelectorAll('.lesson-card').forEach(card => {
    const id = card.getAttribute('data-id');
    card.querySelector('.lesson-watch-btn')?.addEventListener('click', () => openLesson(id));
    card.querySelector('.lesson-fav-btn')?.addEventListener('click', e => {
      e.stopPropagation(); handleFavToggle(id, card);
    });
    card.querySelector('.lesson-complete-btn')?.addEventListener('click', e => {
      e.stopPropagation(); handleCompleteToggle(id, card);
    });
    card.querySelector('.lesson-card-thumb')?.addEventListener('click', () => openLesson(id));
  });
}

function buildLessonCard(lesson) {
  const completed = isCompleted(lesson.id);
  const fav       = isFavorite(lesson.id);
  const skills    = (lesson.skills || ['grammar']).map(s =>
    `<span class="skill-tag skill-${s}">${SKILL_EMOJI[s] || ''} ${SKILL_LABELS[s] || s}</span>`
  ).join('');

  return `
  <article class="lesson-card glass-card ${completed ? 'is-completed' : ''}" data-id="${lesson.id}">
    <div class="lesson-card-thumb-wrap">
      <img class="lesson-card-thumb" src="${lesson.thumbnail}" alt="${lesson.title}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${lesson.id}/480/270'">
      <div class="lesson-card-overlay">
        <button class="play-btn-overlay">▶</button>
      </div>
      <span class="lesson-duration-badge">${lesson.duration}</span>
      <span class="lvl-badge lvl-badge-${lesson.level} lesson-level-badge">${lesson.level}</span>
      ${completed ? '<span class="lesson-completed-badge">✅ Tugatildi</span>' : ''}
    </div>
    <div class="lesson-card-body">
      <div class="lesson-card-skills">${skills}</div>
      <h3 class="lesson-card-title">${lesson.title}</h3>
      <div class="lesson-card-teacher">
        <span class="teacher-avatar-sm" style="background:${lesson.teacherColor}20;color:${lesson.teacherColor}">${lesson.teacherAvatar}</span>
        <span>${lesson.channelName}</span>
      </div>
      <div class="lesson-card-stats">
        <span>👁 ${lesson.views}</span>
        <span>📅 ${formatDate(lesson.publishedAt)}</span>
      </div>
      <div class="lesson-card-progress">
        <div class="mini-progress-bar">
          <div class="mini-progress-fill" style="width:${completed ? 100 : 0}%"></div>
        </div>
      </div>
      <div class="lesson-card-actions">
        <button class="btn btn-primary btn-sm lesson-watch-btn">▶ Ko'rish</button>
        <button class="lesson-fav-btn ${fav ? 'is-fav' : ''}" title="Sevimlilarga">
          ${fav ? '❤️' : '🤍'}
        </button>
        <button class="lesson-complete-btn ${completed ? 'is-done' : ''}" title="Tugatildi">
          ${completed ? '✅' : '⬜'}
        </button>
      </div>
    </div>
  </article>`;
}

// ── Open lesson ───────────────────────────────────────────────────────────────
function openLesson(id) {
  // Track in watching history
  const watching = getWatching().filter(w => w !== id);
  watching.unshift(id);
  localStorage.setItem(LS_KEYS.WATCHING, JSON.stringify(watching.slice(0, 20)));

  // Update streak
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(LS_KEYS.STREAK_DATE);
  if (lastDate !== today) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const streak = lastDate === yesterday.toDateString()
      ? (parseInt(localStorage.getItem(LS_KEYS.STREAK) || '0') + 1) : 1;
    localStorage.setItem(LS_KEYS.STREAK, streak);
    localStorage.setItem(LS_KEYS.STREAK_DATE, today);
  }

  window.location.href = `lesson-player.html?id=${id}`;
}

// ── Fav / Complete toggles ────────────────────────────────────────────────────
function handleFavToggle(id, card) {
  const added = toggleFavorite(id);
  const btn   = card.querySelector('.lesson-fav-btn');
  if (btn) { btn.textContent = added ? '❤️' : '🤍'; btn.classList.toggle('is-fav', added); }
  renderFavorites();
}

function handleCompleteToggle(id, card) {
  const prog = getProgress();
  const done = !prog[id];
  if (done) prog[id] = { completedAt: new Date().toISOString(), progress: 100 };
  else delete prog[id];
  localStorage.setItem(LS_KEYS.PROGRESS, JSON.stringify(prog));

  const btn = card.querySelector('.lesson-complete-btn');
  if (btn) { btn.textContent = done ? '✅' : '⬜'; btn.classList.toggle('is-done', done); }
  card.classList.toggle('is-completed', done);

  const fill = card.querySelector('.mini-progress-fill');
  if (fill) fill.style.width = done ? '100%' : '0%';

  document.getElementById('stat-completed').textContent =
    allLessons.filter(l => isCompleted(l.id)).length;
  renderCertProgress();
}

// ── Continue Watching ─────────────────────────────────────────────────────────
function renderContinueWatching() {
  const ids = getWatching();
  if (!ids.length) return;
  const lessons = ids.map(id => allLessons.find(l => l.id === id)).filter(Boolean).slice(0, 8);
  if (!lessons.length) return;

  const section = document.getElementById('continue-section');
  const row     = document.getElementById('continue-row');
  section.style.display = 'block';
  row.innerHTML = lessons.map(l => buildScrollCard(l)).join('');
  row.querySelectorAll('.scroll-card').forEach(card => {
    card.addEventListener('click', () => openLesson(card.getAttribute('data-id')));
  });
}

// ── Favorites ─────────────────────────────────────────────────────────────────
function renderFavorites() {
  const favIds  = getFavorites();
  if (!favIds.length) return;
  const lessons = favIds.map(id => allLessons.find(l => l.id === id)).filter(Boolean);
  if (!lessons.length) return;

  const section = document.getElementById('favorites-section');
  const row     = document.getElementById('favorites-row');
  section.style.display = 'block';
  row.innerHTML = lessons.map(l => buildScrollCard(l)).join('');
  row.querySelectorAll('.scroll-card').forEach(card => {
    card.addEventListener('click', () => openLesson(card.getAttribute('data-id')));
  });
}

function buildScrollCard(lesson) {
  return `
  <div class="scroll-card glass-card" data-id="${lesson.id}">
    <img src="${lesson.thumbnail}" alt="${lesson.title}" onerror="this.src='https://picsum.photos/seed/${lesson.id}/480/270'">
    <div class="scroll-card-info">
      <span class="lvl-badge lvl-badge-${lesson.level}">${lesson.level}</span>
      <p>${lesson.title}</p>
      <small>${lesson.channelName} · ${lesson.duration}</small>
    </div>
  </div>`;
}

// ── Streak display ────────────────────────────────────────────────────────────
function updateStreakDisplay() {
  const streak = getStreak();
  const el = document.getElementById('stat-streak');
  if (el) el.textContent = `${streak}🔥`;
}

// ── Certificate progress ──────────────────────────────────────────────────────
function renderCertProgress() {
  const grid = document.getElementById('cert-levels-grid');
  if (!grid) return;
  const levels = ['A1','A2','B1','B2','C1','C2'];
  const progress = getProgress();

  grid.innerHTML = levels.map(lvl => {
    const total = allLessons.filter(l => l.level === lvl).length;
    const done  = allLessons.filter(l => l.level === lvl && progress[l.id]).length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
    return `
    <div class="cert-level-card glass-card">
      <div class="cert-level-top">
        <span class="lvl-badge lvl-badge-${lvl}">${lvl}</span>
        <span class="cert-pct lvl-text-${lvl}">${pct}%</span>
      </div>
      <div class="cert-progress-bar">
        <div class="cert-progress-fill lvl-progress-${lvl}" style="width:${pct}%"></div>
      </div>
      <small>${done} / ${total} dars</small>
      ${pct === 100 ? '<div class="cert-badge">🏆 Sertifikat olindi!</div>' : ''}
    </div>`;
  }).join('');
}
