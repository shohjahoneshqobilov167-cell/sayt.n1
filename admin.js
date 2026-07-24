// Admin panel questions editor and CRUD controller

document.addEventListener('DOMContentLoaded', () => {
  // Validate active login session and admin privileges
  const currentUser = State.getCurrentUser();
  if (!currentUser || currentUser.email !== 'admin@test.com') {
    window.location.href = 'profile.html';
    return;
  }

  // Load question list
  renderQuestionsList();
});

// Render all questions in administrative table list
function renderQuestionsList() {
  const t = window.i18n.t.bind(window.i18n);
  const tbody = document.getElementById('admin-questions-tbody');
  const countLabel = document.getElementById('question-count-label');

  const questions = State.getQuestions();
  const suffix = t('admin.countSuffix') ? ' ' + t('admin.countSuffix') : '';
  countLabel.innerText = `${t('admin.count')}: ${questions.length}${suffix}`;

  if (questions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
          ${t('admin.emptyList')}
        </td>
      </tr>
    `;
    return;
  }

  const categoryTranslations = {
    grammar: t('admin.catGrammar'),
    vocabulary: t('admin.catVocabulary'),
    reading: t('admin.catReading')
  };

  tbody.innerHTML = questions.map((q, idx) => {
    // Truncate text for table readability
    const shortQuestion = q.question.length > 50 ? q.question.substring(0, 47) + '...' : q.question;
    const shortPassage = q.passage && q.passage.length > 30 ? q.passage.substring(0, 27) + '...' : (q.passage || '-');

    // Highlight correct option
    const optionsText = q.options.map((opt, oIdx) => {
      const isCorrect = oIdx === q.correctIndex;
      return isCorrect ? `<strong style="color: var(--accent);">&#x2713; ${opt}</strong>` : opt;
    }).join(', ');

    return `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td><span class="lvl-badge lvl-badge-B1" style="font-size: 0.75rem;">${categoryTranslations[q.category] || q.category}</span></td>
        <td><span class="lvl-badge lvl-badge-${q.difficulty}">${q.difficulty}</span></td>
        <td>
          <div style="font-weight: 500; font-size: 0.95rem;">${escapeHtml(shortQuestion)}</div>
          ${q.passage ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${t('admin.passagePrefix')}: ${escapeHtml(shortPassage)}</div>` : ''}
        </td>
        <td style="font-size: 0.85rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${optionsText}
        </td>
        <td style="text-align: center;">
          <div class="admin-actions">
            <button onclick="editQuestion('${q.id}')" class="btn btn-secondary btn-sm" style="flex: 1; padding: 4px 8px;">${t('admin.editBtn')}</button>
            <button onclick="handleDeleteQuestion('${q.id}')" class="btn btn-danger btn-sm" style="flex: 1; padding: 4px 8px;">${t('admin.deleteBtn')}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Modal open helper (Empty / New Mode)
function openQuestionModal() {
  const t = window.i18n.t.bind(window.i18n);
  document.getElementById('form-question-editor').reset();
  document.getElementById('edit-question-id').value = '';
  document.getElementById('modal-form-title').innerText = t('admin.modalTitle');
  document.getElementById('question-editor-modal').classList.add('active');
}

// Modal close helper
function closeQuestionModal() {
  document.getElementById('question-editor-modal').classList.remove('active');
}

// Edit details fetch and modal loader
function editQuestion(id) {
  const t = window.i18n.t.bind(window.i18n);
  const questions = State.getQuestions();
  const q = questions.find(item => item.id === id);
  if (!q) return;

  document.getElementById('edit-question-id').value = q.id;
  document.getElementById('edit-category').value = q.category;
  document.getElementById('edit-difficulty').value = q.difficulty;
  document.getElementById('edit-passage').value = q.passage || '';
  document.getElementById('edit-question').value = q.question;

  document.getElementById('edit-opt-0').value = q.options[0] || '';
  document.getElementById('edit-opt-1').value = q.options[1] || '';
  document.getElementById('edit-opt-2').value = q.options[2] || '';
  document.getElementById('edit-opt-3').value = q.options[3] || '';

  document.getElementById('edit-correct-index').value = q.correctIndex;

  document.getElementById('modal-form-title').innerText = `${t('admin.editModalTitle')} (ID: ${q.id})`;
  document.getElementById('question-editor-modal').classList.add('active');
}

// Save trigger
function handleSaveQuestion(event) {
  event.preventDefault();

  const id = document.getElementById('edit-question-id').value;
  const category = document.getElementById('edit-category').value;
  const difficulty = document.getElementById('edit-difficulty').value;
  const passage = document.getElementById('edit-passage').value.trim();
  const question = document.getElementById('edit-question').value.trim();

  const options = [
    document.getElementById('edit-opt-0').value.trim(),
    document.getElementById('edit-opt-1').value.trim(),
    document.getElementById('edit-opt-2').value.trim(),
    document.getElementById('edit-opt-3').value.trim()
  ];

  const correctIndex = parseInt(document.getElementById('edit-correct-index').value);

  const questionData = { category, difficulty, passage, question, options, correctIndex };
  if (id) questionData.id = id;

  State.saveQuestion(questionData);
  closeQuestionModal();
  renderQuestionsList();
}

// Delete trigger
function handleDeleteQuestion(id) {
  const t = window.i18n.t.bind(window.i18n);
  if (confirm(t('admin.deleteConfirm'))) {
    State.deleteQuestion(id);
    renderQuestionsList();
  }
}

// Reset Questions to original
function triggerResetQuestions() {
  const t = window.i18n.t.bind(window.i18n);
  if (confirm(t('admin.resetConfirm'))) {
    State.resetQuestions();
    renderQuestionsList();
  }
}

// Escape HTML entities helper
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
