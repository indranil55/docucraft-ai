let isSignUpMode = false;

// আপনার গুগল শিটের সঠিক Web App URL
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7ypSy3VkabsXyc0aiDStAC7xCsEW5Xks-OPGa9SUmpDIlgaXidHT7jC56cQlw-LpXsw/exec";

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

// পাসওয়ার্ড দেখতে পাওয়ার জন্য টগল ফাংশন
function togglePasswordVisibility() {
  const passInput = document.getElementById('authPassword');
  const eyeIcon = document.getElementById('eyeIcon');
  if (!passInput) return;
  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (eyeIcon) {
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }
  } else {
    passInput.type = 'password';
    if (eyeIcon) {
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }
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

    // গুগল শিটে ডেটা পাঠানো
    await sendDataToGoogleSheet(email, 'Sign Up');

    alert('Account created successfully!');
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
      
      // গুগল শিটে ডেটা পাঠিয়ে দ্রুত পেজ রিলোড নিশ্চিত করা
      await sendDataToGoogleSheet(email, 'Login');

      closeAuthModal();
      location.reload();
    } else {
      alert('Incorrect email or password.');
    }
  }
}

// হোমপেজের টুলগুলোতে ক্লিক করার সময় লগইন চেক করার ফাংশন
function checkUserAccess(event) {
  const loggedUser = sessionStorage.getItem('docuCraft_logged_in_user');
  if (!loggedUser) {
    if (event) event.preventDefault();
    alert('Please login or register first to use the tools.');
    openAuthModal();
    return false;
  }
  return true;
}

// গুগল শিটে ডেটা পাঠানোর ফাংশন (ফাস্ট ও সিকিউরড)
async function sendDataToGoogleSheet(email, actionType) {
  if (!GOOGLE_SHEET_WEB_APP_URL || GOOGLE_SHEET_WEB_APP_URL.includes("YOUR_URL")) {
    return;
  }

  try {
    await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        action: actionType
      })
    });
  } catch (err) {
    console.error('Google Sheet Error:', err);
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
