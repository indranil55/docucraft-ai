// DocuCraftAI - Main Core, Access Lock Controller & Tool Handlers

let activeTool = '';
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log("DocuCraftAI Main Script Initialized.");
  initCategoryFilter();
  initDropzoneHandlers();
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

// স্থায়ী এবং সঠিক লগইন লক চেক সিস্টেম
function checkUserAccess(toolKey) {
  const isLoggedIn = localStorage.getItem('docucraft_logged_in');
  
  // যদি ইউজার লগইন করা না থাকে (বা স্ট্যাটাস true না হয়)
  if (!isLoggedIn || isLoggedIn !== 'true') {
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    } else {
      alert('Please login or sign up first to use this tool.');
    }
    return false;
  }
  return true; // লগইন করা থাকলে সরাসরি টুল খুলবে
}

function launchTool(toolKey) {
  // টুল ওপেন করার আগে লগইন লক চেক করবে
  if (!checkUserAccess(toolKey)) {
    return;
  }

  activeTool = toolKey;
  selectedFiles = [];

  const overlay = document.getElementById('workspaceOverlay');
  const titleEl = document.getElementById('wsTitle');
  const descEl = document.getElementById('wsDesc');
  const customUI = document.getElementById('wsCustomUI');
  const dropText = document.getElementById('wsDropText');
  const fileInput = document.getElementById('wsFileInput');
  const fileList = document.getElementById('wsFileList');
  
  if (!overlay) return;

  overlay.style.display = 'flex';
  document.body.classList.add('modal-open');
  if (fileList) fileList.innerHTML = '';

  const toolInfo = typeof getToolDetails === 'function' ? getToolDetails(toolKey) : { title: toolKey, desc: 'Process file', dropText: 'Tap to select file' };
  
  if (titleEl) titleEl.innerText = toolInfo.title;
  if (descEl) descEl.innerText = toolInfo.desc;
  if (dropText) dropText.innerText = toolInfo.dropText;
  if (customUI) customUI.innerHTML = toolInfo.customHTML || '';

  // Merge PDF বা Image to PDF এর ক্ষেত্রে একাধিক ফাইল সিলেক্ট করার পারমিশন দেবে
  if (fileInput) {
    if (toolKey === 'merge' || toolKey === 'jpgToPdf' || toolKey === 'wordToPdf' || toolKey === 'excelToPdf') {
      fileInput.setAttribute('multiple', 'true');
    } else {
      fileInput.removeAttribute('multiple');
    }
  }
}

function closeWorkspace() {
  const overlay = document.getElementById('workspaceOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.classList.remove('modal-open');
  
  selectedFiles = [];
  const fileList = document.getElementById('wsFileList');
  const progress = document.getElementById('processingProgress');
  const dropText = document.getElementById('wsDropText');
  const fileInput = document.getElementById('wsFileInput');

  if (fileList) fileList.innerHTML = '';
  if (progress) progress.style.display = 'none';
  if (fileInput) fileInput.value = '';
  if (dropText) dropText.innerHTML = 'Tap to select file';
}

function handleBackdropClick(event) {
  if (event.target.id === 'workspaceOverlay') {
    closeWorkspace();
  }
}

function openSmartAiChat() {
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
