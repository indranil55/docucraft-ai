let isSignUpMode = false;
let isResetMode = false;

// আপনার গুগল শিটের সঠিক Web App URL
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7ypSy3VkabsXyc0aiDStAC7xCsEW5Xks-OPGa9SUmpDIlgaXidHT7jC56cQlw-LpXsw/exec";

function openAuthModal() {
  document.getElementById('authModal').style.display = 'flex';
  setTimeout(() => document.getElementById('authEmail').focus(), 200);
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
  resetAuthFormState();
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  isResetMode = false;
  updateAuthModalUI();
}

function toggleResetMode() {
  isResetMode = !isResetMode;
  isSignUpMode = false;
  updateAuthModalUI();
}

function updateAuthModalUI() {
  const title = document.getElementById('authTitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const passwordGroup = document.getElementById('passwordGroup');
  const toggleContainer = document.getElementById('authToggleContainer');

  if (isResetMode) {
    title.innerText = 'Reset Password';
    submitBtn.innerText = 'Reset Password';
    if (passwordGroup) passwordGroup.style.display = 'none';
    if (toggleContainer) {
      toggleContainer.innerHTML = 'Remembered your password? <a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #e5322d; font-weight: 700;">Login</a>';
    }
  } else if (isSignUpMode) {
    title.innerText = 'Create Account (Sign Up)';
    submitBtn.innerText = 'Register';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = 'Already have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700;">Login</a>';
    }
  } else {
    title.innerText = 'User Login';
    submitBtn.innerText = 'Login';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = `
        <span id="authToggleText">Don't have an account?</span> 
        <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700;">Sign Up</a>
        <br><a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #64748b; font-size: 11px; font-weight: 650; display: inline-block; margin-top: 4px;">Forgot Password?</a>
      `;
    }
  }
}

function resetAuthFormState() {
  isSignUpMode = false;
  isResetMode = false;
  updateAuthModalUI();
  const emailInput = document.getElementById('authEmail');
  const passInput = document.getElementById('authPassword');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
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

  if (!email) {
    alert('Please enter your email address.');
    return;
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // পাসওয়ার্ড রিসেট মোড
  if (isResetMode) {
    const savedEmail = localStorage.getItem('docuCraft_user_email');
    if (!savedEmail || savedEmail !== email) {
      alert('No account found with this email address.');
      return;
    }

    const newPass = prompt('Enter your new password (minimum 8 characters):');
    if (!newPass) return;
    if (newPass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePasswordHash(newPass, salt);
    localStorage.setItem('docuCraft_user_salt', bytesToBase64(salt));
    localStorage.setItem('docuCraft_user_hash', bytesToBase64(hash));

    await sendDataToGoogleSheet(email, 'Reset Password');
    alert('Password updated successfully! Please login with your new password.');
    toggleResetMode();
    return;
  }

  if (!pass) {
    alert('Please enter your password.');
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

    // সাইন আপ করার সাথে সাথেই গেট খুলে সেশন চালু করে দেওয়া
    localStorage.setItem('docuCraft_logged_in_user', email);
    await sendDataToGoogleSheet(email, 'Sign Up');

    alert('Account created and gate opened successfully!');
    closeAuthModal();
    
    const pendingTool = sessionStorage.getItem('pending_tool');
    if (pendingTool && typeof launchTool === 'function') {
      sessionStorage.removeItem('pending_tool');
      launchTool(pendingTool);
    }
    return;
  } else {
    const savedEmail = localStorage.getItem('docuCraft_user_email');
    const savedSalt = localStorage.getItem('docuCraft_user_salt');
    const savedHash = localStorage.getItem('docuCraft_user_hash');

    if (!savedEmail || !savedSalt || !savedHash || savedEmail !== email) {
      alert('Account not found or email does not match. Please Sign Up first.');
      return;
    }

    const salt = base64ToBytes(savedSalt);
    const hash = await derivePasswordHash(pass, salt);
    const ok = timingSafeEqual(hash, base64ToBytes(savedHash));

    if (ok) {
      // লোকাল স্টোরেজে স্থায়ীভাবে গেট আনলক করে রাখা
      localStorage.setItem('docuCraft_logged_in_user', email);
      await sendDataToGoogleSheet(email, 'Login');

      closeAuthModal();
      
      const pendingTool = sessionStorage.getItem('pending_tool');
      if (pendingTool && typeof launchTool === 'function') {
        sessionStorage.removeItem('pending_tool');
        launchTool(pendingTool);
      }
    } else {
      alert('Incorrect password.');
    }
  }
}

// গেট চেক করার ফাস্ট ফাংশন (localStorage ব্যবহার করায় আর বারবার পাসওয়ার্ড লাগবে না)
function checkUserAccess(toolName, event) {
  const loggedUser = localStorage.getItem('docuCraft_logged_in_user');
  if (!loggedUser) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    sessionStorage.setItem('pending_tool', toolName);
    openAuthModal();
    return false;
  }
  return true;
}

// গুগল শিটে ডেটা পাঠানোর ফাংশন
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
  if (confirm('Are you sure you want to lock the gate and log out?')) {
    localStorage.removeItem('docuCraft_logged_in_user');
    alert('Gate locked successfully.');
    location.reload();
  }
}
