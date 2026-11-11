// DocuCraft AI - Authentication & Gate Security Logic (Unlimited Access - 3 Use Limit Removed)

let isSignUpMode = false;
let isResetMode = false;

const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwBYgZTU89Q4oZUyoCFanq_n2bTB85o6QHdjKKtFDsZOCdQP83FZeMUtYIm_PQTAoTuMw/exec";

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
      <div id="authModal" class="workspace-overlay" style="display: flex; align-items: center; justify-content: center; position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.6);" onclick="if(event.target.id==='authModal') closeAuthModal()">
        <div class="workspace-box" style="width: 90%; max-width: 380px; min-height: auto !important; height: auto !important; border-radius: 20px; padding: 22px 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start !important; gap: 0 !important;">
          
          <div class="workspace-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px !important; padding: 0 !important;">
            <h3 id="authTitle" style="margin: 0; font-size: 19px; font-weight: 700;">User Login</h3>
            <button class="close-btn" onclick="closeAuthModal()" style="background: rgba(255,255,255,0.08); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px;">&times;</button>
          </div>
          
          <div class="form-group" style="margin: 0 0 14px 0 !important; padding: 0 !important;">
            <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; opacity: 0.9;">Email Address:</label>
            <input type="email" id="authEmail" class="form-control" placeholder="Enter your email" autocomplete="email" style="width: 100%; height: 44px; padding: 0 14px; font-size: 14px; box-sizing: border-box; border-radius: 10px;">
          </div>
          
          <div class="form-group" id="passwordGroup" style="margin: 0 0 18px 0 !important; padding: 0 !important;">
            <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; opacity: 0.9;">Password:</label>
            <div style="position: relative; width: 100%;">
              <input type="password" id="authPassword" class="form-control" placeholder="Enter password (min 8 chars)" autocomplete="current-password" style="width: 100%; height: 44px; padding: 0 40px 0 14px; font-size: 14px; box-sizing: border-box; border-radius: 10px;">
              <span onclick="togglePasswordVisibility()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; opacity: 0.6; font-size: 15px; display: flex; align-items: center;">
                <i class="fas fa-eye" id="eyeIcon"></i>
              </span>
            </div>
          </div>
          
          <button class="btn-main" id="authSubmitBtn" onclick="handleAuthSubmit()" style="width: 100%; height: 46px; margin: 0 0 14px 0 !important; font-size: 15px; font-weight: 600; border-radius: 12px; cursor: pointer;">Login</button>
          
          <div id="authToggleContainer" style="text-align: center; margin: 0 !important; padding: 0 !important; font-size: 12px; opacity: 0.85;">
            Don't have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700; text-decoration: none;">Sign Up</a>
            <div style="margin-top: 6px;">
              <a href="javascript:void(0)" onclick="toggleResetMode()" style="font-size: 11px; font-weight: 600; text-decoration: none; color: #ffffff; opacity: 0.9;">Forgot Password?</a>
            </div>
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
      toggleContainer.innerHTML = 'Remembered your password? <a href="javascript:void(0)" onclick="toggleResetMode()" style="color: #e5322d; font-weight: 700; text-decoration: none;">Login</a>';
    }
  } else if (isSignUpMode) {
    if (title) title.innerText = 'Create Account (Sign Up)';
    if (submitBtn) submitBtn.innerText = 'Register';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = 'Already have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700; text-decoration: none;">Login</a>';
    }
  } else {
    if (title) title.innerText = 'User Login';
    if (submitBtn) submitBtn.innerText = 'Login';
    if (passwordGroup) passwordGroup.style.display = 'block';
    if (toggleContainer) {
      toggleContainer.innerHTML = `
        Don't have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()" style="color: #e5322d; font-weight: 700; text-decoration: none;">Sign Up</a>
        <div style="margin-top: 6px;">
          <a href="javascript:void(0)" onclick="toggleResetMode()" style="font-size: 11px; font-weight: 600; text-decoration: none; color: #ffffff; opacity: 0.9;">Forgot Password?</a>
        </div>
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
