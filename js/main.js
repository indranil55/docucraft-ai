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
      btn.target.classList.add('active');
    });
  });
}

// ক্যাটাগরি ফিল্টার ফাংশন যা কার্ডগুলোর data-cat ধরে ফিল্টার করবে
function filterCategory(cat, btn) {
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    if (cat === 'all' || cardCat === cat) {
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
  }
}

function closeSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
