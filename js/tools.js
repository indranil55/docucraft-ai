// DocuCraft AI - Fully Fixed, Optimized & Cross-Platform Execution Script (iOS & Desktop Ready)

let activeTool = '';
let selectedFiles = [];
let sigCanvasInstance = null;

// Helper to load external scripts dynamically without blocking HTML head
function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensurePdfLibLoaded() {
  if (window.PDFLib || window.pdfLib) return window.PDFLib || window.pdfLib;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
    return window.PDFLib || window.pdfLib;
  } catch {
    return null;
  }
}

async function ensureJsPdfLoaded() {
  if (window.jspdf) return window.jspdf;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    return window.jspdf;
  } catch {
    return null;
  }
}

async function ensurePdfJsLoaded() {
  if (window.pdfjsLib) return window.pdfjsLib;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    return window.pdfjsLib;
  } catch {
    return null;
  }
}

async function ensureTesseractLoaded() {
  if (window.Tesseract) return window.Tesseract;
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    return window.Tesseract;
  } catch {
    return null;
  }
}

function filterCategory(cat, btn) {
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(c => {
    if (cat === 'all' || c.getAttribute('data-cat') === cat) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });
}

function launchTool(toolKey) {
  // Support both 'rot' and 'rotate' aliases
  if (toolKey === 'rot') toolKey = 'rotate';

  if (typeof checkUserAccess === 'function' && !checkUserAccess(toolKey)) {
    return;
  }

  activeTool = toolKey;
  selectedFiles = [];

  const overlay = document.getElementById('workspaceOverlay');
  const title = document.getElementById('wsTitle');
  const desc = document.getElementById('wsDesc');
  const fileInput = document.getElementById('wsFileInput');
  const fileList = document.getElementById('wsFileList');
  const customUI = document.getElementById('wsCustomUI');
  const dropzone = document.getElementById('wsDropzone');
  const dropText = document.getElementById('wsDropText');

  if (fileList) fileList.innerHTML = '';
  if (customUI) customUI.innerHTML = '';
  resetProgress();
  
  if (fileInput) {
    fileInput.value = '';
    // Strict file type restriction per tool
    if (['merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'watermark', 'protect', 'unlock', 'pdfToJpg', 'pdfToWord', 'pdfToExcel', 'editPdf'].includes(toolKey)) {
      fileInput.accept = 'application/pdf';
    } else if (['jpgToPdf', 'pngToPdf', 'kbResizer', 'examResizer', 'ocr', 'passportGrid'].includes(toolKey)) {
      fileInput.accept = 'image/*';
    } else if (toolKey === 'wordToPdf') {
      fileInput.accept = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (toolKey === 'excelToPdf') {
      fileInput.accept = '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (toolKey === 'pptToPdf') {
      fileInput.accept = '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (toolKey === 'htmlToPdf') {
      fileInput.accept = '.html,.htm,text/html';
    } else {
      fileInput.accept = '*/*';
    }

    if (['merge', 'jpgToPdf', 'pngToPdf', 'wordToPdf', 'excelToPdf', 'pptToPdf', 'htmlToPdf'].includes(toolKey)) {
      fileInput.setAttribute('multiple', 'true');
    } else {
      fileInput.removeAttribute('multiple');
    }
  }

  if (dropzone) dropzone.style.display = 'block';
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // iOS Safe Lock
  }

  if (toolKey === 'sigPad') {
    if (title) title.innerText = 'Digital Signature Maker';
    if (desc) desc.innerText = 'Draw your signature, select color, format and download.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Select Pen Color:</label>
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button type="button" onclick="setSigColor('#000000', this)" class="sig-color-btn active" style="background:#000000; width:30px; height:30px; border-radius:50%; border:2px solid #2563eb; cursor:pointer;" title="Black"></button>
            <button type="button" onclick="setSigColor('#1d4ed8', this)" class="sig-color-btn" style="background:#1d4ed8; width:30px; height:30px; border-radius:50%; border:2px solid transparent; cursor:pointer;" title="Blue"></button>
            <button type="button" onclick="setSigColor('#16a34a', this)" class="sig-color-btn" style="background:#16a34a; width:30px; height:30px; border-radius:50%; border:2px solid transparent; cursor:pointer;" title="Green"></button>
            <button type="button" onclick="setSigColor('#dc2626', this)" class="sig-color-btn" style="background:#dc2626; width:30px; height:30px; border-radius:50%; border:2px solid transparent; cursor:pointer;" title="Red"></button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div>
              <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Download Format:</label>
              <select id="sigFormat" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
                <option value="image/png" selected>PNG (Transparent)</option>
                <option value="image/jpeg">JPG (White BG)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Image Quality / Size:</label>
              <select id="sigQuality" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
                <option value="high" selected>High Quality (Standard)</option>
                <option value="medium">Medium (Compressed)</option>
                <option value="low">Small Size (KB Saver)</option>
              </select>
            </div>
          </div>
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Draw Signature Below:</label>
          <div style="border: 2px solid #cbd5e1; border-radius: 8px; background: #ffffff; touch-action: none; position: relative;">
            <canvas id="sigCanvas" width="480" height="180" style="width: 100%; height: 180px; display: block; cursor: crosshair;"></canvas>
          </div>
          <button type="button" onclick="clearSigCanvas()" style="margin-top: 8px; background: #64748b; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer;">Clear Canvas</button>
        </div>`;
    }
    setTimeout(() => initSignaturePad(), 200);
  } else if (toolKey === 'qrGen') {
    if (title) title.innerText = 'QR Code & UPI Generator';
    if (desc) desc.innerText = 'Generate instant QR code for UPI ID or website link.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Enter Text, UPI ID or URL Link:</label>
          <input type="text" id="optQrText" class="form-control" value="https://docucraftai.website" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'kbResizer') {
    if (title) title.innerText = 'Photo & Sign KB / MB Resizer';
    if (desc) desc.innerText = 'Compress image precisely to exact target KB or MB (up to 500 MB).';
    if (dropText) dropText.innerText = 'Tap to select photo/signature';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Select Target Size & Unit:</label>
          <div style="display: flex; gap: 8px;">
            <select id="optPresetSize" class="form-control" style="flex: 2; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="10">10 KB</option>
              <option value="20">20 KB</option>
              <option value="30">30 KB</option>
              <option value="40">40 KB</option>
              <option value="50" selected>50 KB</option>
              <option value="100">100 KB</option>
              <option value="200">200 KB</option>
              <option value="300">300 KB</option>
              <option value="400">400 KB</option>
              <option value="500">500 KB</option>
            </select>
            <select id="optTargetUnit" class="form-control" style="flex: 1; padding:10px; border:1px solid #d1d5db; border-radius:8px;" onchange="updateResizerOptions()">
              <option value="KB" selected>KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optCustomFileName" class="form-control" value="Resized_Photo" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'examResizer') {
    if (title) title.innerText = 'Exam Photo & Signature Resizer';
    if (desc) desc.innerText = 'Resize photo and signature to exact size required for government exam forms (SSC, UPSC, NEET, etc.).';
    if (dropText) dropText.innerText = 'Tap to select photo or signature';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Select Type:</label>
          <select id="optExamType" class="form-control" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="photo" selected>Photo (20KB-50KB, 200x230 px)</option>
            <option value="signature">Signature (10KB-20KB, 140x60 px)</option>
          </select>
        </div>
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optExamFileName" class="form-control" value="Exam_Photo" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'passportGrid') {
    if (title) title.innerText = 'Smart Passport Photo Studio';
    if (desc) desc.innerText = 'Upload any photo: clean background selection (White/Blue), perfect body & print-ready grid.';
    if (dropText) dropText.innerText = 'Tap to select photo';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Number of Copies:</label>
            <select id="optPassportCopies" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="4">4 Copies (2x2)</option>
              <option value="8" selected>8 Copies (2x4)</option>
              <option value="12">12 Copies (3x4)</option>
              <option value="20">20 Copies (4x5)</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Background Color:</label>
            <select id="optPassportBgColor" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="white" selected>Clean White</option>
              <option value="blue">Royal Blue</option>
            </select>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Photo Border:</label>
            <select id="optPassportBorder" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="thin" selected>Thin Gray Border</option>
              <option value="none">No Border</option>
              <option value="black">Dark Border</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Save File Name:</label>
            <input type="text" id="optPassportFileName" class="form-control" value="Smart_Passport_Sheet" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
          </div>
        </div>`;
    }
  } else if (toolKey === 'merge') {
    if (title) title.innerText = 'Merge PDF';
    if (desc) desc.innerText = 'Select multiple PDF files to combine. You can reorder them below.';
    if (dropText) dropText.innerText = 'Tap to select PDF files';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-top: 12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optMergeFileName" class="form-control" value="Merged_Document" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'split') {
    if (title) title.innerText = 'Split PDF';
    if (desc) desc.innerText = 'Extract specific pages or page ranges from a PDF.';
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Page Range to Extract (e.g., 1-2, 4):</label>
          <input type="text" id="optRange" class="form-control" placeholder="1-3, 5" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'compress') {
    if (title) title.innerText = 'Compress PDF to Target Size';
    if (desc) desc.innerText = 'Reduce PDF file size to your exact desired KB or MB.';
    if (dropText) dropText.innerText = 'Tap to select PDF to compress';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Select Target PDF Size & Unit:</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="optCompressTargetSize" class="form-control" value="100" style="flex: 2; padding:10px; border:1px solid #d1d5db; border-radius:8px;" placeholder="e.g. 100">
            <select id="optCompressUnit" class="form-control" style="flex: 1; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="KB" selected>KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optCompressFileName" class="form-control" value="Compressed_Document" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'organize') {
    if (title) title.innerText = 'Organize / Reorder Pages';
    if (desc) desc.innerText = 'Rearrange, reverse, or reorder the page sequence.';
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Desired Page Sequence (e.g., 3, 1, 2):</label>
          <input type="text" id="optReorder" class="form-control" placeholder="3, 1, 2" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'rotate') {
    if (title) title.innerText = 'Rotate PDF';
    if (desc) desc.innerText = 'Rotate pages 90, 180, or 270 degrees.';
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Rotation Angle:</label>
          <select id="optAngle" class="form-control" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="90">90 Degrees Clockwise</option>
            <option value="180">180 Degrees Flip</option>
            <option value="270">270 Degrees</option>
          </select>
        </div>`;
    }
  } else if (toolKey === 'removePages') {
    if (title) title.innerText = 'Delete PDF Pages';
    if (desc) desc.innerText = 'Remove unwanted or blank pages from PDF.';
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Pages to Delete (e.g., 2, 4):</label>
          <input type="text" id="optDeleteRange" class="form-control" placeholder="e.g., 2, 4" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'jpgToPdf' || toolKey === 'pngToPdf') {
    if (title) title.innerText = 'Image to PDF Converter';
    if (desc) desc.innerText = 'Convert your image files into a clean, standard PDF document with perfect centering.';
    if (dropText) dropText.innerText = 'Tap to select image file(s)';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Page Size:</label>
            <select id="optImgPdfPageSize" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="a4" selected>A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Orientation:</label>
            <select id="optImgPdfOrientation" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="portrait" selected>Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>`;
    }
  } else if (toolKey === 'watermark') {
    if (title) title.innerText = 'Watermark PDF';
    if (desc) desc.innerText = 'Stamp text watermark across all pages.';
    if (dropText) dropText.innerText = 'Tap to select PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Watermark Text:</label>
          <input type="text" id="optWatermark" class="form-control" value="CONFIDENTIAL" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'protect') {
    if (title) title.innerText = 'Protect / Lock PDF';
    if (desc) desc.innerText = 'Encrypt your PDF with a secret password.';
    if (dropText) dropText.innerText = 'Tap to select PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Enter Password:</label>
          <input type="password" id="optPdfPassword" class="form-control" placeholder="Enter password" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else {
    if (title) title.innerText = toolKey.toUpperCase();
    if (desc) desc.innerText = 'Process your document instantly.';
    if (dropText) dropText.innerText = 'Tap to select file(s)';
  }
}

// Tally Module Guide Functionality Fix
function loadTallyModuleInfo() {
  const modSelect = document.getElementById('tallyModuleSelect');
  const outArea = document.getElementById('tallyProgramOutput');
  if (!modSelect || !outArea) return;

  const mod = modSelect.value;
  if (mod === 'ledgers') {
    outArea.value = "=== DocuCraft AI Tally 9: Ledger Creation ===\n1. Go to Gateway of Tally > Accounts Info > Ledgers > Create.\n2. Enter Ledger Name (e.g., Sales Account, Purchase Account, Capital Account).\n3. Select Under Group (e.g., Sales Accounts under Direct/Indirect Incomes, Sundry Debtors, Sundry Creditors).\n4. Enable inventory values affected if required and save (Ctrl+A).";
  } else if (mod === 'vouchers') {
    outArea.value = "=== DocuCraft AI Tally 9: Voucher Entries ===\n1. Receipt Voucher (F6): Cash/Bank Dr. To Party Cr.\n2. Payment Voucher (F5): Party Dr. To Cash/Bank Cr.\n3. Contra Voucher (F4): Bank Dr. To Cash Cr. (or Bank to Bank).\n4. Journal Voucher (F7): Adjustment & non-cash entries.\n5. Sales (F8) & Purchase (F9) Vouchers.";
  } else if (mod === 'gst') {
    outArea.value = "=== DocuCraft AI Tally 9: GST Setup & Return ===\n1. Enable GST in F11: Features > Statutory & Taxation.\n2. Set State and GSTIN/UIN number.\n3. Create CGST, SGST, and IGST duty ledgers under Duties & Taxes.\n4. View GSTR-1, GSTR-2, and GSTR-3B reports directly from Gateway of Tally > Display > Statutory Reports > GST.";
  } else {
    outArea.value = "=== DocuCraft AI Tally 9: Financial Reports ===\n1. Balance Sheet: Gateway of Tally > Balance Sheet (Shows Assets & Liabilities).\n2. Profit & Loss A/c: Gateway of Tally > Profit & Loss (Shows Net Profit / Loss).\n3. Stock Summary: Gateway of Tally > Stock Summary (Tracks inventory closing balance).";
  }
}

function updateResizerOptions() {
  const unitSelect = document.getElementById('optTargetUnit');
  const sizeSelect = document.getElementById('optPresetSize');
  if (!unitSelect || !sizeSelect) return;

  const unit = unitSelect.value;
  sizeSelect.innerHTML = '';

  if (unit === 'KB') {
    const kbValues = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500];
    kbValues.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.text = val + ' KB';
      if (val === 50) opt.selected = true;
      sizeSelect.appendChild(opt);
    });
  } else {
    const mbValues = [1, 2, 5, 10, 20, 50, 100, 200, 300, 400, 500];
    mbValues.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.text = val + ' MB';
      if (val === 1) opt.selected = true;
      sizeSelect.appendChild(opt);
    });
  }
}

let currentSigColor = '#000000';

function setSigColor(color, btn) {
  currentSigColor = color;
  document.querySelectorAll('.sig-color-btn').forEach(b => {
    b.style.borderColor = 'transparent';
  });
  if (btn) btn.style.borderColor = '#2563eb';
  if (sigCanvasInstance) {
    const ctx = sigCanvasInstance.getContext('2d');
    ctx.strokeStyle = currentSigColor;
  }
}

function initSignaturePad() {
  const canvas = document.getElementById('sigCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = currentSigColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.onmousedown = (e) => { 
    drawing = true; 
    const p = getPos(e); 
    lastX = p.x; lastY = p.y; 
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  };
  
  canvas.onmousemove = (e) => { 
    if (!drawing) return; 
    const p = getPos(e); 
    ctx.lineTo(p.x, p.y); 
    ctx.stroke(); 
    lastX = p.x; lastY = p.y;
  };
  
  canvas.onmouseup = () => { drawing = false; };
  canvas.onmouseleave = () => { drawing = false; };

  canvas.ontouchstart = (e) => { 
    drawing = true; 
    const p = getPos(e); 
    lastX = p.x; lastY = p.y; 
    ctx.beginPath();
    ctx.moveTo(lastX, lastY); 
    e.preventDefault(); 
  };
  
  canvas.ontouchmove = (e) => { 
    if (!drawing) return; 
    const p = getPos(e); 
    ctx.lineTo(p.x, p.y); 
    ctx.stroke(); 
    lastX = p.x; lastY = p.y;
    e.preventDefault(); 
  };
  
  canvas.ontouchend = () => { drawing = false; };

  sigCanvasInstance = canvas;
}

function clearSigCanvas() {
  if (!sigCanvasInstance) return;
  const ctx = sigCanvasInstance.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sigCanvasInstance.width, sigCanvasInstance.height);
}

function closeWorkspace() {
  const overlay = document.getElementById('workspaceOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function handleBackdropClick(e) {
  if (e.target.id === 'workspaceOverlay') {
    closeWorkspace();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('wsFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files.length > 0) {
        if (fileInput.hasAttribute('multiple')) {
          const newFiles = Array.from(e.target.files);
          const uniqueFiles = newFiles.filter(nf => !selectedFiles.some(sf => sf.name === nf.name && sf.size === nf.size));
          selectedFiles = [...selectedFiles, ...uniqueFiles];
        } else {
          selectedFiles = Array.from(e.target.files);
        }
        renderFileList();
      }
    });
  }
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFileList() {
  const listContainer = document.getElementById('wsFileList');
  if (!listContainer) return;

  if (selectedFiles.length === 0) {
    listContainer.innerHTML = '';
    return;
  }

  let html = `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-top: 10px; max-height: 150px; overflow-y: auto;">
    <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
      <span><i class="fa-solid fa-list-check" style="color: #2563eb;"></i> Selected File(s) (${selectedFiles.length}):</span>
      <button type="button" onclick="clearAllSelectedFiles()" style="background: #fee2e2; color: #991b1b; border: none; padding: 2px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">Clear All</button>
    </div>`;

  selectedFiles.forEach((file, index) => {
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    const safeFileName = escapeHtml(file.name); 
    
    html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px; color: #334155;">${index + 1}. ${safeFileName} (${fileSize})</span>
      <button type="button" onclick="removeSelectedFile(${index})" style="background: #fee2e2; color: #991b1b; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">×</button>
    </div>`;
  });
  html += `</div>`;
  listContainer.innerHTML = html;
}

function removeSelectedFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

function clearAllSelectedFiles() {
  selectedFiles = [];
  const fileInput = document.getElementById('wsFileInput');
  if (fileInput) fileInput.value = '';
  renderFileList();
}

function resetProgress() {
  const box = document.getElementById('processingProgress');
  if (box) box.style.display = 'none';
  setProgress(0, 'Preparing...');
}

function setProgress(percent, text) {
  const box = document.getElementById('processingProgress');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressText');
  const pct = document.getElementById('progressPercent');
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  if (box) box.style.display = 'block';
  if (fill) fill.style.width = safe + '%';
  if (label) label.textContent = text || 'Processing...';
  if (pct) pct.textContent = Math.round(safe) + '%';
}

async function executeToolAction() {
  const btn = document.getElementById('wsActionBtn');
  const originalText = btn ? btn.innerText : 'Process & Download';

  if (activeTool === 'sigPad') {
    if (!sigCanvasInstance) return;
    const format = document.getElementById('sigFormat')?.value || 'image/png';
    let ext = format === 'image/jpeg' ? 'jpg' : 'png';
    sigCanvasInstance.toBlob((blob) => {
      downloadBlob(blob, `Digital_Signature.${ext}`, format);
      showSuccessPopup('Digital Signature Downloaded Successfully!');
      closeWorkspace();
    }, format, 0.95);
    return;
  }

  if (activeTool === 'qrGen') {
    const text = document.getElementById('optQrText')?.value.trim() || 'https://docucraftai.website';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      downloadBlob(blob, 'QRCode.png', 'image/png');
      showSuccessPopup('QR Code Generated Successfully!');
    } catch {
      window.open(qrUrl, '_blank');
    }
    closeWorkspace();
    return;
  }

  const fileNeeded = ['kbResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'jpgToPdf', 'pngToPdf', 'watermark', 'protect'];
  if (fileNeeded.includes(activeTool) && selectedFiles.length === 0) {
    alert('Please select the required file(s).');
    return;
  }

  if (btn) { btn.innerText = 'Processing...'; btn.disabled = true; }
  setProgress(5, 'Starting...');

  try {
    const PDFLibObj = await ensurePdfLibLoaded();

    if (activeTool === 'kbResizer') {
      setProgress(30, 'Resizing image...');
      const valInput = parseFloat(document.getElementById('optPresetSize')?.value) || 50;
      const unit = document.getElementById('optTargetUnit')?.value || 'KB';
      const customName = document.getElementById('optCustomFileName')?.value?.trim() || 'Resized_Photo';
      const targetBytes = unit === 'MB' ? valInput * 1024 * 1024 : valInput * 1024;
      
      const rawData = await readFileAsDataURL(selectedFiles[0]);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      let low = 0.05, high = 0.95, bestBlob = null;
      for (let i = 0; i < 10; i++) {
        const quality = (low + high) / 2;
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        if (blob.size <= targetBytes) { bestBlob = blob; low = quality; }
        else { high = quality; }
      }
      if (!bestBlob) bestBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.1));

      downloadBlob(bestBlob, `${customName}_${valInput}${unit}.jpg`, 'image/jpeg');
      showSuccessPopup('Photo Resized Successfully!');

    } else if (activeTool === 'merge' && PDFLibObj) {
      setProgress(20, 'Combining PDF files...');
      const customName = document.getElementById('optMergeFileName')?.value?.trim() || 'Merged_Document';
      const mergedPdf = await PDFLibObj.PDFDocument.create();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const fileBuffer = await selectedFiles[i].arrayBuffer();
        const doc = await PDFLibObj.PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      downloadBlob(mergedPdfBytes, `${customName}.pdf`, 'application/pdf');
      showSuccessPopup('PDFs Merged Successfully!');

    } else if (activeTool === 'compress' && PDFLibObj) {
      setProgress(30, 'Compressing PDF...');
      const customName = document.getElementById('optCompressFileName')?.value?.trim() || 'Compressed_Document';
      const fileBuffer = await selectedFiles[0].arrayBuffer();
      const doc = await PDFLibObj.PDFDocument.load(fileBuffer);
      const compressedBytes = await doc.save({ useObjectStreams: true });
      downloadBlob(compressedBytes, `${customName}.pdf`, 'application/pdf');
      showSuccessPopup('PDF Compressed Successfully!');

    } else if (activeTool === 'split' && PDFLibObj) {
      const range = document.getElementById('optRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      const indices = parseRange(range, doc.getPageCount());
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Split_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Split Successfully!');

    } else if (activeTool === 'rotate' && PDFLibObj) {
      const angle = parseInt(document.getElementById('optAngle')?.value) || 90;
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      doc.getPages().forEach(p => p.setRotation(PDFLibObj.degrees(p.getRotation().angle + angle)));
      downloadBlob(await doc.save(), 'Rotated_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Rotated Successfully!');

    } else if (activeTool === 'removePages' && PDFLibObj) {
      const delRange = document.getElementById('optDeleteRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      const totalPages = doc.getPageCount();
      const delIndices = new Set(parseRange(delRange, totalPages));
      const keepIndices = [];
      for (let i = 0; i < totalPages; i++) {
        if (!delIndices.has(i)) keepIndices.push(i);
      }
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, keepIndices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Cleaned_Document.pdf', 'application/pdf');
      showSuccessPopup('Pages Deleted Successfully!');

    } else if (activeTool === 'watermark' && PDFLibObj) {
      const wmText = document.getElementById('optWatermark')?.value.trim() || 'CONFIDENTIAL';
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(wmText, {
          x: width / 4,
          y: height / 2,
          size: 40,
          color: PDFLibObj.rgb(0.75, 0.75, 0.75),
          rotate: PDFLibObj.degrees(45),
        });
      });
      downloadBlob(await doc.save(), 'Watermarked_Document.pdf', 'application/pdf');
      showSuccessPopup('Watermark Added Successfully!');

    } else if (activeTool === 'protect' && PDFLibObj) {
      const password = document.getElementById('optPdfPassword')?.value;
      if (!password) { alert('Please enter password.'); return; }
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      const encryptedBytes = await doc.save({ userPassword: password, ownerPassword: password });
      downloadBlob(encryptedBytes, 'Protected_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Protected Successfully!');

    } else if (activeTool === 'jpgToPdf' || activeTool === 'pngToPdf') {
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;
      const pdf = new jsPDF();
      for (let i = 0; i < selectedFiles.length; i++) {
        const rawData = await readFileAsDataURL(selectedFiles[i]);
        if (i > 0) pdf.addPage();
        pdf.addImage(rawData, 'JPEG', 10, 10, 190, 260);
      }
      downloadBlob(pdf.output('blob'), 'Images_Converted.pdf', 'application/pdf');
      showSuccessPopup('Images Converted to PDF!');
    }

    closeWorkspace();
  } catch (err) {
    console.error(err);
    alert('Execution Error: ' + err.message);
  } finally {
    setProgress(100, 'Done');
    if (btn) { btn.innerText = originalText; btn.disabled = false; }
    setTimeout(() => resetProgress(), 180);
  }
}

function showSuccessPopup(msg) {
  alert(msg);
}

function parseRange(str, total) {
  const indices = new Set();
  if (!str) {
    for (let i = 0; i < total; i++) indices.add(i);
    return Array.from(indices);
  }
  str.split(',').forEach(p => {
    const trimmed = p.trim();
    if (trimmed.includes('-')) {
      const [s, e] = trimmed.split('-').map(Number);
      for (let i = s; i <= e; i++) if (i >= 1 && i <= total) indices.add(i - 1);
    } else {
      const n = Number(trimmed);
      if (!isNaN(n) && n >= 1 && n <= total) indices.add(n - 1);
    }
  });
  return Array.from(indices).sort((a, b) => a - b);
}

function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function downloadBlob(content, name, type) {
  if (!content) return;
  const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name || 'download';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 1000);
}
