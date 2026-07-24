// State and LocalStorage manager for the English Level Placement Test application

const KEYS = {
  USERS:     'level_test_users',
  SESSION:   'level_test_session',
  QUESTIONS: 'level_test_questions'
};

// Simple hash function for storing passwords in mock client storage
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// Get translated message safely (falls back to key if i18n not loaded yet)
function _t(key) {
  if (window.i18n && typeof window.i18n.t === 'function') {
    return window.i18n.t(key);
  }
  // Fallback strings used before i18n loads (e.g. during initQuestions)
  const fallbacks = {
    'auth.emailTaken':    'Bu email orqali allaqachon ro\'yxatdan o\'tilgan!',
    'auth.wrongCredentials': 'Email yoki parol xato!',
    'auth.notLoggedIn':   'Tizimga kirilmagan!',
    'auth.userNotFound':  'Foydalanuvchi topilmadi!'
  };
  return fallbacks[key] || key;
}

// Check and initialize questions in LocalStorage
function initQuestions() {
  const storedQuestions = localStorage.getItem(KEYS.QUESTIONS);
  if (!storedQuestions) {
    const defaultPool = window.defaultQuestions || [];
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultPool));
  }
}

// Run immediately
initQuestions();

const State = {
  // --- AUTH / USER MANAGEMENT ---

  // Register a new user
  register(firstName, lastName, email, password, age, avatar) {
    const users = this.getAllUsers();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: _t('auth.emailTaken') };
    }

    const newUser = {
      id:           'user_' + Date.now(),
      firstName,
      lastName,
      email:        email.toLowerCase(),
      passwordHash: hashPassword(password),
      age:          parseInt(age) || 0,
      avatar:       avatar || 'avatar_1',
      currentLevel: 'A1',
      history:      []
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.createSession(newUser.id);
    return { success: true, user: newUser };
  },

  // Log in user
  login(email, password) {
    const users = this.getAllUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== hashPassword(password)) {
      return { success: false, message: _t('auth.wrongCredentials') };
    }

    this.createSession(user.id);
    return { success: true, user };
  },

  // Create login session
  createSession(userId) {
    localStorage.setItem(KEYS.SESSION, userId);
  },

  // Get active session user
  getCurrentUser() {
    const userId = localStorage.getItem(KEYS.SESSION);
    if (!userId) return null;
    return this.getAllUsers().find(u => u.id === userId) || null;
  },

  // Log out user
  logout() {
    localStorage.removeItem(KEYS.SESSION);
  },

  // Update user profile info / settings
  updateProfile(firstName, lastName, age, avatar, password = null) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: _t('auth.notLoggedIn') };

    const users     = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) return { success: false, message: _t('auth.userNotFound') };

    users[userIndex].firstName = firstName;
    users[userIndex].lastName  = lastName;
    users[userIndex].age       = parseInt(age) || 0;
    users[userIndex].avatar    = avatar;

    if (password && password.trim() !== '') {
      users[userIndex].passwordHash = hashPassword(password);
    }

    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return { success: true, user: users[userIndex] };
  },

  // Add a completed test run to user history
  addTestResult(score, maxScore, level, breakdown) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: _t('auth.notLoggedIn') };

    const users     = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) return { success: false, message: _t('auth.userNotFound') };

    const newTest = {
      testId:   'test_' + Date.now(),
      date:     new Date().toISOString(),
      score,
      maxScore,
      level,
      breakdown
    };

    users[userIndex].history.push(newTest);
    users[userIndex].currentLevel = level;

    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return { success: true, test: newTest };
  },

  // Retrieve list of all registered users
  getAllUsers() {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  },

  // --- QUESTIONS MANAGEMENT (ADMIN CRUD) ---

  // Retrieve all questions
  getQuestions() {
    let questions = localStorage.getItem(KEYS.QUESTIONS);
    if (!questions) {
      this.resetQuestions();
      questions = localStorage.getItem(KEYS.QUESTIONS);
    }
    return JSON.parse(questions);
  },

  // Save (Create or Update) a question
  saveQuestion(questionData) {
    const questions = this.getQuestions();

    if (questionData.id) {
      // Edit existing
      const index = questions.findIndex(q => q.id === questionData.id);
      if (index !== -1) questions[index] = { ...questions[index], ...questionData };
    } else {
      // Create new
      questions.push({ ...questionData, id: 'q_' + Date.now() });
    }

    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
    return { success: true };
  },

  // Delete a question
  deleteQuestion(id) {
    const questions = this.getQuestions().filter(q => q.id !== id);
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
    return { success: true };
  },

  // Restore initial default question set
  resetQuestions() {
    const defaultPool = window.defaultQuestions || [];
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultPool));
  }
};

// Export globally
window.State = State;
