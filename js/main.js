// DocuCraftAI - Main Core, Access Lock Controller & Tool Handlers

document.addEventListener('DOMContentLoaded', () => {
  console.log("DocuCraftAI Main Script Initialized.");
  initCategoryFilter();
  initDropzoneHandlers();
  if (typeof updateHeaderAuthUI === 'function') {
    updateHeaderAuthUI();
  }
});

function initCategoryFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
}

function filterCategory(cat, btn) {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(card => {
    if (cat === 'all' || card.getAttribute('data-cat') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function initDropzoneHandlers() {
  const dropzone = document.getElementById('wsDropzone');
  const fileInput = document.getElementById('wsFileInput');

  if (dropzone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      if (!checkUserAccess(typeof activeTool !== 'undefined' ? activeTool : '')) return;
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        if (fileInput.hasAttribute('multiple')) {
          selectedFiles = [...selectedFiles, ...Array.from(files)];
        } else {
          selectedFiles = Array.from(files);
        }
        if (typeof renderFileList === 'function') renderFileList();
        triggerFileSuccessAnimation(`${selectedFiles.length} file(s) selected`);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (!checkUserAccess(typeof activeTool !== 'undefined' ? activeTool : '')) return;
      if (e.target.files.length > 0) {
        if (fileInput.hasAttribute('multiple')) {
          selectedFiles = [...selectedFiles, ...Array.from(e.target.files)];
        } else {
          selectedFiles = Array.from(e.target.files);
        }
        if (typeof renderFileList === 'function') renderFileList();
        triggerFileSuccessAnimation(`${selectedFiles.length} file(s) selected`);
      }
    });
  }
}

function triggerFileSuccessAnimation(msg) {
  const dropText = document.getElementById('wsDropText');
  const dropzone = document.getElementById('wsDropzone');
  
  if (dropzone && dropText) {
    dropzone.classList.add('dropzone-success');
    dropText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i> ${msg}`;
    setTimeout(() => {
      dropzone.classList.remove('dropzone-success');
    }, 1500);
  }
}

// কঠোর লক সিস্টেম: ভিজিটর সাইট ঘুরে দেখতে পারবে, কিন্তু টুল ওপেন করতে গেলেই লগইন চাইবে
function checkUserAccess(toolKey) {
  const isLogged = localStorage.getItem('docucraft_logged_in') === 'true';
  const loggedUserEmail = localStorage.getItem('docuCraft_user_email') || sessionStorage.getItem('docuCraft_logged_in_user');
  
  if (!isLogged || !loggedUserEmail) {
    sessionStorage.setItem('pending_tool', toolKey);
    if (typeof closeWorkspace === 'function') closeWorkspace();
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    } else {
      alert('Please login or sign up first to use this tool.');
    }
    return false;
  }
  return true;
}

// আসল launchTool ফাংশনটি tools.js-এ আছে, তাই এখানে শুধু এক্সেস চেক রেখে বাকিটা গাইড করা হলো
const originalLaunchTool = window.launchTool;
// Note: launchTool is fully handled inside tools.js, secured via checkUserAccess check.

function handleBackdropClick(event) {
  if (event.target.id === 'workspaceOverlay') {
    if (typeof closeWorkspace === 'function') closeWorkspace();
  }
}

function openSmartAiChat() {
  if (!checkUserAccess('aiChat')) {
    return;
  }
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  }
}

function closeSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
