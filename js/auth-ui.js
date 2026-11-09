// js/auth-ui.js
import { loginUser, resetPassword } from './auth-service.js';

// DOM Elements
const modal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const resetForm = document.getElementById('reset-form');
const authError = document.getElementById('auth-error');

/**
 * Opens or closes the authentication modal.
 */
export function toggleModal(show = true) {
  if (!modal) return;

  modal.classList.toggle('active', show);
  modal.setAttribute('aria-hidden', !show);

  if (show) {
    clearError();
    modal.querySelector('input')?.focus();
  }
}

/**
 * Switches views between Login and Password Reset forms.
 */
export function switchView(viewName) {
  const isReset = viewName === 'reset';

  if (loginForm) loginForm.hidden = isReset;
  if (resetForm) resetForm.hidden = !isReset;
  clearError();
}

/**
 * Closes modal on ESC key press.
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('active')) {
    toggleModal(false);
  }
});

/**
 * Login form submit handler
 */
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = loginForm.email?.value.trim();
    const password = loginForm.password?.value;

    setLoading(true);
    try {
      await loginUser(email, password);
      loginForm.reset();
      toggleModal(false);
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  });
}

/**
 * Reset password form submit handler
 */
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = resetForm.email?.value.trim();

    setLoading(true);
    try {
      await resetPassword(email);
      resetForm.reset();
      alert('Password reset link sent to your email.');
      switchView('login');
    } catch (err) {
      showError(err.message || 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  });
}

function setLoading(isLoading) {
  const submitBtn = modal?.querySelector('form:not([hidden]) button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Processing...' : 'Submit';
  }
}

function showError(message) {
  if (authError) {
    authError.textContent = message;
    authError.hidden = false;
  }
}

function clearError() {
  if (authError) {
    authError.textContent = '';
    authError.hidden = true;
  }
}
