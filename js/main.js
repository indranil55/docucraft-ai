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

// ৩ বার ফ্রিতে ব্যবহারের পর সাইন-ইন করার লিমিট কন্ট্রোল সিস্টেম
function checkUserAccess(toolKey) {
  // যদি ইউজার ইতিমধ্যে লগইন বা সাইন-ইন করা থাকে, তবে কোনো বাধা ছাড়াই ব্যবহার করতে পারবে
  if (typeof isUserLoggedIn === 'function' && isUserLoggedIn()) {
    return true;
  }
  // অথবা লোকাল স্টোরেজে লগইন স্ট্যাটাস চেক করা
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return true;
  }

  // ব্রাউজারের লোকালস্টোরেজ থেকে ব্যবহারের কাউন্ট নেওয়া
  let usageCount = parseInt(localStorage.getItem('freeUsageCount') || '0');

  if (usageCount >= 3) {
    // ৩ বার শেষ হলে ওয়ার্নিং দিয়ে সাইন-ইন মডাল ওপেন করা
    alert("আপনি বিনামূল্যে ৩ বার টুলগুলো ব্যবহার করেছেন। পরবর্তী টুল ব্যবহার করতে দয়া করে সাইন-ইন করুন।");
    
    // উইন্ডোতে যদি সাইন-ইন মডাল খোলার ফাংশন থাকে তা কল করা
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    }
    
    // কাজের স্পেস বা ওভারলে বন্ধ করে দেওয়া যাতে টুল ব্যবহার করতে না পারে
    if (typeof closeWorkspace === 'function') {
      closeWorkspace();
    }
    
    return false; // টুল এক্সেস ব্লক করা
  }

  // সফলভাবে ব্যবহারের পর কাউন্ট ১ বাড়িয়ে সেভ করা
  localStorage.setItem('freeUsageCount', usageCount + 1);
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
