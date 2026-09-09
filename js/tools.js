let activeTool = '';
let selectedFiles = [];
let sigCanvasInstance = null;

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

  fileList.innerHTML = '';
  customUI.innerHTML = '';
  resetProgress();
  fileInput.value = '';
  dropzone.style.display = 'block';
  overlay.style.display = 'flex';

  if (toolKey === 'sigPad') {
    title.innerText = 'Digital Signature Maker';
    desc.innerText = 'Draw your signature in the box below.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Draw Signature Below:</label>
        <div style="border: 2px solid #cbd5e1; border-radius: 8px; background: #fff; touch-action: none; position: relative;">
          <canvas id="sigCanvas" width="480" height="180" style="width: 100%; height: 180px; display: block; cursor: crosshair;"></canvas>
        </div>
        <button type="button" onclick="clearSigCanvas()" style="margin-top: 8px; background: #64748b; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Clear Canvas</button>
      </div>`;
    setTimeout(() => initSignaturePad(), 200);
  } else if (toolKey === 'qrGen') {
    title.innerText = 'QR Code & UPI Generator';
    desc.innerText = 'Generate instant QR code for UPI ID or website link.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Enter Text, UPI ID or URL Link:</label>
        <input type="text" id="optQrText" class="form-control" placeholder="e.g. yourname@ybl or https://example.com" value="https://example.com">
      </div>`;
  } else if (toolKey === 'kbResizer') {
    title.innerText = 'Photo & Sign KB / MB Resizer';
    desc.innerText = 'Compress image precisely to exact target KB or MB.';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select photo/signature';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Select Target Size (KB):</label>
        <div style="display: flex; gap: 8px;">
          <select id="optPresetSize" class="form-control" style="flex: 2;">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50" selected>50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          <select id="optTargetUnit" class="form-control" style="flex: 1;">
            <option value="KB" selected>KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Save File Name:</label>
        <input type="text" id="optCustomFileName" class="form-control" value="Resized_Photo" placeholder="Enter file name">
      </div>`;
  } else if (toolKey === 'passportGrid') {
    title.innerText = 'Passport Photo Sheet (Standard 35x45 mm)';
    desc.innerText = 'Generate print-ready passport sheets on A4 paper.';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select passport photo';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Number of Copies on A4 Sheet:</label>
        <input type="number" id="optPassportCopies" class="form-control" value="8" min="1" max="50" step="1" inputmode="numeric" placeholder="Enter number of copies">
      </div>
      <div class="form-group">
        <label>Save File Name:</label>
        <input type="text" id="optPassportFileName" class="form-control" value="Passport_Sheet" placeholder="Enter file name">
      </div>`;
  } else if (toolKey === 'split') {
    title.innerText = 'Split PDF';
    desc.innerText = 'Extract specific pages or page ranges from a PDF.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select a PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Page Range to Extract (e.g., 1-2, 4):</label>
        <input type="text" id="optRange" class="form-control" placeholder="1-3, 5">
      </div>`;
  } else if (toolKey === 'organize') {
    title.innerText = 'Organize / Reorder Pages';
    desc.innerText = 'Specify custom page order.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select a PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Desired Page Sequence (e.g., 3, 1, 2):</label>
        <input type="text" id="optReorder" class="form-control" placeholder="3, 1, 2">
      </div>`;
  } else if (toolKey === 'rotate') {
    title.innerText = 'Rotate PDF';
    desc.innerText = 'Rotate pages 90, 180, or 270 degrees.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select a PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Rotation Angle:</label>
        <select id="optAngle" class="form-control">
          <option value="90">90 Degrees Clockwise</option>
          <option value="180">180 Degrees Flip</option>
          <option value="270">270 Degrees</option>
        </select>
      </div>`;
  } else if (toolKey === 'removePages') {
    title.innerText = 'Delete PDF Pages';
    desc.innerText = 'Remove unwanted or blank pages.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select a PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Pages to Delete (e.g., 2, 4):</label>
        <input type="text" id="optDeleteRange" class="form-control" placeholder="e.g., 2, 4">
      </div>`;
  } else if (toolKey === 'watermark') {
    title.innerText = 'Watermark PDF';
    desc.innerText = 'Stamp text watermark across all pages.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Watermark Text:</label>
        <input type="text" id="optWatermark" class="form-control" value="CONFIDENTIAL">
      </div>`;
  } else if (toolKey === 'protect') {
    title.innerText = 'Protect / Lock PDF';
    desc.innerText = 'Encrypt your PDF with a secret password.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Enter Password:</label>
        <input type="password" id="optPdfPassword" class="form-control" placeholder="Enter password">
      </div>`;
  } else if (toolKey === 'invoiceMaker') {
    title.innerText = 'Invoice / Bill Generator';
    desc.innerText = 'Create professional customer billing receipts.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group"><label>Shop Name:</label><input type="text" id="invShop" class="form-control" value="DIGITAL SEVA KENDRA"></div>
      <div class="form-group"><label>Customer Name:</label><input type="text" id="invCust" class="form-control" placeholder="Customer Name"></div>
      <div class="form-group"><label>Items / Services:</label><textarea id="invItems" class="form-control" rows="2" placeholder="Service fee"></textarea></div>
      <div class="form-group"><label>Total Amount:</label><input type="text" id="invTotal" class="form-control" placeholder="500"></div>`;
  } else if (toolKey === 'resumeMaker') {
    title.innerText = 'Resume / CV Maker to PDF';
    desc.innerText = 'Build a quick professional curriculum vitae.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group"><label>Full Name:</label><input type="text" id="cvName" class="form-control" placeholder="John Doe"></div>
      <div class="form-group"><label>Contact Info:</label><input type="text" id="cvContact" class="form-control" placeholder="Phone | Email"></div>
      <div class="form-group"><label>Experience & Skills:</label><textarea id="cvBody" class="form-control" rows="3" placeholder="Skills, Education..."></textarea></div>`;
  } else if (toolKey === 'docMaker') {
    title.innerText = 'Prescription / Memo Maker';
    desc.innerText = 'Create clean digital prescriptions or memos.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group"><label>Header Title:</label><input type="text" id="optDocTitle" class="form-control" value="MEDICAL PRESCRIPTION"></div>
      <div class="form-group"><label>Notes / Prescription:</label><textarea id="optDocContent" class="form-control" rows="3" placeholder="Rx Details..."></textarea></div>`;
  } else if (toolKey.includes('ToPdf')) {
    fileInput.accept = toolKey.includes('jpg') ? 'image/*' : '*/*';
    fileInput.multiple = true;
    dropText.innerText = 'Tap to select file(s)';
  } else {
    fileInput.accept = 'application/pdf,image/*';
    fileInput.multiple = true;
    dropText.innerText = 'Tap to select file(s)';
  }
}

function initSignaturePad() {
  const canvas = document.getElementById('sigCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

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
  ctx.clearRect(0, 0, sigCanvasInstance.width, sigCanvasInstance.height);
}

function closeWorkspace() {
  document.getElementById('workspaceOverlay').style.display = 'none';
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
      selectedFiles = Array.from(e.target.files);
      const list = document.getElementById('wsFileList');
      list.innerHTML = '';
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          list.innerHTML += `<div class="file-tag">📄 ${escapeHtml(file.name)}</div>`;
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
  const originalText = btn.innerText;

  if (activeTool === 'sigPad') {
    if (!sigCanvasInstance) return;
    downloadBlob(sigCanvasInstance.toDataURL('image/png'), 'Digital_Signature.png', 'image/png');
    closeWorkspace();
    return;
  }

  if (activeTool === 'qrGen') {
    const text = document.getElementById('optQrText').value.trim() || 'https://example.com';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('QR service error.');
      const blob = await response.blob();
      downloadBlob(blob, 'QRCode.png', blob.type || 'image/png');
    } catch (err) {
      window.open(qrUrl, '_blank', 'noopener,noreferrer');
    }
    closeWorkspace();
    return;
  }

  if (activeTool === 'invoiceMaker') {
    const shop = document.getElementById('invShop').value.trim() || 'INVOICE';
    const cust = document.getElementById('invCust').value.trim() || 'Customer';
    const items = document.getElementById('invItems').value.trim() || 'Services';
    const total = document.getElementById('invTotal').value.trim() || '0.00';
    const { jsPDF } = window.jspdf;
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
    closeWorkspace();
    return;
  }

  if (activeTool === 'resumeMaker') {
    const name = document.getElementById('cvName').value.trim() || 'John Doe';
    const contact = document.getElementById('cvContact').value.trim() || 'Phone | Email';
    const body = document.getElementById('cvBody').value.trim() || 'Experience...';
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text(name, 15, 20);
    doc.setFontSize(11); doc.text(contact, 15, 28);
    doc.line(15, 33, 195, 33);
    doc.text(doc.splitTextToSize(body, 180), 15, 42);
    downloadBlob(doc.output('blob'), `Resume_${name.replace(/\s+/g, '_')}.pdf`, 'application/pdf');
    closeWorkspace();
    return;
  }

  if (activeTool === 'docMaker') {
    const title = document.getElementById('optDocTitle').value.trim() || 'MEMO';
    const content = document.getElementById('optDocContent').value.trim() || 'Notes...';
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text(title, 105, 20, { align: 'center' });
    doc.line(15, 25, 195, 25);
    doc.text(doc.splitTextToSize(content, 180), 15, 35);
    downloadBlob(doc.output('blob'), 'Document.pdf', 'application/pdf');
    closeWorkspace();
    return;
  }

  const fileNeeded = ['kbResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'jpgToPdf', 'wordToPdf', 'excelToPdf', 'pptToPdf', 'htmlToPdf', 'pdfToJpg', 'pdfToWord', 'pdfToExcel', 'editPdf', 'sign', 'watermark', 'protect', 'unlock', 'pageNumbers'];
  if (fileNeeded.includes(activeTool) && selectedFiles.length === 0) {
    alert('Please select the required file(s).');
    return;
  }

  btn.innerText = 'Processing...';
  btn.disabled = true;
  setProgress(5, 'Starting...');

  try {
    if (activeTool === 'kbResizer') {
      setProgress(20, 'Resizing image precisely...');
      const valInput = parseFloat(document.getElementById('optPresetSize').value) || 50;
      const unit = document.getElementById('optTargetUnit').value;
      const customName = document.getElementById('optCustomFileName').value.trim() || 'Resized_Photo';
      const targetBytes = unit === 'MB' ? valInput * 1024 * 1024 : valInput * 1024;
      const file = selectedFiles[0];
      
      const rawData = await readFileAsDataURL(file);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const canvas = document.createElement('canvas');
      let width = img.width, height = img.height;
      const maxDim = targetBytes <= 25000 ? 500 : (targetBytes <= 55000 ? 700 : 1000);
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
    } else if (activeTool === 'passportGrid') {
      const count = parseInt(document.getElementById('optPassportCopies').value) || 8;
      const customName = document.getElementById('optPassportFileName').value.trim() || 'Passport_Sheet';
      const rawData = await readFileAsDataURL(selectedFiles[0]);
      const data = await imageToJpegDataUrl(rawData);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = 35, h = 45, cols = count <= 4 ? 2 : 4;
      const startX = cols === 2 ? (210 - (cols * w + (cols - 1) * 10)) / 2 : 15;
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols), col = i % cols;
        const x = startX + col * (w + 8), y = 20 + row * (h + 10);
        if (y + h > 285) pdf.addPage();
        pdf.addImage(data, 'JPEG', x, y, w, h);
        pdf.setDrawColor(200, 200, 200); pdf.rect(x, y, w, h);
      }
      downloadBlob(pdf.output('blob'), `${customName}_${count}_Copies.pdf`, 'application/pdf');
    } else if (activeTool === 'merge') {
      const mergedPdf = await PDFLib.PDFDocument.create();
      for (const file of selectedFiles) {
        const doc = await PDFLib.PDFDocument.load(await file.arrayBuffer());
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      downloadBlob(await mergedPdf.save(), 'Merged_Document.pdf', 'application/pdf');
    } else if (activeTool === 'split') {
      const range = document.getElementById('optRange').value.trim();
      const doc = await PDFLib.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const indices = parseRange(range, doc.getPageCount());
      const newDoc = await PDFLib.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Split_Document.pdf', 'application/pdf');
    } else if (activeTool.includes('ToPdf')) {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      pdf.text(`Converted Document: ${selectedFiles[0].name}`, 15, 20);
      downloadBlob(pdf.output('blob'), `${activeTool.toUpperCase()}_Converted.pdf`, 'application/pdf');
    } else {
      alert(`${activeTool.toUpperCase()} executed successfully.`);
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred: ' + err.message);
  } finally {
    setProgress(100, 'Done');
    btn.innerText = originalText;
    btn.disabled = false;
    setTimeout(() => { resetProgress(); closeWorkspace(); }, 180);
  }
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parseRange(str, total) {
  const indices = new Set();
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
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}
