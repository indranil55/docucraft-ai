// DocuCraftAI - Main Core & All Tool Handlers Controller

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
        fileInput.files = files;
        triggerFileSuccessAnimation(files[0].name);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        triggerFileSuccessAnimation(fileInput.files[0].name);
      }
    });
  }
}

function triggerFileSuccessAnimation(fileName) {
  const dropText = document.getElementById('wsDropText');
  const dropzone = document.getElementById('wsDropzone');
  
  if (dropzone && dropText) {
    dropzone.classList.add('dropzone-success');
    dropText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i> ${fileName}`;
    setTimeout(() => {
      dropzone.classList.remove('dropzone-success');
    }, 1500);
  }
}

function launchTool(toolKey) {
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
        alert('File processed and downloaded successfully!');
        closeWorkspace();
      }, 500);
    }
  }, 250);
}

function getToolDetails(key) {
  const map = {
    kbResizer: {
      title: 'Photo & Sign KB / MB Resizer',
      desc: 'Compress image precisely to exact target KB or MB as per your requirement.',
      dropText: 'Tap to select photo or signature',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Target Size (KB):</label><input type="number" class="form-control" value="50" placeholder="e.g. 50"></div>'
    },
    passportGrid: {
      title: 'Passport Photo Sheet (Custom / Grid)',
      desc: 'Generate print-ready sheets of custom passport photo copies on a single A4 page.',
      dropText: 'Tap to select your passport photo',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Copies Count:</label><select class="form-control"><option value="8">8 Copies</option><option value="16">16 Copies</option><option value="32">32 Copies</option></select></div>'
    },
    sigPad: {
      title: 'Digital Signature Maker (Sign Pad)',
      desc: 'Draw your signature on screen and download as transparent PNG for form uploads.',
      dropText: 'Upload reference or draw below',
      customHTML: '<div style="border:1px solid rgba(255,255,255,0.2); border-radius:10px; height:120px; background:#0f172a; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-weight:600;">Interactive Signature Drawing Area</div>'
    },
    qrGen: {
      title: 'QR Code & UPI Generator',
      desc: 'Generate instant QR codes for payment links, UPI IDs, or website URLs.',
      dropText: 'Enter text or UPI link below',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Text / URL / UPI:</label><input type="text" class="form-control" placeholder="e.g. yourname@upi"></div>'
    },
    examResizer: {
      title: 'Exam Photo & Signature Resizer',
      desc: 'Resize photo and signature to exact size required for government exam forms.',
      dropText: 'Tap to select exam photo/signature',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Select Exam Profile:</label><select class="form-control"><option value="ssc">SSC / UPSC Standard</option><option value="neet">NEET / JEE Standard</option></select></div>'
    },
    merge: {
      title: 'Merge PDF',
      desc: 'Combine multiple PDF documents into a single organized file in seconds.',
      dropText: 'Tap to select multiple PDF files'
    },
    split: {
      title: 'Split PDF',
      desc: 'Separate one page or an entire set for easy conversion into independent PDF files.',
      dropText: 'Tap to select PDF to split'
    },
    compress: {
      title: 'Compress PDF',
      desc: 'Reduce file size while optimizing for maximal visual and document quality.',
      dropText: 'Tap to select PDF file to compress'
    },
    organize: {
      title: 'Organize / Reorder Pages',
      desc: 'Rearrange, reverse, or reorder the page sequence of your PDF document.',
      dropText: 'Tap to select PDF file'
    },
    rotate: {
      title: 'Rotate PDF',
      desc: 'Rotate upside-down or sideways pages by 90, 180, or 270 degrees.',
      dropText: 'Tap to select PDF to rotate',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Rotation Angle:</label><select class="form-control"><option value="90">90 Degrees Clockwise</option><option value="180">180 Degrees</option><option value="270">270 Degrees</option></select></div>'
    },
    removePages: {
      title: 'Delete PDF Pages',
      desc: 'Remove unwanted, defective, or blank pages from an existing PDF file.',
      dropText: 'Tap to select PDF file'
    },
    jpgToPdf: {
      title: 'Image to PDF (JPG/PNG to PDF)',
      desc: 'Convert gallery pictures, screenshots, or document scans into a standard A4 PDF.',
      dropText: 'Tap to select image files'
    },
    wordToPdf: {
      title: 'Word to PDF (DOC/DOCX to PDF)',
      desc: 'Convert Microsoft Word documents to clean, standardized PDF format.',
      dropText: 'Tap to select Word file'
    },
    excelToPdf: {
      title: 'Excel to PDF (XLS/XLSX to PDF)',
      desc: 'Convert Excel spreadsheets and tables into formatted, printable PDF documents.',
      dropText: 'Tap to select Excel spreadsheet'
    },
    pptToPdf: {
      title: 'PowerPoint to PDF (PPT/PPTX to PDF)',
      desc: 'Transform slideshow decks and presentations into portable PDF files.',
      dropText: 'Tap to select Presentation file'
    },
    htmlToPdf: {
      title: 'HTML / Web to PDF',
      desc: 'Convert HTML text, markup, or web content into downloadable PDF pages.',
      dropText: 'Tap to select HTML file'
    },
    pdfToJpg: {
      title: 'PDF to Image (PDF to JPG/PNG)',
      desc: 'Extract all pages or individual visual graphics from a PDF into JPG images.',
      dropText: 'Tap to select PDF file'
    },
    pdfToWord: {
      title: 'PDF to Word (PDF to DOCX)',
      desc: 'Convert PDF documents into editable Word files with intact textual layout.',
      dropText: 'Tap to select PDF file'
    },
    pdfToExcel: {
      title: 'PDF to Excel (PDF to XLSX)',
      desc: 'Extract tables, cell grids, and numerical sheets from PDF files into Excel.',
      dropText: 'Tap to select PDF file'
    },
    ocr: {
      title: 'OCR - Image to Text',
      desc: 'Extract text from any image (JPG, PNG) in Bengali, Hindi, or English.',
      dropText: 'Tap to select image for OCR'
    },
    editPdf: {
      title: 'Edit PDF',
      desc: 'Add text annotations, markings, or additional notes onto PDF documents.',
      dropText: 'Tap to select PDF file'
    },
    sign: {
      title: 'Sign PDF',
      desc: 'Add handwritten digital signatures or formal verification stamps to your file.',
      dropText: 'Tap to select PDF file'
    },
    watermark: {
      title: 'Watermark PDF',
      desc: 'Stamp customized text like \'CONFIDENTIAL\' or business logos across pages.',
      dropText: 'Tap to select PDF file',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Watermark Text:</label><input type="text" class="form-control" value="CONFIDENTIAL" placeholder="Watermark text"></div>'
    },
    protect: {
      title: 'Protect / Lock PDF',
      desc: 'Encrypt PDF files with a secret password to prevent unauthorized viewing.',
      dropText: 'Tap to select PDF file',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Set Password:</label><input type="password" class="form-control" placeholder="Enter secret password"></div>'
    },
    unlock: {
      title: 'Unlock PDF',
      desc: 'Remove security permissions and password locks from locked documents.',
      dropText: 'Tap to select locked PDF file'
    },
    pageNumbers: {
      title: 'Add Page Numbers',
      desc: 'Add standardized Page N of M stamps at the bottom center of each page.',
      dropText: 'Tap to select PDF file'
    },
    invoiceMaker: {
      title: 'Invoice / Bill Generator',
      desc: 'Generate professional customer billing receipts, invoices, and service memos.',
      dropText: 'Tap or configure invoice details below',
      customHTML: '<div class="form-group" style="margin-top:12px;"><label>Customer Name:</label><input type="text" class="form-control" placeholder="Enter customer name"></div>'
    },
    resumeMaker: {
      title: 'Resume / CV Maker to PDF',
      desc: 'Build and format clean resumes or curriculum vitae ready for job applications.',
      dropText: 'Enter candidate details or upload'
    },
    docMaker: {
      title: 'Prescription / Memo Maker',
      desc: 'Create clean digital prescriptions, diagnostic notes, or customer memos.',
      dropText: 'Enter details or upload template'
    }
  };

  return map[key] || {
    title: 'Document Tool Studio',
    desc: 'Process your files securely right inside your browser.',
    dropText: 'Tap to select file'
  };
}
