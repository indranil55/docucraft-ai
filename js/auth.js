// DocuCraft AI - Authentication & Gate Security Logic (Unlimited Access - 3 Use Limit Removed)

let isSignUpMode = false;
let isResetMode = false;

const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7ypSy3VkabsXyc0aiDStAC7xCsEW5Xks-OPGa9SUmpDIlgaXidHT7jC56cQlw-LpXsw/exec";

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

// Gate Security: Unlimited Access enabled (3-use restriction removed)
function checkGateAccess(toolName) {
  return true;
}

// Hook into tool launching if launchTool exists globally
if (typeof window.launchTool === 'function') {
  const originalLaunchTool = window.launchTool;
  window.launchTool = function(toolName) {
    if (checkGateAccess(toolName)) {
      originalLaunchTool(toolName);
    }
  };
}

function openAuthModal() {
  const isLogged = localStorage.getItem('docucraft_logged_in') === 'true';
  if (isLogged) {
    handleLogout();
    return;
  }

  let modal = document.getElementById('authModal');
  if (!modal) {
    const modalHTML = `
      <div id="authModal" class="workspace-overlay" style="display: flex;" onclick="if(event.target.id==='authModal') closeAuthModal()">
        <div class="workspace-box" style="max-width: 400px; border-radius: 20px; padding: 20px 24px;">
          <div class="workspace-header" style="margin-bottom: 12px; padding-bottom: 8px;">
            <h3 id="authTitle" style="margin: 0; font-size: 18px;">User Login</h3>
            <button class="close-btn" onclick="closeAuthModal()" style="font-size: 20px;">&times;</button>
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600;">Email Address:</label>
            <input type="email" id="authEmail" class="form-control" placeholder="Enter your email" autocomplete="email" style="padding: 8px 12px; font-size: 14px; width: 100%; box-sizing: border-box;">
          </div>
          <div class="form-group" id="passwordGroup" style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600;">Password:</label>
            <div style="position: relative;">
              <input type="password" id="authPassword" class="form-control" placeholder="Enter password (min 8 chars)" style="padding: 8px 38px 8px 12px; font-size: 14px; width: 100%; box-sizing: border-box;" autocomplete="current-password">
              <span onclick="togglePasswordVisibility()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #64748b; font-size: 14px;">
                <i class="fas fa-eye" id="eyeIcon"></i>
              </span>
            </div>
          </div>
          <button class="btn-main" id="authSubmitBtn" onclick="handleAuthSubmit()" style="margin-top: 4px; padding: 10px; width: 100%; font-size: 14px; border-radius: 8px;">Login</button>
          <div id="authToggleContainer" style="text-align: center; margin-top: 10px; font-size: 12px; color: #64748b;">
            Don't have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700;">Sign Up</a>
            <br><a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #64748b; font-size: 11px; font-weight: 600; display: inline-block; margin-top: 4px;">Forgot Password?</a>
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
        <br><a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #64748b; font-size: 11px; font-weight: 600; display: inline-block; margin-top: 4px;">Forgot Password?</a>
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

  localStorage.setItem('docuCraft_user_email', email);
  localStorage.setItem('docucraft_logged_in', 'true');
  sessionStorage.setItem('docuCraft_logged_in_user', email);

  closeAuthModal();
  updateHeaderAuthUI();

  const actionType = isSignUpMode ? 'Sign Up' : 'Login';
  sendDataToGoogleSheet(email, actionType);

  const pendingTool = sessionStorage.getItem('pending_tool');
  if (pendingTool && typeof launchTool === 'function') {
    sessionStorage.removeItem('pending_tool');
    launchTool(pendingTool);
  }
}

function updateHeaderAuthUI() {
  const isLogged = localStorage.getItem('docucraft_logged_in') === 'true';
  const loggedUser = localStorage.getItem('docuCraft_user_email') || sessionStorage.getItem('docuCraft_logged_in_user');
  
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

    authBtn.setAttribute('onclick', 'openAuthModal()');

    if (isLogged) {
      authBtn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
      authBtn.style.background = '#64748b';
      authBtn.style.color = '#ffffff';
      authBtn.style.border = 'none';
      authBtn.style.width = '38px';
      authBtn.style.height = '38px';
      authBtn.style.borderRadius = '50%';
      authBtn.title = `Logged in as ${loggedUser || 'User'} (Click to Logout)`;
    } else {
      authBtn.innerHTML = `<i class="fas fa-user"></i>`;
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
  if (confirm('Are you sure you want to log out?')) {
    localStorage.removeItem('docucraft_logged_in');
    localStorage.removeItem('docuCraft_user_email');
    sessionStorage.removeItem('docuCraft_logged_in_user');
    sessionStorage.removeItem('pending_tool');
    alert('Logged out successfully.');
    location.reload();
  }
}
