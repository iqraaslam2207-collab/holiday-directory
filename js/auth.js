import { initAuthMotionIfPresent } from './motion-ui.js';

document.addEventListener('DOMContentLoaded', function() {
  initAuthForms();
  try {
    initAuthMotionIfPresent();
  } catch (err) {
    console.warn('Auth motion init failed:', err);
  }
});

function initAuthForms() {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const passwordInput = document.getElementById('password');
  const strengthBar = document.querySelector('.password-strength span');

  if (signInForm) {
    signInForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateSignIn()) return;
      showAuthMessage('Welcome back! Redirecting...', 'success');
      setTimeout(function() {
        window.location.href = 'home.html';
      }, 1200);
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateSignUp()) return;
      showAuthMessage('Account created!', 'success');
      setTimeout(function() {
        window.location.href = 'sign-in.html';
      }, 1200);
    });
  }

  if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', function() {
      const score = getPasswordStrength(this.value);
      strengthBar.style.width = score.percent + '%';
      strengthBar.style.background = score.color;
    });
  }

  document.querySelectorAll('.social-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showAuthMessage('Social login coming soon.', 'info');
    });
  });
}

function validateSignIn() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  let valid = true;

  clearErrors(signInFormFields());

  if (!email.value.trim() || !email.value.includes('@')) {
    setError(email, 'Enter a valid email address.');
    valid = false;
  }

  if (!password.value || password.value.length < 6) {
    setError(password, 'Password must be at least 6 characters.');
    valid = false;
  }

  return valid;
}

function validateSignUp() {
  const name = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');
  const terms = document.getElementById('terms');
  let valid = true;

  clearErrors(signUpFormFields());

  if (!name.value.trim()) {
    setError(name, 'Enter your full name.');
    valid = false;
  }

  if (!email.value.trim() || !email.value.includes('@')) {
    setError(email, 'Enter a valid email address.');
    valid = false;
  }

  if (!password.value || password.value.length < 8) {
    setError(password, 'Password must be at least 8 characters.');
    valid = false;
  }

  if (password.value !== confirm.value) {
    setError(confirm, 'Passwords do not match.');
    valid = false;
  }

  if (terms && !terms.checked) {
    showAuthMessage('Accept the terms to continue.', 'error');
    valid = false;
  }

  return valid;
}

function signInFormFields() {
  return [document.getElementById('email'), document.getElementById('password')];
}

function signUpFormFields() {
  return [
    document.getElementById('fullname'),
    document.getElementById('email'),
    document.getElementById('password'),
    document.getElementById('confirmPassword')
  ];
}

function setError(input, message) {
  const group = input.closest('.form-group');
  const error = group.querySelector('.form-error');
  group.classList.add('has-error');
  error.textContent = message;
}

function clearErrors(fields) {
  fields.forEach(function(field) {
    if (!field) return;
    const group = field.closest('.form-group');
    group.classList.remove('has-error');
    const error = group.querySelector('.form-error');
    if (error) error.textContent = '';
  });
}

function getPasswordStrength(password) {
  if (!password) return { percent: 0, color: '#e8e0d4' };
  if (password.length < 6) return { percent: 25, color: '#C1121F' };
  if (password.length < 8) return { percent: 50, color: '#D4A853' };
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { percent: 100, color: '#2D6A4F' };
  return { percent: 75, color: '#D4A853' };
}

function showAuthMessage(text, type) {
  let toast = document.querySelector('.auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }

  toast.className = 'auth-toast auth-toast--' + type + ' auth-toast--show';
  toast.textContent = text;

  setTimeout(function() {
    toast.classList.remove('auth-toast--show');
  }, 2800);
}
