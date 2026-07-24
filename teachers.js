// LevelX — Teachers Page Controller

const SKILL_EMOJI  = { grammar:'📝', vocabulary:'📖', speaking:'🗣', listening:'👂', reading:'📰', writing:'✍️' };

document.addEventListener('DOMContentLoaded', async () => {
  setupAuthUI();

  const data = await window.fetchAllLessons();
  renderTeachers(data);

  // Reveal animation
  document.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
});

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
      <button id="teachers-logout-btn" class="btn btn-danger btn-sm">${window.i18n.t('nav.logout')}</button>`;
    document.getElementById('teachers-logout-btn').addEventListener('click', () => {
      State.logout(); window.location.reload();
    });
  } else {
    container.innerHTML = `<a href="auth.html" class="btn btn-secondary btn-sm">${window.i18n.t('nav.login')}</a>`;
  }
}

function renderTeachers(data) {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;

  grid.querySelectorAll('.teacher-card-skeleton').forEach(s => s.remove());
  grid.innerHTML = data.map(d => buildTeacherCard(d)).join('');

  grid.querySelectorAll('.teacher-card').forEach(card => {
    card.addEventListener('click', () => {
      const channelId = card.getAttribute('data-channel');
      const entry     = data.find(d => d.channel.id === channelId);
      if (entry) openTeacherModal(entry);
    });
  });
}

function buildTeacherCard(entry) {
  const { channel, stats, lessons } = entry;
  const totalViews = lessons.reduce((s, l) => s + (l.viewCount || 0), 0);
  const levelCounts = {};
  lessons.forEach(l => { levelCounts[l.level] = (levelCounts[l.level] || 0) + 1; });
  const topSkills = getTopSkills(lessons);

  const ytHandleMap = {
    'UCazamqahramoniy':      '@azamqahramoniy',
    'UCnsflamultilevelhub':  '@nsflamultilevelhub',
    'UCabdulloh_john_ruziev':'@abdulloh_john_ruziev'
  };

  return `
  <div class="teacher-card glass-card" data-channel="${channel.id}">
    <div class="teacher-card-header" style="background: linear-gradient(135deg, ${channel.color}22, ${channel.color}08)">
      <div class="teacher-card-avatar" style="background:${channel.color}22; color:${channel.color}">
        ${channel.avatar}
      </div>
      <div class="teacher-card-badge" style="border-color:${channel.color}; color:${channel.color}">
        YouTube
      </div>
    </div>
    <div class="teacher-card-body">
      <h3 class="teacher-card-name">${channel.name}</h3>
      <p class="teacher-card-bio">${channel.bio.slice(0, 120)}...</p>

      <div class="teacher-stats-row">
        <div class="t-stat">
          <strong>${lessons.length}</strong>
          <span>Darslar</span>
        </div>
        <div class="t-stat">
          <strong>${formatViews(totalViews)}</strong>
          <span>Ko'rishlar</span>
        </div>
        <div class="t-stat">
          <strong>${formatViews(channel.students)}</strong>
          <span>O'quvchilar</span>
        </div>
      </div>

      <div class="teacher-level-chips">
        ${Object.entries(levelCounts).sort((a,b) => a[0].localeCompare(b[0])).map(([lvl, cnt]) =>
          `<span class="lvl-badge lvl-badge-${lvl}">${lvl} · ${cnt}</span>`
        ).join('')}
      </div>

      <div class="teacher-skill-chips">
        ${topSkills.map(s => `<span class="skill-tag skill-${s}">${SKILL_EMOJI[s]} ${s}</span>`).join('')}
      </div>

      <div class="teacher-card-actions">
        <button class="btn btn-primary btn-sm" style="flex:1">Darslarni ko'rish</button>
        <a href="https://youtube.com/${ytHandleMap[channel.id] || ''}" target="_blank"
           class="btn btn-secondary btn-sm" onclick="event.stopPropagation()">
          ↗ YouTube
        </a>
      </div>
    </div>
  </div>`;
}

function openTeacherModal(entry) {
  const { channel, stats, lessons } = entry;
  const totalViews = lessons.reduce((s, l) => s + (l.viewCount || 0), 0);

  document.getElementById('tmodal-avatar').textContent          = channel.avatar;
  document.getElementById('tmodal-avatar').style.background     = `${channel.color}22`;
  document.getElementById('tmodal-avatar').style.color          = channel.color;
  document.getElementById('tmodal-name').textContent            = channel.name;
  document.getElementById('tmodal-bio').textContent             = channel.bio;
  document.getElementById('tmodal-lessons').textContent         = lessons.length;
  document.getElementById('tmodal-views').textContent           = formatViews(totalViews);
  document.getElementById('tmodal-students').textContent        = formatViews(channel.students);

  const ytHandleMap = {
    'UCazamqahramoniy':      'https://youtube.com/@azamqahramoniy',
    'UCnsflamultilevelhub':  'https://youtube.com/@nsflamultilevelhub',
    'UCabdulloh_john_ruziev':'https://youtube.com/@abdulloh_john_ruziev'
  };
  document.getElementById('tmodal-yt-btn').href = ytHandleMap[channel.id] || '#';

  // Hero gradient
  document.getElementById('teacher-modal-hero').style.background =
    `linear-gradient(135deg, ${channel.color}18, transparent)`;

  // Lessons grid
  const lessonsGrid = document.getElementById('tmodal-lessons-grid');
  if (lessonsGrid) {
    lessonsGrid.innerHTML = lessons.map(l => `
      <div class="tmodal-lesson-item glass-card" style="cursor:pointer"
           onclick="window.location.href='lesson-player.html?id=${l.id}'">
        <img src="${l.thumbnail}" alt="${l.title}"
             onerror="this.src='https://picsum.photos/seed/${l.id}/480/270'"
             style="width:100%;height:120px;object-fit:cover;border-radius:8px">
        <div style="padding:10px 4px">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <span class="lvl-badge lvl-badge-${l.level}" style="font-size:0.7rem">${l.level}</span>
            ${(l.skills||[]).map(s => `<span class="skill-tag skill-${s}" style="font-size:0.7rem">${SKILL_EMOJI[s]} ${s}</span>`).join('')}
          </div>
          <p style="font-size:0.85rem;font-weight:600;margin:0;line-height:1.3">${l.title}</p>
          <small style="color:var(--text-muted)">${l.duration} · ${l.views}</small>
        </div>
      </div>`).join('');
  }

  document.getElementById('teacher-modal').classList.add('active');
  document.getElementById('teacher-modal-close').onclick = () =>
    document.getElementById('teacher-modal').classList.remove('active');
  document.getElementById('teacher-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('teacher-modal'))
      document.getElementById('teacher-modal').classList.remove('active');
  });
}

function getTopSkills(lessons) {
  const counts = {};
  lessons.forEach(l => (l.skills || []).forEach(s => { counts[s] = (counts[s] || 0) + 1; }));
  return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 4).map(e => e[0]);
}

function formatViews(n) {
  if (!n) return '0';
  const num = parseInt(n);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' });
}
