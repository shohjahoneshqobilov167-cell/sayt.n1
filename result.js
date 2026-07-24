// Test result viewer, analytics breakdown, and PDF certificate export controller

let finalTestResult = null;

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

  // 1. Gather Result Data
  const urlParams = new URLSearchParams(window.location.search);
  const isHistorical = urlParams.get('historical') === 'true';

  if (isHistorical) {
    // Load from URL parameters (historical view from profile)
    const score  = parseInt(urlParams.get('score'))   || 0;
    const level  = urlParams.get('level')             || 'A1';
    const gCount = parseInt(urlParams.get('grammar'))  || 0;
    const vCount = parseInt(urlParams.get('vocab'))    || 0;
    const rCount = parseInt(urlParams.get('reading'))  || 0;

    finalTestResult = {
      score,
      maxScore: 30,
      level,
      breakdown: {
        grammar:    { correct: gCount, total: 10 },
        vocabulary: { correct: vCount, total: 10 },
        reading:    { correct: rCount, total: 10 }
      }
    };
  } else {
    // Load fresh result from sessionStorage
    const lastRunRaw = sessionStorage.getItem('level_test_last_run');
    if (lastRunRaw) {
      finalTestResult = JSON.parse(lastRunRaw);
      sessionStorage.removeItem('level_test_last_run');
    } else {
      window.location.href = 'profile.html';
      return;
    }
  }

  // Render Result UI
  renderResultUI(currentUser, finalTestResult);
});

// Render results
function renderResultUI(user, result) {
  const t = window.i18n.t.bind(window.i18n);

  const levelNames = {
    A1: { title: "Boshlang'ich (Beginner)",             class: 'lvl-badge-A1' },
    A2: { title: 'Oddiy (Elementary)',                  class: 'lvl-badge-A2' },
    B1: { title: "O'rta (Intermediate)",                class: 'lvl-badge-B1' },
    B2: { title: "O'rtadan yuqori (Upper Intermediate)", class: 'lvl-badge-B2' },
    C1: { title: 'Mukammal (Advanced)',                 class: 'lvl-badge-C1' },
    C2: { title: 'Professional (Proficient)',           class: 'lvl-badge-C2' }
  };

  const info = levelNames[result.level] || levelNames.A1;

  // Header badges
  const badge = document.getElementById('result-cefr-level-badge');
  badge.innerText = result.level;
  badge.className = `result-badge-large ${info.class}`;

  document.getElementById('result-cefr-title').innerText = info.title;

  // Score summary — replace {score} and {max} placeholders
  const summaryText = t('result.summary')
    .replace('{score}', result.score)
    .replace('{max}', result.maxScore);
  document.getElementById('result-score-summary').innerHTML = summaryText;

  // Section details
  const grammarPct = Math.round((result.breakdown.grammar.correct    / result.breakdown.grammar.total)    * 100) || 0;
  const vocabPct   = Math.round((result.breakdown.vocabulary.correct / result.breakdown.vocabulary.total) * 100) || 0;
  const readingPct = Math.round((result.breakdown.reading.correct    / result.breakdown.reading.total)    * 100) || 0;

  document.getElementById('pct-grammar-label').innerText = `${grammarPct}% (${result.breakdown.grammar.correct}/${result.breakdown.grammar.total})`;
  document.getElementById('bar-grammar').style.width     = `${grammarPct}%`;
  document.getElementById('bar-grammar').className       = `progress-bar-fill lvl-progress-${result.level}`;

  document.getElementById('pct-vocab-label').innerText   = `${vocabPct}% (${result.breakdown.vocabulary.correct}/${result.breakdown.vocabulary.total})`;
  document.getElementById('bar-vocab').style.width       = `${vocabPct}%`;
  document.getElementById('bar-vocab').className         = `progress-bar-fill lvl-progress-${result.level}`;

  document.getElementById('pct-reading-label').innerText = `${readingPct}% (${result.breakdown.reading.correct}/${result.breakdown.reading.total})`;
  document.getElementById('bar-reading').style.width     = `${readingPct}%`;
  document.getElementById('bar-reading').className       = `progress-bar-fill lvl-progress-${result.level}`;

  // Recommendations
  renderRecommendations(result.level);

  // Pre-fill hidden Certificate fields
  document.getElementById('cert-user-name').innerText = `${user.firstName} ${user.lastName}`;

  const certBadge = document.getElementById('cert-cefr-badge');
  certBadge.innerText = result.level;

  const colors = { A1: '#64748b', A2: '#0d9488', B1: '#2563eb', B2: '#7c3aed', C1: '#ea580c', C2: '#d97706' };
  certBadge.style.backgroundColor = colors[result.level] || '#2563eb';

  document.getElementById('cert-level-title').innerText   = info.title;
  document.getElementById('cert-total-score').innerText   = `${result.score} / ${result.maxScore}`;
  document.getElementById('cert-grammar-pct').innerText   = `${grammarPct}%`;
  document.getElementById('cert-vocab-pct').innerText     = `${vocabPct}%`;
  document.getElementById('cert-reading-pct').innerText   = `${readingPct}%`;
  document.getElementById('cert-date').innerText          = `${new Date().toLocaleDateString(
    window.i18n.getLanguage() === 'ru' ? 'ru-RU' : window.i18n.getLanguage() === 'en' ? 'en-US' : 'uz-UZ'
  )}`;
}

// Generate tailored recommendations (content stays in Uzbek per original design)
function renderRecommendations(level) {
  const list = document.getElementById('recommendations-items');
  list.innerHTML = '';

  const recs = {
    A1: [
      "Ingliz tili asoslarini o'rganishga e'tibor qarating (alfavit, olmoshlar, to be fe'li).",
      "Kundalik sodda so'zlarni yodlang (ranglar, oila a'zolari, meva-chevalar).",
      "Sodda jumlalar bilan qisqa o'zini tanishtirish mashqlarini bajaring.",
      "Duolingo kabi dasturlarda kuniga 10 daqiqa shug'ullaning."
    ],
    A2: [
      "Sodda zamonlarni mustahkamlang (Present Simple, Past Simple, Future Simple).",
      "Sayohat, xaridlar va ishga tegishli lug'at boyligingizni kengaytiring.",
      "Sodda, bolalar uchun yozilgan inglizcha kitoblarni o'qishni boshlang.",
      "Ingliz tilida qisqa hikoyalar tinglang va ularni tushunishga harakat qiling."
    ],
    B1: [
      "Mukammalroq zamonlar va shart ergash gaplarni o'rganing (Present Perfect, Conditionals).",
      "So'zlarning sinonimlari va antonimlari hamda iboralarni (idioms) yodlang.",
      "Inglizcha podkastlarni yoki soddalashtirilgan audio kitoblarni tinglang.",
      "Kundalik hayotingiz yoki qiziqishlaringiz haqida qisqa insholar yozishga harakat qiling."
    ],
    B2: [
      "Murakkab grammatik qoidalarni o'zlashtiring (Passive Voice, Modals, Inversion).",
      "Kasbiy va akademik mavzulardagi so'z boyligingizni oshiring.",
      "Ingliz tilidagi filmlarni va YouTube videolarini subtitrsiz ko'rishni boshlang.",
      "Do'stlaringiz bilan yoki ingliz tilida so'zlashuv guruhlarida faol munozaralar olib boring."
    ],
    C1: [
      "Nutqingizda nozik ma'nodagi so'zlarni va idiomalarni erkin ishlating.",
      "Ingliz tilidagi gazeta va ilmiy maqolalarni (The Economist, BBC) muntazam o'qing.",
      "Turli rasmiy va norasmiy mavzularda murakkab insholar hamda hisobotlar yozing.",
      "Nutqingizdagi talaffuz va intonatsiyani tabiiy ko'rinishga keltirish ustida ishlang."
    ],
    C2: [
      "Til ko'nikmalaringizni doimiy ravon saqlash uchun ingliz tilida so'zlashuvchi muhitda bo'ling.",
      "Badiiy, falsafiy va chuqur ilmiy asarlarni tahlil qiling va muhokama qiling.",
      "Nutqingizdagi har qanday kichik xatolarni tuzatib, ona tili vakillari darajasida so'zlang.",
      "Ingliz tilida kitob, maqola yozish yoki professional nutqlar so'zlash bilan shug'ullaning."
    ]
  };

  const activeRecs = recs[level] || recs.A1;
  activeRecs.forEach(text => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>•</strong> ${text}`;
    li.style.marginBottom = '6px';
    list.appendChild(li);
  });
}

// Download PDF certificate
function downloadCertificatePDF() {
  const t = window.i18n.t.bind(window.i18n);
  const btn = document.getElementById('btn-download-cert');
  const initialHTML = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = t('result.downloadLoading');

  const element = document.getElementById('certificate-template');
  element.style.display = 'block';

  const opt = {
    margin:      10,
    filename:    `LevelX_Certificate_${Date.now()}.pdf`,
    image:       { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF:       { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  if (window.html2pdf) {
    html2pdf().set(opt).from(element).save()
      .then(() => {
        element.style.display = 'none';
        btn.disabled = false;
        btn.innerHTML = initialHTML;
      })
      .catch(err => {
        console.error(err);
        element.style.display = 'none';
        btn.disabled = false;
        btn.innerHTML = initialHTML;
        alert(t('result.downloadError'));
      });
  } else {
    alert(t('result.downloadRetry'));
    element.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = initialHTML;
  }
}
