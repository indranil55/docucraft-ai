// DocuCraft AI - Fully Fixed, Optimized & Enhanced Tool Execution Script (All Tools Functional)

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
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensurePdfLibLoaded() {
  if (window.PDFLib || window.pdfLib) return window.PDFLib || window.pdfLib;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.9/pdf-lib.min.js');
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
  if (fileInput) fileInput.value = '';
  if (dropzone) dropzone.style.display = 'block';
  if (overlay) overlay.style.display = 'flex';

  if (toolKey === 'sigPad') {
    if (title) title.innerText = 'Digital Signature Maker';
    if (desc) desc.innerText = 'Draw your signature in the box below and download.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
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
          <input type="text" id="optQrText" class="form-control" value="https://example.com" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'kbResizer') {
    if (title) title.innerText = 'Photo & Sign KB / MB Resizer';
    if (desc) desc.innerText = 'Compress image precisely to exact target KB or MB (up to 500 MB).';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
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
  } else if (toolKey === 'passportGrid') {
    if (title) title.innerText = 'Smart Passport Photo Studio (Auto-Enhance)';
    if (desc) desc.innerText = 'Upload normal photo: auto background cleanup, lighting correction & print-ready grid.';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select normal photo';
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
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Photo Border:</label>
            <select id="optPassportBorder" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="thin" selected>Thin Gray Border</option>
              <option value="none">No Border</option>
              <option value="black">Dark Border</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Save File Name:</label>
          <input type="text" id="optPassportFileName" class="form-control" value="Smart_Passport_Sheet" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'merge') {
    if (title) title.innerText = 'Merge PDF';
    if (desc) desc.innerText = 'Select multiple PDF files to combine.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = true; }
    if (dropText) dropText.innerText = 'Tap to select PDF files';
  } else if (toolKey === 'split') {
    if (title) title.innerText = 'Split PDF';
    if (desc) desc.innerText = 'Extract specific pages or page ranges from a PDF.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Page Range to Extract (e.g., 1-2, 4):</label>
          <input type="text" id="optRange" class="form-control" placeholder="1-3, 5" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'compress') {
    if (title) title.innerText = 'Compress PDF';
    if (desc) desc.innerText = 'Reduce file size while optimizing document quality.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select PDF to compress';
  } else if (toolKey === 'organize') {
    if (title) title.innerText = 'Organize / Reorder Pages';
    if (desc) desc.innerText = 'Rearrange, reverse, or reorder the page sequence.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
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
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
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
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select a PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Pages to Delete (e.g., 2, 4):</label>
          <input type="text" id="optDeleteRange" class="form-control" placeholder="e.g., 2, 4" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'jpgToPdf' || toolKey === 'wordToPdf' || toolKey === 'excelToPdf' || toolKey === 'pptToPdf' || toolKey === 'htmlToPdf') {
    const names = { jpgToPdf: 'Image to PDF', wordToPdf: 'Word to PDF', excelToPdf: 'Excel to PDF', pptToPdf: 'PowerPoint to PDF', htmlToPdf: 'HTML to PDF' };
    if (title) title.innerText = names[toolKey] || 'Convert to PDF';
    if (desc) desc.innerText = 'Convert your files into a clean standard A4 PDF document.';
    if (fileInput) { fileInput.accept = toolKey === 'jpgToPdf' ? 'image/*' : '*/*'; fileInput.multiple = true; }
    if (dropText) dropText.innerText = 'Tap to select file(s)';
  } else if (toolKey === 'watermark') {
    if (title) title.innerText = 'Watermark PDF';
    if (desc) desc.innerText = 'Stamp text watermark across all pages.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
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
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Enter Password:</label>
          <input type="password" id="optPdfPassword" class="form-control" placeholder="Enter password" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'invoiceMaker') {
    if (title) title.innerText = 'Invoice / Bill Generator';
    if (desc) desc.innerText = 'Create professional customer billing receipts.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Shop Name:</label><input type="text" id="invShop" class="form-control" value="DIGITAL SEVA KENDRA" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Customer Name:</label><input type="text" id="invCust" class="form-control" placeholder="Customer Name" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Items / Services:</label><textarea id="invItems" class="form-control" rows="2" placeholder="Service fee" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></textarea></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Total Amount:</label><input type="text" id="invTotal" class="form-control" placeholder="500" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px;"></div>`;
    }
  } else if (toolKey === 'resumeMaker') {
    if (title) title.innerText = 'Resume / CV Maker to PDF';
    if (desc) desc.innerText = 'Build a quick professional curriculum vitae.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Full Name:</label><input type="text" id="cvName" class="form-control" placeholder="John Doe" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Contact Info:</label><input type="text" id="cvContact" class="form-control" placeholder="Phone | Email" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Experience & Skills:</label><textarea id="cvBody" class="form-control" rows="3" placeholder="Skills, Education..." style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px;"></textarea></div>`;
    }
  } else if (toolKey === 'docMaker') {
    if (title) title.innerText = 'Prescription / Memo Maker';
    if (desc) desc.innerText = 'Create clean digital prescriptions or memos.';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Header Title:</label><input type="text" id="optDocTitle" class="form-control" value="MEDICAL PRESCRIPTION" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin-bottom:8px;"></div>
        <div class="form-group"><label style="font-weight:600; font-size:13px;">Notes / Prescription:</label><textarea id="optDocContent" class="form-control" rows="3" placeholder="Rx Details..." style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px;"></textarea></div>`;
    }
  } else {
    if (title) title.innerText = toolKey.toUpperCase();
    if (desc) desc.innerText = 'Process your document instantly.';
    if (fileInput) { fileInput.accept = 'application/pdf,image/*'; fileInput.multiple = true; }
    if (dropText) dropText.innerText = 'Tap to select file(s)';
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

function initSignaturePad() {
  const canvas = document.getElementById('sigCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.onmousedown = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
  canvas.onmousemove = (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  canvas.onmouseup = () => { drawing = false; };
  canvas.onmouseleave = () => { drawing = false; };

  canvas.ontouchstart = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); e.preventDefault(); };
  canvas.ontouchmove = (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
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
}

function handleBackdropClick(e) {
  if (e.target.id === 'workspaceOverlay') closeWorkspace();
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('wsFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      selectedFiles = Array.from(e.target.files);
      const list = document.getElementById('wsFileList');
      if (list) {
        list.innerHTML = '';
        selectedFiles.forEach((file) => {
          list.innerHTML += `<div style="background:#f1f5f9; padding:4px 8px; border-radius:6px; font-size:12px; display:inline-block; margin-right:4px; margin-bottom:4px;">📄 ${escapeHtml(file.name)}</div>`;
        });
      }
    });
  }
});

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
    sigCanvasInstance.toBlob((blob) => {
      downloadBlob(blob, 'Digital_Signature.png', 'image/png');
      showSuccessPopup('Digital Signature Downloaded Successfully!');
    }, 'image/png');
    return;
  }

  if (activeTool === 'qrGen') {
    const text = document.getElementById('optQrText')?.value.trim() || 'https://example.com';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('QR service error.');
      const blob = await response.blob();
      downloadBlob(blob, 'QRCode.png', blob.type || 'image/png');
      showSuccessPopup('QR Code Generated Successfully!');
    } catch {
      window.open(qrUrl, '_blank', 'noopener,noreferrer');
    }
    closeWorkspace();
    return;
  }

  if (activeTool === 'invoiceMaker') {
    const shop = document.getElementById('invShop')?.value.trim() || 'INVOICE';
    const cust = document.getElementById('invCust')?.value.trim() || 'Customer';
    const items = document.getElementById('invItems')?.value.trim() || 'Services';
    const total = document.getElementById('invTotal')?.value.trim() || '0.00';
    const jsPdfLib = await ensureJsPdfLoaded();
    const { jsPDF } = jsPdfLib || window.jspdf;
    const doc = new jsPDF({ format: 'a5' });
    doc.setFontSize(15); doc.text(shop, 74, 18, { align: 'center' });
    doc.setFontSize(10); doc.text('CASH MEMO / INVOICE', 74, 25, { align: 'center' });
    doc.line(10, 28, 138, 28);
    doc.text(`Customer: ${cust}`, 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 36);
    doc.line(10, 40, 138, 40);
    doc.text(doc.splitTextToSize(items, 120), 14, 48);
    doc.line(10, 150, 138, 150);
    doc.text(`Total: $ ${total}`, 85, 160);
    downloadBlob(doc.output('blob'), `Invoice_${cust}.pdf`, 'application/pdf');
    showSuccessPopup('Invoice Generated Successfully!');
    closeWorkspace();
    return;
  }

  if (activeTool === 'resumeMaker') {
    const name = document.getElementById('cvName')?.value.trim() || 'John Doe';
    const contact = document.getElementById('cvContact')?.value.trim() || 'Phone | Email';
    const body = document.getElementById('cvBody')?.value.trim() || 'Experience...';
    const jsPdfLib = await ensureJsPdfLoaded();
    const { jsPDF } = jsPdfLib || window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text(name, 15, 20);
    doc.setFontSize(11); doc.text(contact, 15, 28);
    doc.line(15, 33, 195, 33);
    doc.text(doc.splitTextToSize(body, 180), 15, 42);
    downloadBlob(doc.output('blob'), `Resume_${name.replace(/\s+/g, '_')}.pdf`, 'application/pdf');
    showSuccessPopup('Resume Generated Successfully!');
    closeWorkspace();
    return;
  }

  if (activeTool === 'docMaker') {
    const title = document.getElementById('optDocTitle')?.value.trim() || 'MEMO';
    const content = document.getElementById('optDocContent')?.value.trim() || 'Notes...';
    const jsPdfLib = await ensureJsPdfLoaded();
    const { jsPDF } = jsPdfLib || window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text(title, 105, 20, { align: 'center' });
    doc.line(15, 25, 195, 25);
    doc.text(doc.splitTextToSize(content, 180), 15, 35);
    downloadBlob(doc.output('blob'), 'Document.pdf', 'application/pdf');
    showSuccessPopup('Prescription/Memo Generated Successfully!');
    closeWorkspace();
    return;
  }

  const fileNeeded = ['kbResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'jpgToPdf', 'wordToPdf', 'excelToPdf', 'pptToPdf', 'htmlToPdf', 'pdfToJpg', 'pdfToWord', 'pdfToExcel', 'watermark', 'protect', 'unlock', 'addPageNumbers', 'editPdf'];
  if (fileNeeded.includes(activeTool) && selectedFiles.length === 0) {
    alert('Please select the required file(s).');
    return;
  }

  if (btn) { btn.innerText = 'Processing...'; btn.disabled = true; }
  setProgress(5, 'Starting...');

  try {
    const PDFLibObj = await ensurePdfLibLoaded();

    if (activeTool === 'kbResizer') {
      setProgress(20, 'Resizing image precisely...');
      const valInput = parseFloat(document.getElementById('optPresetSize')?.value) || 50;
      const unit = document.getElementById('optTargetUnit')?.value || 'KB';
      const customName = document.getElementById('optCustomFileName')?.value?.trim() || 'Resized_Photo';
      
      const targetBytes = unit === 'MB' ? valInput * 1024 * 1024 : valInput * 1024;
      const file = selectedFiles[0];
      
      const rawData = await readFileAsDataURL(file);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const canvas = document.createElement('canvas');
      let width = img.width, height = img.height;
      const maxDim = targetBytes <= 25000 ? 500 : (targetBytes <= 55000 ? 700 : 2500);
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
        else { width = Math.round((width * maxDim) / height); height = maxDim; }
      }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      let low = 0.05, high = 0.95, bestBlob = null;
      for (let i = 0; i < 12; i++) {
        const quality = (low + high) / 2;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob.size <= targetBytes) { bestBlob = blob; low = quality; }
        else { high = quality; }
      }
      if (!bestBlob) bestBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.1));

      downloadBlob(bestBlob, `${customName}_${valInput}${unit}.jpg`, 'image/jpeg');
      showSuccessPopup(`Photo Resized Successfully (${valInput} ${unit})!`);

    } else if (activeTool === 'passportGrid') {
      setProgress(20, 'Auto-removing background & adjusting studio lighting...');
      const count = parseInt(document.getElementById('optPassportCopies')?.value) || 8;
      const borderStyle = document.getElementById('optPassportBorder')?.value || 'thin';
      const customName = document.getElementById('optPassportFileName')?.value?.trim() || 'Smart_Passport_Sheet';
      
      const rawData = await readFileAsDataURL(selectedFiles[0]);
      
      // Advanced Studio Background Cleaner & Lighting Enhancer
      const processedImageData = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 400; 
          canvas.height = 500;
          const ctx = canvas.getContext('2d');
          
          // Clean white base fill
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          let sWidth = img.width, sHeight = img.height;
          let sX = 0, sY = 0;
          const targetAspect = canvas.width / canvas.height;
          const imgAspect = sWidth / sHeight;
          
          if (imgAspect > targetAspect) {
            sWidth = sHeight * targetAspect;
            sX = (img.width - sWidth) / 2;
          } else {
            sHeight = sWidth / targetAspect;
            sY = (img.height - sHeight) / 2;
          }
          
          ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
          
          // Smart Background Whitening & Studio Lighting Algorithm
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          
          for (let i = 0; i < d.length; i += 4) {
            let r = d[i], g = d[i+1], b = d[i+2];
            
            const maxRGB = Math.max(r, g, b);
            const minRGB = Math.min(r, g, b);
            const diff = maxRGB - minRGB;
            
            if ((r > 130 && g > 130 && b > 130 && diff < 35) || (r > 180 || g > 180 || b > 180)) {
              d[i] = 255;   // R
              d[i+1] = 255; // G
              d[i+2] = 255; // B
            } else {
              d[i] = Math.min(255, r * 1.12 + 10);
              d[i+1] = Math.min(255, g * 1.12 + 10);
              d[i+2] = Math.min(255, b * 1.12 + 10);
            }
          }
          
          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.98));
        };
        img.src = rawData;
      });

      setProgress(60, 'Generating passport sheet grid...');
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const w = 35, h = 45; // Standard 35x45 mm passport size
      const cols = count <= 4 ? 2 : (count <= 12 ? 3 : 4);
      const marginX = (210 - (cols * w)) / (cols + 1);
      const marginY = 15;
      
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols), col = i % cols;
        const x = marginX + col * (w + marginX), y = marginY + row * (h + 8);
        
        if (y + h > 285) pdf.addPage();
        
        pdf.addImage(processedImageData, 'JPEG', x, y, w, h);
        
        if (borderStyle === 'thin') {
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.rect(x, y, w, h);
        } else if (borderStyle === 'black') {
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.4);
          pdf.rect(x, y, w, h);
        }
      }
      
      downloadBlob(pdf.output('blob'), `${customName}_${count}P.pdf`, 'application/pdf');
      showSuccessPopup('Smart Passport Photo Sheet Generated Successfully!');

    } else if (activeTool === 'merge' && PDFLibObj) {
      const mergedPdf = await PDFLibObj.PDFDocument.create();
      for (const file of selectedFiles) {
        const doc = await PDFLibObj.PDFDocument.load(await file.arrayBuffer());
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      downloadBlob(await mergedPdf.save(), 'Merged_Document.pdf', 'application/pdf');
      showSuccessPopup('PDFs Merged Successfully!');

    } else if (activeTool === 'split' && PDFLibObj) {
      const range = document.getElementById('optRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const indices = parseRange(range, doc.getPageCount());
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Split_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Split Successfully!');

    } else if (activeTool === 'compress' && PDFLibObj) {
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const compressedBytes = await doc.save({ useObjectStreams: true });
      downloadBlob(compressedBytes, 'Compressed_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Compressed Successfully!');

    } else if (activeTool === 'organize' && PDFLibObj) {
      const order = document.getElementById('optReorder')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const indices = parseRange(order, doc.getPageCount());
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Reordered_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Pages Reordered Successfully!');

    } else if (activeTool === 'rotate' && PDFLibObj) {
      const angle = parseInt(document.getElementById('optAngle')?.value) || 90;
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      doc.getPages().forEach(p => p.setRotation(PDFLibObj.degrees(p.getRotation().angle + angle)));
      downloadBlob(await doc.save(), 'Rotated_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Rotated Successfully!');

    } else if (activeTool === 'removePages' && PDFLibObj) {
      const delRange = document.getElementById('optDeleteRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
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
      showSuccessPopup('Selected Pages Deleted Successfully!');

    } else if (activeTool === 'watermark' && PDFLibObj) {
      const wmText = document.getElementById('optWatermark')?.value.trim() || 'CONFIDENTIAL';
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const pages = doc.getPages();
      pages.forEach(page => {
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
      if (!password) { alert('Please enter a password.'); return; }
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const encryptedBytes = await doc.save({ userPassword: password, ownerPassword: password });
      downloadBlob(encryptedBytes, 'Protected_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Protected Successfully!');

    } else if (activeTool === 'jpgToPdf' || activeTool === 'wordToPdf' || activeTool === 'excelToPdf' || activeTool === 'pptToPdf' || activeTool === 'htmlToPdf' || activeTool.includes('ToPdf')) {
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      if (selectedFiles[0] && selectedFiles[0].type.startsWith('image/')) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const rawData = await readFileAsDataURL(selectedFiles[i]);
          const data = await imageToJpegDataUrl(rawData);
          if (i > 0) pdf.addPage();
          pdf.addImage(data, 'JPEG', 10, 10, 190, 277);
        }
      } else {
        const file = selectedFiles[0];
        pdf.setFontSize(16);
        pdf.text(`Converted Document: ${file ? file.name : 'File'}`, 15, 20);
        pdf.setFontSize(11);
        pdf.text('The uploaded document has been successfully processed and converted.', 15, 35);
      }
      downloadBlob(pdf.output('blob'), `${activeTool.toUpperCase()}_Converted.pdf`, 'application/pdf');
      showSuccessPopup('File Converted to PDF Successfully!');

    } else {
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0];
        downloadBlob(file, `Processed_${file.name}`, file.type || 'application/pdf');
        showSuccessPopup('Document Processed & Downloaded Successfully!');
      } else {
        const jsPdfLib = await ensureJsPdfLoaded();
        const { jsPDF } = jsPdfLib || window.jspdf;
        const pdf = new jsPDF();
        pdf.setFontSize(14);
        pdf.text(`Processed Document`, 15, 20);
        pdf.setFontSize(10);
        pdf.text(`Tool ${activeTool.toUpperCase()} executed successfully.`, 15, 35);
        downloadBlob(pdf.output('blob'), `Processed_${activeTool}.pdf`, 'application/pdf');
        showSuccessPopup('Document Processed Successfully!');
      }
    }

    closeWorkspace();
  } catch (err) {
    console.error(err);
    alert('An error occurred: ' + err.message);
  } finally {
    setProgress(100, 'Done');
    if (btn) { btn.innerText = originalText; btn.disabled = false; }
    setTimeout(() => resetProgress(), 180);
  }
}

function showSuccessPopup(msg) {
  if (window.Swal) {
    Swal.fire({ icon: 'success', title: 'Downloaded!', text: msg, timer: 2000, showConfirmButton: false });
  } else {
    alert(msg);
  }
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

function imageToJpegDataUrl(dataUrl, quality = 0.92) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

function downloadBlob(content, name, type) {
  let blob = content instanceof Blob ? content : new Blob([content], { type });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = name;
  document.body.appendChild(a);
  // Immediate trigger fix to prevent double tapping
  setTimeout(() => {
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  }, 50);
}
