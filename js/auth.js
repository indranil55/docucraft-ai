let isSignUpMode = false;

function openAuthModal() {
  document.getElementById('authModal').style.display = 'flex';
  setTimeout(() => document.getElementById('authEmail').focus(), 200);
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  document.getElementById('authTitle').innerText = isSignUpMode ? 'Create Account (Sign Up)' : 'User Login';
  document.getElementById('authSubmitBtn').innerText = isSignUpMode ? 'Register' : 'Login';
  document.getElementById('authToggleText').innerText = isSignUpMode ? 'Already have an account?' : "Don't have an account?";
}

async function handleAuthSubmit() {
  const emailInput = document.getElementById('authEmail');
  const passInput = document.getElementById('authPassword');
  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput.value;

  if (!email || !pass) {
    alert('Please enter both email and password.');
    return;
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (pass.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }

  if (isSignUpMode) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePasswordHash(pass, salt);
    localStorage.setItem('docuCraft_user_email', email);
    localStorage.setItem('docuCraft_user_salt', bytesToBase64(salt));
    localStorage.setItem('docuCraft_user_hash', bytesToBase64(hash));
    alert('Account created on this device.');
    toggleAuthMode();
    passInput.value = '';
  } else {
    const savedEmail = localStorage.getItem('docuCraft_user_email');
    const savedSalt = localStorage.getItem('docuCraft_user_salt');
    const savedHash = localStorage.getItem('docuCraft_user_hash');

    if (!savedEmail || !savedSalt || !savedHash) {
      alert('No local account found. Please Sign Up first.');
      return;
    }

    const salt = base64ToBytes(savedSalt);
    const hash = await derivePasswordHash(pass, salt);
    const ok = email === savedEmail && timingSafeEqual(hash, base64ToBytes(savedHash));

    if (ok) {
      sessionStorage.setItem('docuCraft_logged_in_user', email);
      alert('Login successful! Welcome back.');
      closeAuthModal();
      location.reload();
    } else {
      alert('Incorrect email or password.');
    }
  }
}

async function derivePasswordHash(password, saltBytes) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 120000, hash: 'SHA-256' },
    material,
    256
  );
  return new Uint8Array(bits);
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, ch => ch.charCodeAt(0));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    sessionStorage.removeItem('docuCraft_logged_in_user');
    alert('Logged out successfully.');
    location.reload();
  }
}
