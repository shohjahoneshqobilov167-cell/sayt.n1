// Logic for user login and registration forms

let selectedAvatarId = 'avatar_1';

document.addEventListener('DOMContentLoaded', () => {
  // If user is already logged in, redirect to profile page
  const currentUser = State.getCurrentUser();
  if (currentUser) {
    window.location.href = 'profile.html';
    return;
  }

  // Check URL parameters for tab selection or redirection
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  if (tab === 'signup') {
    switchTab('signup');
  }
});

// Function to switch tabs between Login and Signup
function switchTab(mode) {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const panelLogin = document.getElementById('panel-login');
  const panelSignup = document.getElementById('panel-signup');
  const alertBox = document.getElementById('auth-alert');

  // Clear any existing alert messages
  alertBox.style.display = 'none';

  if (mode === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    panelLogin.classList.add('active');
    panelSignup.classList.remove('active');
  } else {
    tabLogin.classList.remove('active');
    tabSignup.classList.add('active');
    panelLogin.classList.remove('active');
    panelSignup.classList.add('active');
  }
}

// Function to handle avatar selection
function selectAvatar(avatarId) {
  selectedAvatarId = avatarId;

  // Visual updates
  document.querySelectorAll('.avatar-option').forEach(opt => {
    if (opt.getAttribute('data-avatar') === avatarId) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });
}

// Handle Login submit
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const result = State.login(email, password);

  if (result.success) {
    showAlert(window.i18n.t('auth.loginSuccess'), 'success');

    // Redirect logic
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');

    setTimeout(() => {
      if (redirect === 'test') {
        window.location.href = 'test.html';
      } else {
        window.location.href = 'profile.html';
      }
    }, 1000);
  } else {
    showAlert(result.message, 'error');
  }
}

// Handle Signup submit
function handleSignup(event) {
  event.preventDefault();

  const firstName = document.getElementById('signup-firstname').value.trim();
  const lastName = document.getElementById('signup-lastname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const age = document.getElementById('signup-age').value;
  const password = document.getElementById('signup-password').value;

  if (password.length < 6) {
    showAlert(window.i18n.t('auth.passwordShort'), 'error');
    return;
  }

  const result = State.register(firstName, lastName, email, password, age, selectedAvatarId);

  if (result.success) {
    showAlert(window.i18n.t('auth.signupSuccess'), 'success');

    // Redirect logic
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');

    setTimeout(() => {
      if (redirect === 'test') {
        window.location.href = 'test.html';
      } else {
        window.location.href = 'profile.html';
      }
    }, 1000);
  } else {
    showAlert(result.message, 'error');
  }
}

// Helper to show custom alert message
function showAlert(message, type) {
  const alertBox = document.getElementById('auth-alert');
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
}
