// System metrics aggregator and statistics visualizer

let levelChartInstance = null;
let sectionChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  const t = window.i18n.t.bind(window.i18n);

  // Sync login status for header navigation links
  const currentUser = State.getCurrentUser();
  const authContainer = document.getElementById('auth-buttons-container');

  if (currentUser) {
    authContainer.innerHTML = `
      <a href="profile.html" class="nav-avatar-pill" aria-label="Profil">
        <span class="nav-avatar-badge">${currentUser.firstName.charAt(0).toUpperCase()}</span>
        <span class="nav-avatar-name">${currentUser.firstName}</span>
      </a>
      <button id="stats-logout-btn" class="btn btn-danger btn-sm">${t('stats.logout')}</button>
    `;

    document.getElementById('stats-logout-btn').addEventListener('click', () => {
      State.logout();
      window.location.reload();
    });

    if (currentUser.email === 'admin@test.com') {
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
  } else {
    authContainer.innerHTML = `
      <a href="auth.html" class="btn btn-secondary btn-sm">${t('stats.loginBtn')}</a>
    `;
  }

  // Load calculations
  buildStatistics();
});

// Process user results in local storage
function buildStatistics() {
  const users = State.getAllUsers();

  // Filter users who have registered history entries
  const allTests = [];
  users.forEach(u => {
    if (u.history && u.history.length > 0) {
      u.history.forEach(t => allTests.push(t));
    }
  });

  // 1. Fill basic widgets
  document.getElementById('stat-total-users').innerText = users.length;
  document.getElementById('stat-total-tests').innerText = allTests.length;

  if (allTests.length === 0) {
    document.getElementById('stat-avg-score').innerText = '0 / 30';
    document.getElementById('stat-common-level').innerText = 'N/A';

    document.getElementById('levelDistributionChart').style.display = 'none';
    document.getElementById('no-dist-data-message').style.display = 'block';
    document.getElementById('sectionsAverageChart').style.display = 'none';
    document.getElementById('no-sec-data-message').style.display = 'block';
    return;
  }

  // Average score
  const totalScoreSum = allTests.reduce((sum, t) => sum + t.score, 0);
  const avgScore = (totalScoreSum / allTests.length).toFixed(1);
  document.getElementById('stat-avg-score').innerText = `${avgScore} / 30`;

  // Most common CEFR level
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  allTests.forEach(t => {
    if (levelCounts[t.level] !== undefined) levelCounts[t.level]++;
  });

  let commonLevel = 'A1';
  let maxCount = -1;
  for (const lvl in levelCounts) {
    if (levelCounts[lvl] > maxCount) {
      maxCount = levelCounts[lvl];
      commonLevel = lvl;
    }
  }
  document.getElementById('stat-common-level').innerText = commonLevel;

  // Render Charts
  initDistributionChart(levelCounts);
  initSectionsAverageChart(allTests);
}

// Chart 1: Levels distribution bar chart
function initDistributionChart(levelCounts) {
  const t = window.i18n.t.bind(window.i18n);
  const canvas = document.getElementById('levelDistributionChart');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const levelColors = ['#64748b', '#0d9488', '#2563eb', '#7c3aed', '#ea580c', '#d97706'];

  if (levelChartInstance) levelChartInstance.destroy();

  const interval = setInterval(() => {
    if (window.Chart) {
      clearInterval(interval);

      const ctx = canvas.getContext('2d');
      levelChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
          datasets: [{
            label: t('common.level'),
            data: [levelCounts.A1, levelCounts.A2, levelCounts.B1, levelCounts.B2, levelCounts.C1, levelCounts.C2],
            backgroundColor: levelColors,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { display: false }
            },
            y: {
              ticks: { color: textColor, stepSize: 1, precision: 0 },
              grid: { color: gridColor }
            }
          }
        }
      });
    }
  }, 100);
}

// Chart 2: Section-by-section averages polar area chart
function initSectionsAverageChart(allTests) {
  const t = window.i18n.t.bind(window.i18n);
  const canvas = document.getElementById('sectionsAverageChart');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // Calculate average category performance
  let grammarCorrect = 0, grammarTotal = 0;
  let vocabCorrect = 0, vocabTotal = 0;
  let readingCorrect = 0, readingTotal = 0;

  allTests.forEach(test => {
    grammarCorrect += test.breakdown.grammar.correct;
    grammarTotal   += test.breakdown.grammar.total;
    vocabCorrect   += test.breakdown.vocabulary.correct;
    vocabTotal     += test.breakdown.vocabulary.total;
    readingCorrect += test.breakdown.reading.correct;
    readingTotal   += test.breakdown.reading.total;
  });

  const grammarAvg = Math.round((grammarCorrect / grammarTotal) * 100) || 0;
  const vocabAvg   = Math.round((vocabCorrect   / vocabTotal)   * 100) || 0;
  const readingAvg = Math.round((readingCorrect / readingTotal) * 100) || 0;

  if (sectionChartInstance) sectionChartInstance.destroy();

  const interval = setInterval(() => {
    if (window.Chart) {
      clearInterval(interval);

      const ctx = canvas.getContext('2d');
      sectionChartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: [t('profile.grammar'), t('profile.vocabulary'), t('profile.reading')],
          datasets: [{
            data: [grammarAvg, vocabAvg, readingAvg],
            backgroundColor: [
              'rgba(37, 99, 235, 0.6)',
              'rgba(124, 58, 237, 0.6)',
              'rgba(16, 185, 129, 0.6)'
            ],
            borderColor: isDark ? '#1f2937' : '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor }
            }
          },
          scales: {
            r: {
              grid: { color: gridColor },
              angleLines: { color: gridColor },
              ticks: {
                color: textColor,
                backdropColor: 'transparent',
                stepSize: 20
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    }
  }, 100);
}
