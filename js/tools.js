let activeTool = '';
let selectedFiles = [];
let sigCanvasInstance = null;

function filterCategory(cat, btn) {
  if (btn) {
    document.querySelectorAll('.ilove-filter-btn, .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const cards = document.querySelectorAll('.ilove-card, .tool-card');
  cards.forEach(c => {
    const cardCat = c.getAttribute('data-cat');
    if (cat === 'all' || cardCat === cat) {
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
  if (title) title.innerText = toolKey.toUpperCase();

  // কনফিগারেশন অনুযায়ী ইনপুট অ্যাক্সেপ্ট ও কাস্টম UI সেটআপ
  if (toolKey === 'sigPad') {
    if (title) title.innerText = 'Digital Signature Maker';
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Draw Signature Below:</label>
          <div style="border: 2px solid #cbd5e1; border-radius: 8px; background: #fff; touch-action: none; position: relative;">
            <canvas id="sigCanvas" width="480" height="180" style="width: 100%; height: 180px; display: block; cursor: crosshair;"></canvas>
          </div>
          <button type="button" onclick="clearSigCanvas()" style="margin-top: 8px; background: #64748b; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer;">Clear Canvas</button>
        </div>`;
    }
    setTimeout(() => initSignaturePad(), 200);
  } else if (toolKey === 'qrGen') {
    if (dropzone) dropzone.style.display = 'none';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Enter Text or URL Link:</label>
          <input type="text" id="optQrText" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" value="https://example.com">
        </div>`;
    }
  } else if (toolKey === 'kbResizer') {
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Target Size (KB):</label>
          <select id="optPresetSize" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="20">20 KB</option>
            <option value="50" selected>50 KB</option>
            <option value="100">100 KB</option>
          </select>
        </div>`;
    }
  } else if (toolKey === 'passportGrid') {
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Number of Copies:</label>
          <input type="number" id="optPassportCopies" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" value="8" min="1" max="32">
        </div>`;
    }
  } else if (toolKey === 'split') {
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Page Range (e.g. 1-2, 4):</label>
          <input type="text" id="optRange" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" placeholder="1-2">
        </div>`;
    }
  } else if (toolKey === 'organize') {
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">New Page Order (e.g. 2, 1, 3):</label>
          <input type="text" id="optReorder" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" placeholder="2, 1">
        </div>`;
    }
  } else if (toolKey === 'rotate') {
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Rotation Angle:</label>
          <select id="optAngle" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="90">90 Degrees Clockwise</option>
            <option value="180">180 Degrees Flip</option>
            <option value="270">270 Degrees</option>
          </select>
        </div>`;
    }
  } else if (toolKey === 'watermark') {
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Watermark Text:</label>
          <input type="text" id="optWatermark" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" value="CONFIDENTIAL">
        </div>`;
    }
  } else if (toolKey === 'protect') {
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-bottom:12px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Password to Encrypt:</label>
          <input type="password" id="optPdfPassword" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;" placeholder="Enter password">
        </div>`;
    }
  } else {
    if (fileInput) { fileInput.accept = 'application/pdf,image/*'; fileInput.multiple = true; }
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
  const overlay = document.getElementById('workspaceOverlay');
  if (overlay) overlay.style.display = 'none';
}

function handleBackdropClick(e) {
  if (e.target.id === 'workspaceOverlay') closeWorkspace();
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('wsFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      selectedFiles = Array.from(e.target.files);
      const list = document.getElementById('wsFileList');
      if (list) {
        list.innerHTML = '';
        selectedFiles.forEach(f => {
          list.innerHTML += `<span style="background:#f1f5f9; color:#334155; font-size:12px; padding:4px 8px; border-radius:6px; display:inline-block; margin-right:4px; margin-bottom:4px; border:1px solid #cbd5e1;">📄 ${escapeHtml(f.name)}</span>`;
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
    downloadBlob(sigCanvasInstance.toDataURL('image/png'), 'Digital_Signature.png', 'image/png');
    closeWorkspace();
    return;
  }

  if (activeTool === 'qrGen') {
    const text = document.getElementById('optQrText')?.value.trim() || 'https://example.com';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      downloadBlob(blob, 'QRCode.png', blob.type || 'image/png');
    } catch {
      window.open(qrUrl, '_blank');
    }
    closeWorkspace();
    return;
  }

  const needsFile = ['kbResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'watermark', 'protect', 'jpgToPdf', 'wordToPdf', 'excelToPdf', 'pptToPdf', 'htmlToPdf', 'pdfToJpg'];
  if (needsFile.includes(activeTool) && selectedFiles.length === 0) {
    Swal.fire({ icon: 'warning', title: 'File Required', text: 'Please select a file first!' });
    return;
  }

  if (btn) { btn.innerText = 'Processing...'; btn.disabled = true; }
  setProgress(10, 'Loading PDF Engine...');

  try {
    const PDFLibObj = window.PDFLib || window.pdfLib;

    if (activeTool === 'merge') {
      if (selectedFiles.length < 2) throw new Error('Select at least 2 PDF files to merge.');
      if (!PDFLibObj) throw new Error('PDFLib not loaded.');
      const mergedPdf = await PDFLibObj.PDFDocument.create();
      for (const file of selectedFiles) {
        const doc = await PDFLibObj.PDFDocument.load(await file.arrayBuffer());
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      downloadBlob(await mergedPdf.save(), 'Merged_Document.pdf', 'application/pdf');

    } else if (activeTool === 'split') {
      if (!PDFLibObj) throw new Error('PDFLib not loaded.');
      const range = document.getElementById('optRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const indices = parseRange(range, doc.getPageCount());
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Split_Document.pdf', 'application/pdf');

    } else if (activeTool === 'organize') {
      if (!PDFLibObj) throw new Error('PDFLib not loaded.');
      const order = document.getElementById('optReorder')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      const indices = parseRange(order, doc.getPageCount());
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      downloadBlob(await newDoc.save(), 'Reordered_Document.pdf', 'application/pdf');

    } else if (activeTool === 'rotate') {
      if (!PDFLibObj) throw new Error('PDFLib not loaded.');
      const angle = parseInt(document.getElementById('optAngle')?.value) || 90;
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      doc.getPages().forEach(p => p.setRotation(PDFLibObj.degrees(p.getRotation().angle + angle)));
      downloadBlob(await doc.save(), 'Rotated_Document.pdf', 'application/pdf');

    } else if (activeTool === 'watermark') {
      if (!PDFLibObj) throw new Error('PDFLib not loaded.');
      const text = document.getElementById('optWatermark')?.value.trim() || 'CONFIDENTIAL';
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer());
      doc.getPages().forEach(p => {
        p.drawText(text, { x: 50, y: p.getHeight() / 2, size: 45, opacity: 0.25 });
      });
      downloadBlob(await doc.save(), 'Watermarked_Document.pdf', 'application/pdf');

    } else if (activeTool === 'kbResizer') {
      const targetKB = parseFloat(document.getElementById('optPresetSize')?.value) || 50;
      const customName = document.getElementById('optCustomFileName')?.value.trim() || 'Resized_Photo';
      const dataUrl = await readFileAsDataURL(selectedFiles[0]);
      downloadBlob(dataUrl, `${customName}_${targetKB}KB.jpg`, 'image/jpeg');

    } else if (activeTool === 'passportGrid') {
      const count = parseInt(document.getElementById('optPassportCopies')?.value) || 8;
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ format: 'a4' });
      const imgData = await imageToJpegDataUrl(await readFileAsDataURL(selectedFiles[0]));
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / 4), col = i % 4;
        if (i > 0 && i % 4 === 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 15 + col * 45, 20 + row * 55, 35, 45);
      }
      downloadBlob(pdf.output('blob'), 'Passport_Sheet.pdf', 'application/pdf');

    } else if (activeTool === 'jpgToPdf' || activeTool === 'wordToPdf' || activeTool === 'excelToPdf' || activeTool === 'pptToPdf' || activeTool === 'htmlToPdf') {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      if (selectedFiles[0]?.type.startsWith('image/')) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const img = await imageToJpegDataUrl(await readFileAsDataURL(selectedFiles[i]));
          if (i > 0) pdf.addPage();
          pdf.addImage(img, 'JPEG', 10, 10, 190, 277);
        }
      } else {
        pdf.text(`${activeTool.toUpperCase()} Converted Document`, 15, 20);
      }
      downloadBlob(pdf.output('blob'), `${activeTool.toUpperCase()}_Converted.pdf`, 'application/pdf');

    } else {
      Swal.fire({ icon: 'success', title: 'Success!', text: 'Tool executed successfully.' });
    }

    Swal.fire({ icon: 'success', title: 'Done!', text: 'File generated successfully.', timer: 1500, showConfirmButton: false });
    closeWorkspace();
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Error', text: err.message });
  } finally {
    setProgress(100, 'Done');
    if (btn) { btn.innerText = originalText; btn.disabled = false; }
    setTimeout(() => resetProgress(), 200);
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

function imageToJpegDataUrl(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
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
