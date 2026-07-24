// LevelX — Lesson Player Page Controller

const PL_KEYS = {
  PROGRESS:   'levelx_lesson_progress',
  FAVORITES:  'levelx_lesson_favorites',
  BOOKMARKS:  'levelx_bookmarks',
  NOTES:      'levelx_notes',
  WATCHING:   'levelx_watching'
};

const SKILL_EMOJI  = { grammar:'📝', vocabulary:'📖', speaking:'🗣', listening:'👂', reading:'📰', writing:'✍️' };
const SKILL_LABELS = { grammar:'Grammatika', vocabulary:"Lug'at", speaking:'Gapirish', listening:'Tinglash', reading:"O'qish", writing:'Yozish' };

let allLessons   = [];
let currentLesson = null;
let currentIndex  = 0;
let ytPlayer      = null;
let progressTimer = null;

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const params   = new URLSearchParams(window.location.search);
  const lessonId = params.get('id');
  if (!lessonId) { window.location.href = 'lessons.html'; return; }

  const data  = await window.fetchAllLessons();
  allLessons  = data.flatMap(d => d.lessons || []);
  currentIndex = allLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) { window.location.href = 'lessons.html'; return; }
  currentLesson = allLessons[currentIndex];

  renderLessonInfo(currentLesson);
  renderPlaylist();
  loadYouTubePlayer(currentLesson.id);
  setupControls();
  loadNotes(currentLesson.id);
  loadBookmarks(currentLesson.id);
  updateFavBtn();
  updateCompleteBtn();
});

// ── Lesson Info ───────────────────────────────────────────────────────────────
function renderLessonInfo(lesson) {
  document.getElementById('player-lesson-title').textContent       = lesson.title;
  document.getElementById('player-lesson-title-short').textContent = lesson.title.slice(0, 50) + (lesson.title.length > 50 ? '…' : '');
  document.getElementById('player-views').textContent              = `${lesson.views} ko'rishlar`;
  document.getElementById('player-date').textContent               = formatDate(lesson.publishedAt);
  document.getElementById('player-teacher-name').textContent       = lesson.channelName;
  document.getElementById('player-teacher-avatar').textContent     = lesson.teacherAvatar;
  document.getElementById('player-teacher-avatar').style.background = `${lesson.teacherColor}20`;
  document.getElementById('player-teacher-avatar').style.color      = lesson.teacherColor;
  document.getElementById('player-description').textContent        = lesson.description;

  const badge = document.getElementById('player-level-badge');
  badge.textContent = lesson.level;
  badge.className   = `lvl-badge lvl-badge-${lesson.level}`;

  const skillsEl = document.getElementById('player-skill-tags');
  skillsEl.innerHTML = (lesson.skills || []).map(s =>
    `<span class="skill-tag skill-${s}">${SKILL_EMOJI[s] || ''} ${SKILL_LABELS[s] || s}</span>`
  ).join('');

  const channelMap = {
    'UCazamqahramoniy':      'https://youtube.com/@azamqahramoniy',
    'UCnsflamultilevelhub':  'https://youtube.com/@nsflamultilevelhub',
    'UCabdulloh_john_ruziev':'https://youtube.com/@abdulloh_john_ruziev'
  };
  document.getElementById('player-channel-link').href = channelMap[lesson.channelId] || '#';

  document.title = `${lesson.title} — LevelX`;
  updateProgressDisplay(lesson.id);
}

function updateProgressDisplay(id) {
  const prog = JSON.parse(localStorage.getItem(PL_KEYS.PROGRESS) || '{}');
  const pct  = prog[id] ? 100 : 0;
  document.getElementById('player-progress-fill').style.width = `${pct}%`;
  document.getElementById('player-progress-label').textContent = `${pct}% tugatildi`;
}

// ── YouTube Player ────────────────────────────────────────────────────────────
function loadYouTubePlayer(videoId) {
  // Remove placeholder
  const placeholder = document.getElementById('player-placeholder');
  if (placeholder) placeholder.style.display = 'none';

  // Check if it's a real YouTube ID (not mock)
  const isMockId = videoId.startsWith('aq_') || videoId.startsWith('ns_') || videoId.startsWith('ab_');

  const container = document.getElementById('youtube-player-container');

  if (isMockId) {
    // For mock data show a nice placeholder with picsum
    const lesson = currentLesson;
    container.innerHTML = `
      <div class="mock-player">
        <img src="${lesson.thumbnail}" alt="${lesson.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">
        <div class="mock-player-overlay">
          <div class="mock-play-btn">▶</div>
          <p style="color:#fff;margin-top:12px;font-size:1.1rem;font-weight:600">${lesson.title}</p>
          <p style="color:rgba(255,255,255,0.7);margin-top:4px">Demo mod — YouTube API kaliti kiritilgach haqiqiy video yuklanadi</p>
          <a href="https://youtube.com/watch?v=${videoId}" target="_blank" class="btn btn-primary" style="margin-top:16px">
            YouTube'da ko'rish ↗
          </a>
        </div>
      </div>`;
    return;
  }

  // Load YouTube IFrame API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src   = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => createYTPlayer(videoId);
  } else {
    createYTPlayer(videoId);
  }
}

function createYTPlayer(videoId) {
  ytPlayer = new YT.Player('youtube-player-container', {
    height: '100%', width: '100%',
    videoId,
    playerVars: { rel: 0, modestbranding: 1, enablejsapi: 1, origin: window.location.origin },
    events: {
      onStateChange: onPlayerStateChange,
      onReady: () => { if (placeholder) placeholder.style.display = 'none'; }
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    startProgressTracking();
  } else if (event.data === YT.PlayerState.ENDED) {
    stopProgressTracking();
    markComplete(currentLesson.id);
    const autoplay = document.getElementById('autoplay-toggle')?.checked;
    if (autoplay) setTimeout(goToNext, 2000);
  } else {
    stopProgressTracking();
  }
}

function startProgressTracking() {
  stopProgressTracking();
  progressTimer = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    const current  = ytPlayer.getCurrentTime();
    const duration = ytPlayer.getDuration();
    if (duration > 0) {
      const pct = Math.min(100, Math.round((current / duration) * 100));
      document.getElementById('player-progress-fill').style.width = `${pct}%`;
      document.getElementById('player-progress-label').textContent = `${pct}% tugatildi`;
    }
  }, 2000);
}

function stopProgressTracking() {
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
}

// ── Controls ──────────────────────────────────────────────────────────────────
function setupControls() {
  document.getElementById('btn-prev-lesson')?.addEventListener('click', goToPrev);
  document.getElementById('btn-next-lesson')?.addEventListener('click', goToNext);

  document.getElementById('btn-bookmark')?.addEventListener('click', () => {
    const time = ytPlayer && typeof ytPlayer.getCurrentTime === 'function'
      ? Math.floor(ytPlayer.getCurrentTime()) : 0;
    addBookmark(currentLesson.id, time);
  });

  document.getElementById('add-bookmark-btn')?.addEventListener('click', () => {
    const time = ytPlayer && typeof ytPlayer.getCurrentTime === 'function'
      ? Math.floor(ytPlayer.getCurrentTime()) : 0;
    addBookmark(currentLesson.id, time);
  });

  document.getElementById('btn-complete')?.addEventListener('click', () => {
    markComplete(currentLesson.id);
  });

  document.getElementById('btn-favorite')?.addEventListener('click', () => {
    const favs = JSON.parse(localStorage.getItem(PL_KEYS.FAVORITES) || '[]');
    const idx  = favs.indexOf(currentLesson.id);
    if (idx === -1) favs.push(currentLesson.id); else favs.splice(idx, 1);
    localStorage.setItem(PL_KEYS.FAVORITES, JSON.stringify(favs));
    updateFavBtn();
  });

  document.getElementById('save-notes-btn')?.addEventListener('click', saveNotes);
  document.getElementById('download-notes-btn')?.addEventListener('click', downloadNotes);

  document.getElementById('playlist-search')?.addEventListener('input', e => {
    filterPlaylist(e.target.value.toLowerCase());
  });
}

function goToPrev() {
  if (currentIndex > 0) navigateToLesson(currentIndex - 1);
}
function goToNext() {
  if (currentIndex < allLessons.length - 1) navigateToLesson(currentIndex + 1);
}

function navigateToLesson(idx) {
  stopProgressTracking();
  const lesson = allLessons[idx];
  const watching = JSON.parse(localStorage.getItem(PL_KEYS.WATCHING) || '[]').filter(w => w !== lesson.id);
  watching.unshift(lesson.id);
  localStorage.setItem(PL_KEYS.WATCHING, JSON.stringify(watching.slice(0, 20)));
  window.location.href = `lesson-player.html?id=${lesson.id}`;
}

// ── Complete ──────────────────────────────────────────────────────────────────
function markComplete(id) {
  const prog = JSON.parse(localStorage.getItem(PL_KEYS.PROGRESS) || '{}');
  prog[id] = { completedAt: new Date().toISOString(), progress: 100 };
  localStorage.setItem(PL_KEYS.PROGRESS, JSON.stringify(prog));
  updateCompleteBtn();
  document.getElementById('player-progress-fill').style.width = '100%';
  document.getElementById('player-progress-label').textContent = '100% tugatildi';
}

function updateCompleteBtn() {
  const prog  = JSON.parse(localStorage.getItem(PL_KEYS.PROGRESS) || '{}');
  const done  = !!prog[currentLesson?.id];
  const label = document.getElementById('complete-label');
  const btn   = document.getElementById('btn-complete');
  if (label) label.textContent = done ? 'Tugatildi ✅' : 'Tugatdim';
  if (btn)   btn.classList.toggle('is-done', done);
}

function updateFavBtn() {
  const favs = JSON.parse(localStorage.getItem(PL_KEYS.FAVORITES) || '[]');
  const fav  = favs.includes(currentLesson?.id);
  const label = document.getElementById('fav-label');
  const btn   = document.getElementById('btn-favorite');
  if (label) label.textContent = fav ? 'Saqlangan ❤️' : 'Saqlash';
  if (btn)   btn.classList.toggle('is-fav', fav);
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────
function addBookmark(lessonId, time) {
  const all = JSON.parse(localStorage.getItem(PL_KEYS.BOOKMARKS) || '{}');
  if (!all[lessonId]) all[lessonId] = [];
  const label = prompt('Bookmark nomi (ixtiyoriy):', `${formatTime(time)}`);
  if (label === null) return;
  all[lessonId].push({ time, label: label || formatTime(time), addedAt: new Date().toISOString() });
  localStorage.setItem(PL_KEYS.BOOKMARKS, JSON.stringify(all));
  loadBookmarks(lessonId);
}

function loadBookmarks(lessonId) {
  const all  = JSON.parse(localStorage.getItem(PL_KEYS.BOOKMARKS) || '{}');
  const bms  = all[lessonId] || [];
  const list = document.getElementById('bookmarks-list');
  if (!list) return;

  if (!bms.length) {
    list.innerHTML = '<p class="empty-panel-msg">Hali bookmark qo\'shilmagan.</p>';
    return;
  }

  list.innerHTML = bms.map((bm, i) => `
    <div class="bookmark-item">
      <button class="bookmark-time-btn" data-time="${bm.time}">${formatTime(bm.time)}</button>
      <span class="bookmark-label">${bm.label}</span>
      <button class="bookmark-delete-btn" data-index="${i}">✕</button>
    </div>`).join('');

  list.querySelectorAll('.bookmark-time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (ytPlayer && typeof ytPlayer.seekTo === 'function')
        ytPlayer.seekTo(parseInt(btn.getAttribute('data-time')), true);
    });
  });

  list.querySelectorAll('.bookmark-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      all[lessonId].splice(parseInt(btn.getAttribute('data-index')), 1);
      localStorage.setItem(PL_KEYS.BOOKMARKS, JSON.stringify(all));
      loadBookmarks(lessonId);
    });
  });
}

function formatTime(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

// ── Notes ─────────────────────────────────────────────────────────────────────
function loadNotes(id) {
  const all  = JSON.parse(localStorage.getItem(PL_KEYS.NOTES) || '{}');
  const area = document.getElementById('notes-textarea');
  if (area) area.value = all[id] || '';
}

function saveNotes() {
  const all  = JSON.parse(localStorage.getItem(PL_KEYS.NOTES) || '{}');
  const area = document.getElementById('notes-textarea');
  if (!area) return;
  all[currentLesson.id] = area.value;
  localStorage.setItem(PL_KEYS.NOTES, JSON.stringify(all));
  const msg = document.getElementById('notes-saved-msg');
  if (msg) { msg.textContent = '✅ Saqlandi'; setTimeout(() => { msg.textContent = ''; }, 2000); }
}

function downloadNotes() {
  const area = document.getElementById('notes-textarea');
  if (!area || !area.value) return;
  const blob = new Blob([`# ${currentLesson.title}\n\n${area.value}`], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `LevelX_notes_${currentLesson.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Playlist Sidebar ──────────────────────────────────────────────────────────
function renderPlaylist() {
  const container = document.getElementById('playlist-items');
  const countEl   = document.getElementById('playlist-count');
  if (!container) return;

  if (countEl) countEl.textContent = `${allLessons.length} dars`;

  container.innerHTML = allLessons.map((lesson, idx) => {
    const prog  = JSON.parse(localStorage.getItem(PL_KEYS.PROGRESS) || '{}');
    const done  = !!prog[lesson.id];
    const active = lesson.id === currentLesson.id;
    return `
    <div class="playlist-item ${active ? 'playlist-item-active' : ''} ${done ? 'playlist-item-done' : ''}"
         data-id="${lesson.id}" data-idx="${idx}">
      <div class="playlist-thumb-wrap">
        <img src="${lesson.thumbnail}" alt="${lesson.title}" onerror="this.src='https://picsum.photos/seed/${lesson.id}/480/270'">
        ${active ? '<div class="playlist-playing-indicator">▶</div>' : ''}
        ${done   ? '<div class="playlist-done-indicator">✅</div>' : ''}
      </div>
      <div class="playlist-item-info">
        <span class="playlist-item-title">${lesson.title}</span>
        <span class="playlist-item-meta">
          <span class="lvl-badge lvl-badge-${lesson.level}" style="font-size:0.65rem;padding:1px 6px">${lesson.level}</span>
          ${lesson.duration}
        </span>
      </div>
    </div>`;
  }).join('');

  container.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-idx'));
      if (allLessons[idx].id !== currentLesson.id) navigateToLesson(idx);
    });
  });

  // Scroll active item into view
  const active = container.querySelector('.playlist-item-active');
  if (active) setTimeout(() => active.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
}

function filterPlaylist(query) {
  document.querySelectorAll('.playlist-item').forEach(item => {
    const title = item.querySelector('.playlist-item-title')?.textContent.toLowerCase() || '';
    item.style.display = title.includes(query) ? 'flex' : 'none';
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' });
}
