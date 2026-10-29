// DocuCraftAI - Main Core, Access Lock Controller & Tool Handlers

document.addEventListener('DOMContentLoaded', () => {
  console.log("DocuCraftAI Main Script Initialized.");
  initCategoryFilter();
  initDropzoneHandlers();
  if (typeof updateHeaderAuthUI === 'function') {
    updateHeaderAuthUI();
  }

  // FIX: Universal robust history popstate handler for ALL modals, tools, overlays & widgets across the site
  window.addEventListener('popstate', function(event) {
    let modalWasClosed = false;

    // 1. Close Workspace Overlay if open
    const workspaceOverlay = document.getElementById('workspaceOverlay');
    if (workspaceOverlay && (workspaceOverlay.style.display === 'flex' || workspaceOverlay.style.display === 'block')) {
      workspaceOverlay.style.display = 'none';
      modalWasClosed = true;
    }

    // 2. Close Smart AI Chat Modal if open
    const aiModal = document.getElementById('smartAiChatModal');
    if (aiModal && (aiModal.style.display === 'flex' || aiModal.style.display === 'block')) {
      aiModal.style.display = 'none';
      modalWasClosed = true;
    }

    // 3. Close any other open modals or calculator popups (.calc-modal or general modals)
    const openModals = document.querySelectorAll('.calc-modal, .modal, .popup-overlay');
    openModals.forEach(modal => {
      if (modal && (modal.style.display === 'flex' || modal.style.display === 'block')) {
        modal.style.display = 'none';
        modalWasClosed = true;
      }
    });

    // 4. Safely trigger workspace close function if available
    if (typeof closeWorkspace === 'function') {
      try { closeWorkspace(); } catch(e) {}
    }

    if (modalWasClosed) {
      if (typeof unlockPageScroll === 'function') {
        unlockPageScroll();
      } else {
        document.body.style.overflow = '';
      }
      document.body.classList.remove('modal-open');
    }

    // Always ensure URL hash/state is cleaned up so browser stays strictly on site home
    if (window.location.hash || window.location.href.includes('#')) {
      try {
        history.replaceState(null, '', window.location.pathname);
      } catch(e) {}
    }
  });
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
          const newFiles = Array.from(files);
          const uniqueFiles = newFiles.filter(nf => !selectedFiles.some(sf => sf.name === nf.name && sf.size === nf.size));
          selectedFiles = [...selectedFiles, ...uniqueFiles];
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
          const newFiles = Array.from(e.target.files);
          const uniqueFiles = newFiles.filter(nf => !selectedFiles.some(sf => sf.name === nf.name && sf.size === nf.size));
          selectedFiles = [...selectedFiles, ...uniqueFiles];
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

function checkUserAccess(toolKey) {
  return true;
}

const originalLaunchTool = window.launchTool;

function handleBackdropClick(event) {
  if (event.target.id === 'workspaceOverlay') {
    event.stopPropagation();
    event.preventDefault();
    return false;
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
    try {
      const chatStateUrl = window.location.pathname + '#tool-aiChat';
      history.pushState({ modalOpen: true }, '', chatStateUrl);
    } catch(e) {}
  }
}

function closeSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch(e) {}
  }
}
