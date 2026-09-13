// DocuCraftAI - Main Core & Tool Handlers Controller

document.addEventListener('DOMContentLoaded', () => {
  console.log("DocuCraftAI Main Script Initialized.");
  initCategoryFilter();
});

// ক্যাটাগরি ফিল্টার করার ফাংশন
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

// ওয়ার্কস্পেস ওপেন করার মূল ফাংশন (লক সিস্টেম সহ)
function launchTool(toolKey) {
  // অথেন্টিকেশন লক চেক করা
  if (typeof checkUserAccess === 'function' && !checkUserAccess(toolKey)) {
    return;
  }

  const overlay = document.getElementById('workspaceOverlay');
  const titleEl = document.getElementById('wsTitle');
  const descEl = document.getElementById('wsDesc');
  const customUI = document.getElementById('wsCustomUI');
  const dropText = document.getElementById('wsDropText');
  
  if (!overlay) return;

  overlay.style.display = 'flex';
  document.body.classList.add('modal-open');

  // টুল অনুযায়ী টাইটেল ও বিবরণ সেট করা
  const toolInfo = getToolDetails(toolKey);
  if (titleEl) titleEl.innerText = toolInfo.title;
  if (descEl) descEl.innerText = toolInfo.desc;
  if (dropText) dropText.innerText = toolInfo.dropText;
  if (customUI) customUI.innerHTML = toolInfo.customHTML || '';
}

function closeWorkspace() {
  const overlay = document.getElementById('workspaceOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.classList.remove('modal-open');
  
  const fileList = document.getElementById('wsFileList');
  const progress = document.getElementById('processingProgress');
  if (fileList) fileList.innerHTML = '';
  if (progress) progress.style.display = 'none';
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

function executeToolAction() {
  const progress = document.getElementById('processingProgress');
  const fill = document.getElementById('progressFill');
  const percent = document.getElementById('progressPercent');
  const text = document.getElementById('progressText');

  if (!progress) return;
  progress.style.display = 'block';

  let currentProgress = 0;
  const interval = setInterval(() => {
    currentProgress += 20;
    if (fill) fill.style.width = currentProgress + '%';
    if (percent) percent.innerText = currentProgress + '%';
    
    if (currentProgress === 40) {
      if (text) text.innerText = 'Processing file...';
    } else if (currentProgress === 80) {
      if (text) text.innerText = 'Optimizing format...';
    } else if (currentProgress >= 100) {
      clearInterval(interval);
      if (text) text.innerText = 'Complete! Downloading...';
      setTimeout(() => {
        alert('File processed successfully!');
        closeWorkspace();
      }, 500);
    }
  }, 250);
}

// বিভিন্ন টুলের বিবরণ ও সেটিংস
function getToolDetails(key) {
  const map = {
    kbResizer: {
      title: 'Photo & Sign KB / MB Resizer',
      desc: 'Upload your image and resize it precisely to your target KB or MB.',
      dropText: 'Tap to select photo or signature',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Target Size (KB):</label><input type="number" class="form-control" value="50" placeholder="e.g. 50"></div>'
    },
    passportGrid: {
      title: 'Passport Photo Sheet Generator',
      desc: 'Generate multiple passport photos neatly arranged on a single A4 sheet.',
      dropText: 'Tap to select your passport photo',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Copies Count:</label><select class="form-control"><option value="8">8 Copies</option><option value="16">16 Copies</option></select></div>'
    },
    sigPad: {
      title: 'Digital Signature Maker',
      desc: 'Draw your signature on the screen and export as transparent PNG.',
      dropText: 'Draw signature below or upload',
      customHTML: '<div style="border:1px solid rgba(255,255,255,0.2); border-radius:10px; height:120px; background:#0f172a; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-weight:600;">Signature Drawing Pad Area</div>'
    },
    compress: {
      title: 'Compress PDF',
      desc: 'Reduce your PDF file size quickly while maintaining high document clarity.',
      dropText: 'Tap to select PDF file'
    },
    merge: {
      title: 'Merge PDF',
      desc: 'Combine multiple PDF files into one single organized document.',
      dropText: 'Tap to select multiple PDF files'
    }
  };

  return map[key] || {
    title: 'Document Tool Studio',
    desc: 'Process your files securely right inside your browser.',
    dropText: 'Tap to select file'
  };
}
