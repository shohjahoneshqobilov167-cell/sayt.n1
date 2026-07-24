// User profile dashboard controller and progress graphing

let activeSettingsAvatar = 'avatar_1';
let progressChartInstance = null;

// Avatar preset markup generator
function getAvatarMarkup(avatarId, large = false) {
  const avatars = {
    avatar_1: { emoji: '👤', color: 'var(--level-b1)' },
    avatar_2: { emoji: '🧑', color: 'var(--level-a2)' },
    avatar_3: { emoji: '👩‍💻', color: 'var(--level-b2)' },
    avatar_4: { emoji: '🧑‍🎓', color: 'var(--level-c1)' }
  };

  const av = avatars[avatarId] || avatars.avatar_1;
  const sizeClass = large ? 'profile-avatar-large' : 'avatar-img-placeholder';
  return `<div class="${sizeClass}" style="background-color: ${av.color}; margin: 0 auto;">${av.emoji}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Validate active login session
  const currentUser = State.getCurrentUser();
  if (!currentUser) {
    window.location.href = 'auth.html';
    return;
  }

  // Admin menu item visibility
  if (currentUser.email === 'admin@test.com') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
  }

  // Bind Logout
  document.getElementById('profile-logout-btn').addEventListener('click', () => {
    State.logout();
    window.location.href = '../index.html';
  });

  // Render Dashboard
  renderProfileInfo(currentUser);
  renderTestHistory(currentUser);
  initProgressChart(currentUser);

  // Setup settings form
  prefillSettings(currentUser);
});

// Render user basic profile details
function renderProfileInfo(user) {
  const t = window.i18n.t.bind(window.i18n);

  document.getElementById('user-full-name').innerText = `${user.firstName} ${user.lastName}`;
  document.getElementById('user-email').innerText = user.email;
  document.getElementById('user-age').innerText = `${t('profile.ageDisplay')}: ${user.age}`;

  // CEFR Badge
  const cefrBadge = document.getElementById('user-cefr-badge');
  cefrBadge.innerText = user.currentLevel || 'A1';
  cefrBadge.className = `lvl-badge lvl-badge-${user.currentLevel || 'A1'}`;

  // Large Avatar
  document.getElementById('profile-avatar-container').innerHTML = getAvatarMarkup(user.avatar, true);
}

// Render historical test runs
function renderTestHistory(user) {
  const t = window.i18n.t.bind(window.i18n);
  const container = document.getElementById('test-history-list');

  if (!user.history || user.history.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>${t('profile.noHistory')}</p>
        <a href="test.html" class="btn btn-primary btn-sm" style="margin-top: 15px;">${t('profile.startTest')}</a>
      </div>
    `;
    return;
  }

  // Show list in reverse chronological order
  const listItems = [...user.history].reverse().map(test => {
    const formattedDate = new Date(test.date).toLocaleString(
      window.i18n.getLanguage() === 'ru' ? 'ru-RU' : window.i18n.getLanguage() === 'en' ? 'en-US' : 'uz-UZ',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );

    const grammarPct = Math.round((test.breakdown.grammar.correct / test.breakdown.grammar.total) * 100) || 0;
    const vocabPct = Math.round((test.breakdown.vocabulary.correct / test.breakdown.vocabulary.total) * 100) || 0;
    const readingPct = Math.round((test.breakdown.reading.correct / test.breakdown.reading.total) * 100) || 0;

    return `
      <div class="history-item lvl-card-${test.level}">
        <div class="history-details">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="lvl-badge lvl-badge-${test.level}">${test.level}</span>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${t('profile.result')}: ${test.score} / ${test.maxScore}</strong>
          </div>
          <span class="history-date">${t('profile.takenOn')}: ${formattedDate}</span>
          <div style="display: flex; gap: 15px; margin-top: 8px; font-size: 0.85rem; color: var(--text-secondary);">
            <span>${t('profile.grammar')}: <strong>${grammarPct}%</strong></span>
            <span>${t('profile.vocabulary')}: <strong>${vocabPct}%</strong></span>
            <span>${t('profile.reading')}: <strong>${readingPct}%</strong></span>
          </div>
        </div>
        <a href="result.html?score=${test.score}&level=${test.level}&grammar=${test.breakdown.grammar.correct}&vocab=${test.breakdown.vocabulary.correct}&reading=${test.breakdown.reading.correct}&historical=true" class="btn btn-secondary btn-sm">
          ${t('profile.details')}
        </a>
      </div>
    `;
  }).join('');

  container.innerHTML = listItems;
}

// Prefill form settings
function prefillSettings(user) {
  document.getElementById('settings-firstname').value = user.firstName;
  document.getElementById('settings-lastname').value = user.lastName;
  document.getElementById('settings-age').value = user.age;

  selectSettingsAvatar(user.avatar || 'avatar_1');
}

// Select avatar in settings page
function selectSettingsAvatar(avatarId) {
  activeSettingsAvatar = avatarId;

  document.querySelectorAll('.avatar-option').forEach(opt => {
    if (opt.getAttribute('data-avatar') === avatarId) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });
}

// Handle details modification save
function handleSettingsUpdate(event) {
  event.preventDefault();

  const firstName = document.getElementById('settings-firstname').value.trim();
  const lastName = document.getElementById('settings-lastname').value.trim();
  const age = document.getElementById('settings-age').value;
  const password = document.getElementById('settings-password').value;

  const result = State.updateProfile(firstName, lastName, age, activeSettingsAvatar, password);

  if (result.success) {
    showAlert(window.i18n.t('profile.saveSuccess'), 'success');

    // Clear password input
    document.getElementById('settings-password').value = '';

    // Reload local updates
    renderProfileInfo(result.user);
    renderTestHistory(result.user);

    // Re-init chart to match updated name
    initProgressChart(result.user);
  } else {
    showAlert(result.message, 'error');
  }
}

// Helper to show settings response messages
function showAlert(message, type) {
  const alertBox = document.getElementById('settings-alert');
  alertBox.style.display = 'block';
  alertBox.innerText = message;

  if (type === 'success') {
    alertBox.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
    alertBox.style.color = 'var(--accent)';
    alertBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
  } else {
    alertBox.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    alertBox.style.color = 'var(--danger)';
    alertBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
  }

  // Auto-hide alert after 3 seconds
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

// Initialize the historical line chart
function initProgressChart(user) {
  const canvas = document.getElementById('progressChart');
  const emptyMsg = document.getElementById('no-chart-data-message');

  if (!user.history || user.history.length === 0) {
    canvas.style.display = 'none';
    emptyMsg.style.display = 'flex';
    emptyMsg.innerText = window.i18n.t('profile.chartLoading');
    return;
  }

  canvas.style.display = 'block';
  emptyMsg.style.display = 'none';

  // Map levels to numeric indices for graphing
  const levelMapping = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };

  // Format labels (dates) and plot values
  const locale = window.i18n.getLanguage() === 'ru' ? 'ru-RU' : window.i18n.getLanguage() === 'en' ? 'en-US' : 'uz-UZ';
  const labels = user.history.map(test => {
    return new Date(test.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  });

  const dataValues = user.history.map(test => levelMapping[test.level] || 1);

  // Retrieve document color settings for graph elements
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const primaryColor = isDark ? '#38bdf8' : '#0284c7';

  // Destroy previous chart if it exists to avoid overlapping
  if (progressChartInstance) {
    progressChartInstance.destroy();
  }

  // Wait to ensure Chart.js is fully loaded
  const interval = setInterval(() => {
    if (window.Chart) {
      clearInterval(interval);

      const ctx = canvas.getContext('2d');
      progressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: window.i18n.t('profile.chartTitle'),
            data: dataValues,
            borderColor: primaryColor,
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: primaryColor,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const levelNames = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                  const score = user.history[context.dataIndex].score;
                  return `${window.i18n.t('test.level')}: ${levelNames[context.raw - 1]} (${score})`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor }
            },
            y: {
              min: 1,
              max: 6,
              ticks: {
                stepSize: 1,
                color: textColor,
                callback: function(value) {
                  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                  return levels[value - 1] || '';
                }
              },
              grid: { color: gridColor }
            }
          }
        }
      });
    }
  }, 100);
}
