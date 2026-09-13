let isSignUpMode = false;
let isResetMode = false;

// আপনার গুগল শিটের সঠিক Web App URL
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7ypSy3VkabsXyc0aiDStAC7xCsEW5Xks-OPGa9SUmpDIlgaXidHT7jC56cQlw-LpXsw/exec";

// পেজ লোড হওয়ার সাথে সাথে পিডিএফ জেএস ওয়ার্কার এবং ইউজার সেশন চেক করা
window.addEventListener('DOMContentLoaded', () => {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  updateHeaderAuthUI();
  
  const submitBtn = document.getElementById('authSubmitBtn');
  if (submitBtn) {
    submitBtn.onclick = (e) => {
      e.preventDefault();
      handleAuthSubmit();
    };
  }
});

function openAuthModal() {
  let modal = document.getElementById('authModal');
  if (!modal) {
    const modalHTML = `
      <div id="authModal" class="workspace-overlay" style="display: flex;" onclick="if(event.target.id==='authModal') closeAuthModal()">
        <div class="workspace-box" style="max-width: 420px; border-radius: 24px;">
          <div class="workspace-header">
            <h3 id="authTitle">User Login</h3>
            <button class="close-btn" onclick="closeAuthModal()">&times;</button>
          </div>
          <div class="form-group">
            <label>Email Address:</label>
            <input type="email" id="authEmail" class="form-control" placeholder="Enter your email" autocomplete="email">
          </div>
          <div class="form-group" id="passwordGroup">
            <label>Password:</label>
            <div style="position: relative;">
              <input type="password" id="authPassword" class="form-control" placeholder="Enter password (min 8 chars)" style="padding-right: 40px;" autocomplete="current-password">
              <span onclick="togglePasswordVisibility()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #64748b;">
                <i class="fas fa-eye" id="eyeIcon"></i>
              </span>
            </div>
          </div>
          <button class="btn-main" id="authSubmitBtn" onclick="handleAuthSubmit()" style="margin-top: 8px;">Login</button>
          <div id="authToggleContainer" style="text-align: center; margin-top: 14px; font-size: 13px; color: #64748b;">
            Don't have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700;">Sign Up</a>
            <br><a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #64748b; font-size: 11px; font-weight: 650; display: inline-block; margin-top: 4px;">Forgot Password?</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  } else {
    modal.style.display = 'flex';
  }
  document.body.classList.add('modal-open');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
  document.body.classList.remove('modal-open');
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
    if (title) title.innerText = 'Reset Password';
    if (submitBtn) submitBtn.innerText = 'Reset Password';
    if (passwordGroup) passwordGroup.style.display = 'none';
    if (toggleContainer) {
      toggleContainer.innerHTML = 'Remembered your password? <a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #e5322d; font-weight: 700;">Login</a>';
    }
  } else if (isSignUpMode) {
    if (title) title.innerText = 'Create Account (Sign Up)';
    if (submitBtn) submitBtn.innerText = 'Register';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = 'Already have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700;">Login</a>';
    }
  } else {
    if (title) title.innerText = 'User Login';
    if (submitBtn) submitBtn.innerText = 'Login';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = `
        <span>Don't have an account?</span> 
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

function handleAuthSubmit() {
  const emailInput = document.getElementById('authEmail');
  const passInput = document.getElementById('authPassword');
  
  if (!emailInput) return;

  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput ? passInput.value : '';

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (isResetMode) {
    const savedEmail = localStorage.getItem('docuCraft_user_email');
    if (!savedEmail || savedEmail !== email) {
      alert('No account found with this email address.');
      return;
    }
    localStorage.setItem('docuCraft_user_email', email);
    sendDataToGoogleSheet(email, 'Reset Password');
    alert('Password updated successfully! Please login with your new password.');
    toggleResetMode();
    return;
  }

  if (!pass || pass.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }

  // ইনস্ট্যান্ট লগইন এবং সাইন-আপ প্রসেস (নো ল্যাগ)
  localStorage.setItem('docuCraft_user_email', email);
  sessionStorage.setItem('docuCraft_logged_in_user', email);

  // মোডাল সাথে সাথে বন্ধ করা এবং হেডার আপডেট করা
  closeAuthModal();
  updateHeaderAuthUI();

  // ব্যাকগ্রাউন্ডে গুগল শিটে ডাটা পাঠানো (কোনো ডিলে ছাড়া)
  const actionType = isSignUpMode ? 'Sign Up' : 'Login';
  sendDataToGoogleSheet(email, actionType);

  const pendingTool = sessionStorage.getItem('pending_tool');
  if (pendingTool && typeof launchTool === 'function') {
    sessionStorage.removeItem('pending_tool');
    launchTool(pendingTool);
  }
}

function checkUserAccess(toolName) {
  const loggedUser = sessionStorage.getItem('docuCraft_logged_in_user');
  if (!loggedUser) {
    sessionStorage.setItem('pending_tool', toolName);
    openAuthModal(); 
    return false;
  }
  return true;
}

function updateHeaderAuthUI() {
  const loggedUser = sessionStorage.getItem('docuCraft_logged_in_user');
  
  let navActions = document.querySelector('.nav-actions');
  if (!navActions) {
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
      navActions = document.createElement('div');
      navActions.className = 'nav-actions';
      navContainer.appendChild(navActions);
    }
  }

  if (navActions) {
    let authBtn = navActions.querySelector('.auth-icon-btn') || document.getElementById('authNavBtn');
    if (!authBtn) {
      authBtn = document.createElement('button');
      authBtn.className = 'auth-icon-btn';
      authBtn.id = 'authNavBtn';
      navActions.appendChild(authBtn);
    }

    if (loggedUser) {
      authBtn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
      authBtn.setAttribute('onclick', 'handleLogout()');
      authBtn.style.background = '#64748b';
      authBtn.style.color = '#ffffff';
      authBtn.style.border = 'none';
      authBtn.style.width = '38px';
      authBtn.style.height = '38px';
      authBtn.style.borderRadius = '50%';
      authBtn.title = `Logged in as ${loggedUser} (Click to Logout)`;
    } else {
      authBtn.innerHTML = `<i class="fas fa-user"></i>`;
      authBtn.setAttribute('onclick', 'openAuthModal()');
      authBtn.style.background = '#10b981';
      authBtn.style.color = '#ffffff';
      authBtn.style.border = 'none';
      authBtn.style.width = '38px';
      authBtn.style.height = '38px';
      authBtn.style.borderRadius = '50%';
      authBtn.title = 'Login / Sign Up';
    }
  }
}

function sendDataToGoogleSheet(email, actionType) {
  if (!GOOGLE_SHEET_WEB_APP_URL || GOOGLE_SHEET_WEB_APP_URL.includes("YOUR_URL")) return;
  try {
    fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, action: actionType })
    });
  } catch (err) {
    console.error('Google Sheet Error:', err);
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to lock the gate and log out?')) {
    sessionStorage.removeItem('docuCraft_logged_in_user');
    alert('Gate locked successfully.');
    location.reload();
  }
}
