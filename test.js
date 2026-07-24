// Placement Test controller and state tracking

let testQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // maps question.id to selected option index
let testTimeLeft = 25 * 60; // 25 minutes in seconds
let timerIntervalId = null;
let isUnloadWarningActive = true;
let autoAdvanceEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ensure user is logged in
  const currentUser = State.getCurrentUser();
  if (!currentUser) {
    window.location.href = 'auth.html?redirect=test';
    return;
  }

  // 2. Load questions
  testQuestions = State.getQuestions();
  if (testQuestions.length === 0) {
    alert(window.i18n.t('test.notFound'));
    window.location.href = '../index.html';
    return;
  }

  // 3. Load or initialize test state
  resumeOrInitTest();

  // 4. Start timer
  startTimer();

  // 5. Render first view
  renderQuestion(currentQuestionIndex);
  renderNavDots();
  updateProgressBar();

  // 6. Bind exit warnings
  window.addEventListener('beforeunload', beforeUnloadHandler);
});

// Window reload warning
function beforeUnloadHandler(e) {
  if (isUnloadWarningActive) {
    e.preventDefault();
    e.returnValue = window.i18n.t('test.leaveWarning');
    return e.returnValue;
  }
}

// Resume previous test run if page refreshed
function resumeOrInitTest() {
  const savedAnswers = sessionStorage.getItem('level_test_answers');
  const savedTime    = sessionStorage.getItem('level_test_time');
  const savedIndex   = sessionStorage.getItem('level_test_index');
  const activeSessionId = sessionStorage.getItem('level_test_session_active');
  const currentUser  = State.getCurrentUser();

  // Check if we are resuming the same session
  if (activeSessionId === currentUser.id && savedAnswers) {
    userAnswers          = JSON.parse(savedAnswers);
    testTimeLeft         = parseInt(savedTime) || (25 * 60);
    currentQuestionIndex = parseInt(savedIndex) || 0;
  } else {
    // Fresh run -> clear and init
    userAnswers          = {};
    testTimeLeft         = 25 * 60;
    currentQuestionIndex = 0;
    sessionStorage.setItem('level_test_session_active', currentUser.id);
    saveTestState();
  }
}

// Persist states to sessionStorage
function saveTestState() {
  sessionStorage.setItem('level_test_answers', JSON.stringify(userAnswers));
  sessionStorage.setItem('level_test_time',    testTimeLeft);
  sessionStorage.setItem('level_test_index',   currentQuestionIndex);
}

// Clear sessionStorage states
function clearTestState() {
  sessionStorage.removeItem('level_test_answers');
  sessionStorage.removeItem('level_test_time');
  sessionStorage.removeItem('level_test_index');
  sessionStorage.removeItem('level_test_session_active');
}

// Timer mechanics
function startTimer() {
  updateTimerDisplay();

  timerIntervalId = setInterval(() => {
    testTimeLeft--;
    saveTestState();
    updateTimerDisplay();

    if (testTimeLeft <= 0) {
      clearInterval(timerIntervalId);
      isUnloadWarningActive = false;
      document.getElementById('time-up-modal').classList.add('active');
    }
  }, 1000);
}

// Update countdown view
function updateTimerDisplay() {
  const clock   = document.getElementById('test-timer-clock');
  const minutes = Math.floor(testTimeLeft / 60);
  const seconds = testTimeLeft % 60;

  clock.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Visual warning on low time
  if (testTimeLeft < 120) {
    clock.style.color                     = 'var(--danger)';
    clock.parentElement.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
  } else {
    clock.style.color                     = 'var(--primary)';
    clock.parentElement.style.backgroundColor = 'var(--primary-glow)';
  }
}

// Render active question details
function renderQuestion(index) {
  if (index < 0 || index >= testQuestions.length) return;

  currentQuestionIndex = index;
  saveTestState();

  const t        = window.i18n.t.bind(window.i18n);
  const question = testQuestions[index];

  // Category label translations via i18n
  const catNames = {
    grammar:    t('test.catGrammar'),
    vocabulary: t('test.catVocabulary'),
    reading:    t('test.catReading')
  };

  document.getElementById('question-category-label').innerText  = catNames[question.category] || t('test.catOther');
  document.getElementById('question-category-label').className  = `lvl-badge lvl-badge-${question.difficulty}`;
  document.getElementById('question-number-label').innerText    = `${t('test.question')}: ${index + 1} / ${testQuestions.length}`;
  document.getElementById('question-difficulty-label').innerText = `${t('test.level')}: ${question.difficulty}`;
  document.getElementById('question-difficulty-label').className = `lvl-text-${question.difficulty}`;

  // Passage display
  const passageBox = document.getElementById('reading-passage-container');
  if (question.passage && question.passage.trim() !== '') {
    passageBox.style.display = 'block';
    passageBox.innerText     = question.passage;
  } else {
    passageBox.style.display = 'none';
  }

  // Question prompt
  document.getElementById('question-prompt').innerText = question.question;

  // Options cards
  const optionsList = document.getElementById('question-options');
  optionsList.innerHTML = '';

  const alphabet = ['A', 'B', 'C', 'D'];
  question.options.forEach((opt, optIndex) => {
    const isSelected = userAnswers[question.id] === optIndex;
    const optionItem = document.createElement('li');
    optionItem.className = `option-item ${isSelected ? 'selected' : ''}`;
    optionItem.onclick   = () => selectOption(optIndex);
    optionItem.innerHTML = `
      <div class="option-marker">${alphabet[optIndex]}</div>
      <div style="flex-grow: 1;">${opt}</div>
    `;
    optionsList.appendChild(optionItem);
  });

  // Navigation buttons
  const prevBtn = document.getElementById('btn-prev-question');
  const nextBtn = document.getElementById('btn-next-question');

  prevBtn.disabled     = index === 0;
  prevBtn.style.opacity = index === 0 ? '0.6' : '1';
  prevBtn.innerText    = t('test.previous');

  if (index === testQuestions.length - 1) {
    nextBtn.innerText  = t('test.finish');
    nextBtn.className  = 'btn btn-accent';
  } else {
    nextBtn.innerText  = t('test.next');
    nextBtn.className  = 'btn btn-primary';
  }

  // Update navbar markers
  updateNavDotsActiveState();
}

// Select an option
function selectOption(optIndex) {
  const activeQ = testQuestions[currentQuestionIndex];
  userAnswers[activeQ.id] = optIndex;

  saveTestState();
  renderQuestion(currentQuestionIndex);
  renderNavDots();
  updateProgressBar();

  if (autoAdvanceEnabled && currentQuestionIndex < testQuestions.length - 1) {
    setTimeout(() => goToNextQuestion(), 280);
  }
}

// Nav grid generation
function renderNavDots() {
  const dotsContainer = document.getElementById('question-nav-dots');
  dotsContainer.innerHTML = '';

  testQuestions.forEach((q, index) => {
    const dot        = document.createElement('div');
    const isCurrent  = index === currentQuestionIndex;
    const isAnswered = userAnswers[q.id] !== undefined;

    let stateClass = '';
    if (isCurrent)       stateClass = 'active';
    else if (isAnswered) stateClass = 'answered';

    dot.className = `q-nav-dot ${stateClass}`;
    dot.innerText = index + 1;
    dot.onclick   = () => renderQuestion(index);

    dotsContainer.appendChild(dot);
  });
}

// Nav grid active marker updates
function updateNavDotsActiveState() {
  document.querySelectorAll('.q-nav-dot').forEach((dot, index) => {
    const q          = testQuestions[index];
    const isCurrent  = index === currentQuestionIndex;
    const isAnswered = userAnswers[q.id] !== undefined;

    dot.classList.remove('active', 'answered');
    if (isCurrent)       dot.classList.add('active');
    else if (isAnswered) dot.classList.add('answered');
  });
}

// Update top progress bar
function updateProgressBar() {
  const total    = testQuestions.length;
  const answered = Object.keys(userAnswers).length;
  const pct      = Math.round((answered / total) * 100);
  document.getElementById('test-progress-bar').style.width = `${pct}%`;
}

// Prev question click
function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) renderQuestion(currentQuestionIndex - 1);
}

// Next question click
function goToNextQuestion() {
  if (currentQuestionIndex < testQuestions.length - 1) {
    renderQuestion(currentQuestionIndex + 1);
  } else {
    triggerFinishConfirmation();
  }
}

// Trigger confirmation modal
function triggerFinishConfirmation() {
  document.getElementById('finish-confirm-modal').classList.add('active');
}

// Close confirmation modal
function closeFinishConfirmation() {
  document.getElementById('finish-confirm-modal').classList.remove('active');
}

// Submit test answers and process scores
function submitTestResults(force = false) {
  isUnloadWarningActive = false;

  if (timerIntervalId) clearInterval(timerIntervalId);

  document.getElementById('finish-confirm-modal').classList.remove('active');
  document.getElementById('time-up-modal').classList.remove('active');

  // Breakdown metrics
  const breakdown = {
    grammar:    { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    reading:    { correct: 0, total: 0 }
  };

  let totalCorrectScore = 0;

  testQuestions.forEach(q => {
    const userSelect   = userAnswers[q.id];
    const correctSelect = q.correctIndex;
    const category     = q.category;

    breakdown[category].total++;

    if (userSelect !== undefined && userSelect === correctSelect) {
      breakdown[category].correct++;
      totalCorrectScore++;
    }
  });

  // CEFR level mapping (30-question pool)
  let targetCEFR = 'A1';
  if      (totalCorrectScore >= 26) targetCEFR = 'C2';
  else if (totalCorrectScore >= 21) targetCEFR = 'C1';
  else if (totalCorrectScore >= 16) targetCEFR = 'B2';
  else if (totalCorrectScore >= 11) targetCEFR = 'B1';
  else if (totalCorrectScore >= 6)  targetCEFR = 'A2';

  // Save to user profile
  State.addTestResult(totalCorrectScore, testQuestions.length, targetCEFR, breakdown);

  // Store for result page
  sessionStorage.setItem('level_test_last_run', JSON.stringify({
    score:    totalCorrectScore,
    maxScore: testQuestions.length,
    level:    targetCEFR,
    breakdown
  }));

  clearTestState();
  window.location.href = 'result.html';
}
