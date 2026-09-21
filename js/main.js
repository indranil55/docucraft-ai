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
          // FIX: Prevent duplicate or accidental accumulation of files on drop
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
          // FIX: Prevent duplicate file addition on file input change
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

// ৩ বার ফ্রি ব্যবহারের পর ৪র্থ বারে লগইন/সাইন-ইন পপআপ দেখানোর লজিক
function checkUserAccess(toolKey) {
  // যদি ইউজার ইতিমধ্যে লগইন করা থাকে, তবে কোনো লিমিট থাকবে না
  const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (currentUser) {
    return true;
  }

  // লোকাল স্টোরেজ থেকে ব্যবহারের কাউন্ট চেক করা
  let usageCount = parseInt(localStorage.getItem('toolUsageCount')) || 0;

  if (usageCount >= 3) {
    // ৩ বার ব্যবহার করা হয়ে গেলে লগইন মোডাল ওপেন করবে
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    } else {
      alert("ফ্রি ব্যবহারের লিমিট শেষ! আরও কাজ করতে অনুগ্রহ করে লগইন বা সাইন-ইন করুন।");
    }
    return false; // কাজ আটকে দেবে যাতে লগইন ছাড়া আর প্রসেস না হয়
  }

  // প্রতিবার সফলভাবে কাজ করার সময় কাউন্ট ১ বাড়িয়ে দেওয়া
  usageCount++;
  localStorage.setItem('toolUsageCount', usageCount);
  return true;
}

// আসল launchTool ফাংশনটি tools.js-এ আছে, তাই এখানে শুধু এক্সেস চেক রেখে বাকিটা গাইড করা হলো
const originalLaunchTool = window.launchTool;
// Note: launchTool is fully handled inside tools.js, secured via checkUserAccess check.

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
