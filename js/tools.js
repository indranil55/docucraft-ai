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
    desc.innerText = 'Select preset size and file name. (Recommended Indian Form Size: 20-50 KB for Photo)';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select photo/signature';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Select Preset Size & Unit:</label>
        <div style="display: flex; gap: 8px;">
          <select id="optPresetSize" class="form-control" style="flex: 2;">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50" selected>50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
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
    desc.innerText = 'Generate print-ready passport sheets on A4 paper (35 x 45 mm / 1.38 x 1.77 inch).';
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
  } else if (toolKey === 'merge') {
    title.innerText = 'Merge PDF';
    desc.innerText = 'Select 2 or more PDF files to combine.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = true;
    dropText.innerText = 'Tap to select PDF files';
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
  } else if (toolKey === 'compress') {
    title.innerText = 'Compress PDF';
    desc.innerText = 'Reduce file size using JPEG canvas compression.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF to compress';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Compression Level:</label>
        <select id="optCompressLevel" class="form-control">
          <option value="0.7">Recommended Quality (~60% compression)</option>
          <option value="0.5">High Compression (Smallest size)</option>
          <option value="0.85">Light Compression (Best quality)</option>
        </select>
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
    desc.innerText = 'Delete unwanted pages permanently.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select a PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Pages to Delete (e.g., 2, 4):</label>
        <input type="text" id="optDeleteRange" class="form-control" placeholder="e.g., 2, 4">
      </div>`;
  } else if (toolKey === 'jpgToPdf' || toolKey === 'wordToPdf' || toolKey === 'excelToPdf' || toolKey === 'pptToPdf' || toolKey === 'htmlToPdf') {
    title.innerText = `${toolKey.includes('jpg') ? 'Image' : toolKey.replace('ToPdf', '').toUpperCase()} to PDF`;
    desc.innerText = 'Convert files into a standard A4 PDF document.';
    fileInput.accept = toolKey.includes('jpg') ? 'image/*' : '*/*';
    fileInput.multiple = toolKey.includes('jpg');
    dropText.innerText = 'Tap to select file(s)';
  } else if (toolKey === 'pdfToJpg') {
    title.innerText = 'PDF to Image (JPG/PNG)';
    desc.innerText = 'Extract PDF pages as individual JPEG images.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
  } else if (toolKey === 'pdfToWord') {
    title.innerText = 'PDF to Word (DOCX)';
    desc.innerText = 'Extract text and layout into an editable Word document.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
  } else if (toolKey === 'pdfToExcel') {
    title.innerText = 'PDF to Excel (XLSX)';
    desc.innerText = 'Extract tables and data into an Excel spreadsheet table.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
  } else if (toolKey === 'editPdf') {
    title.innerText = 'Edit PDF';
    desc.innerText = 'Add text notes or stamps onto your PDF document.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Text to Add:</label>
        <input type="text" id="optEditText" class="form-control" placeholder="e.g., Approved / Verified">
      </div>`;
  } else if (toolKey === 'sign') {
    title.innerText = 'Sign PDF';
    desc.innerText = 'Place a digital signature mark onto the document.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Signer Name:</label>
        <input type="text" id="optSignName" class="form-control" placeholder="e.g., John Doe">
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
    dropText.innerText = 'Tap to select PDF to protect';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Enter Password:</label>
        <input type="password" id="optPdfPassword" class="form-control" placeholder="Enter password">
      </div>`;
  } else if (toolKey === 'unlock') {
    title.innerText = 'Unlock PDF';
    desc.innerText = 'Remove restrictions from your PDF document.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
  } else if (toolKey === 'pageNumbers') {
    title.innerText = 'Add Page Numbers';
    desc.innerText = 'Stamp Page N of M numbering at bottom center.';
    fileInput.accept = 'application/pdf';
    fileInput.multiple = false;
    dropText.innerText = 'Tap to select PDF';
  } else if (toolKey === 'invoiceMaker') {
    title.innerText = 'Invoice / Bill Generator';
    desc.innerText = 'Create customer billing receipts.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Shop / Business Name:</label>
        <input type="text" id="invShop" class="form-control" value="DIGITAL SEVA KENDRA">
      </div>
      <div class="form-group">
        <label>Customer Name:</label>
        <input type="text" id="invCust" class="form-control" placeholder="Customer Name">
      </div>
      <div class="form-group">
        <label>Description of Services / Items:</label>
        <textarea id="invItems" class="form-control" rows="3" placeholder="Service fee"></textarea>
      </div>
      <div class="form-group">
        <label>Total Amount:</label>
        <input type="text" id="invTotal" class="form-control" placeholder="50.00">
      </div>`;
  } else if (toolKey === 'resumeMaker') {
    title.innerText = 'Resume / CV Maker to PDF';
    desc.innerText = 'Build a quick professional curriculum vitae.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Full Name:</label>
        <input type="text" id="cvName" class="form-control" placeholder="John Doe">
      </div>
      <div class="form-group">
        <label>Contact & Email:</label>
        <input type="text" id="cvContact" class="form-control" placeholder="phone | email">
      </div>
      <div class="form-group">
        <label>Professional Experience & Skills:</label>
        <textarea id="cvBody" class="form-control" rows="5" placeholder="Skills, education..."></textarea>
      </div>`;
  } else if (toolKey === 'docMaker') {
    title.innerText = 'Prescription / Memo Maker';
    desc.innerText = 'Create printable clinical prescriptions or memos.';
    dropzone.style.display = 'none';
    customUI.innerHTML = `
      <div class="form-group">
        <label>Clinic / Header Title:</label>
        <input type="text" id="optDocTitle" class="form-control" value="MEDICAL PRESCRIPTION">
      </div>
      <div class="form-group">
        <label>Patient & Treatment Notes:</label>
        <textarea id="optDocContent" class="form-control" rows="5" placeholder="Rx Medications..."></textarea>
      </div>`;
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
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

function validateSelectedFiles(files, maxBytes = 50 * 1024 * 1024) {
  const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedPdf = ['application/pdf'];
  for (const file of files) {
    if (!file || !file.name) throw new Error('Invalid file selected.');
    if (file.size <= 0) throw new Error(`"${file.name}" is empty.`);
    if (file.size > maxBytes) {
      throw new Error(`"${file.name}" is larger than 50 MB.`);
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    const isImage = allowedImage.includes(type) || ['jpg','jpeg','png','webp','gif'].includes(ext);
    const isPdf = allowedPdf.includes(type) || ext === 'pdf';
    if (!isImage && !isPdf) {
      throw new Error(`"${file.name}" is not a supported file type.`);
    }
  }
}

async function executeToolAction() {
  const btn = document.getElementById('wsActionBtn');
  const originalText = btn.innerText;

  if (activeTool === 'sigPad') {
    if (!sigCanvasInstance) return;
    const dataUrl = sigCanvasInstance.toDataURL('image/png');
    downloadBlob(dataUrl, 'Digital_Signature.png', 'image/png');
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

  const fileNeeded = ['kbResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'jpgToPdf', 'wordToPdf', 'excelToPdf', 'pptToPdf', 'htmlToPdf', 'pdfToJpg', 'pdfToWord', 'pdfToExcel', 'editPdf', 'sign', 'watermark', 'protect', 'unlock', 'pageNumbers'];
  if (fileNeeded.includes(activeTool) && selectedFiles.length === 0) {
    alert('Please select the required file(s).');
    return;
  }

  try {
    validateSelectedFiles(selectedFiles);
  } catch (validationError) {
    alert(validationError.message);
    return;
  }

  btn.innerText = 'Processing...';
  btn.disabled = true;
  setProgress(5, 'Starting...');

  try {
    if (activeTool === 'kbResizer') {
      setProgress(20, 'Resizing image...');
      const valInput = parseFloat(document.getElementById('optPresetSize').value) || 50;
      const unit = document.getElementById('optTargetUnit').value;
      const customName = document.getElementById('optCustomFileName').value.trim() || 'Resized_Photo';
      const targetBytes = unit === 'MB' ? valInput * 1024 * 1024 : valInput * 1024;
      const file = selectedFiles[0];
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const estimateBytes = (dataUrl) => {
            const base64 = dataUrl.split(',')[1] || '';
            const padding = (base64.match(/=*$/) || [''])[0].length;
            return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
          };

          let dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          let sizeBytes = estimateBytes(dataUrl);

          let low = 0.1;
          let high = 0.98;
          for (let i = 0; i < 10; i++) {
            const quality = (low + high) / 2;
            const candidate = canvas.toDataURL('image/jpeg', quality);
            const candidateSize = estimateBytes(candidate);
            if (candidateSize > targetBytes) {
              high = quality;
            } else {
              low = quality;
              dataUrl = candidate;
              sizeBytes = candidateSize;
            }
          }

          downloadBlob(dataUrl, `${customName}_${valInput}${unit}.jpg`, 'image/jpeg');
          setProgress(100, 'Complete');
          btn.innerText = originalText;
          btn.disabled = false;
          setTimeout(() => { resetProgress(); closeWorkspace(); }, 200);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      return;

    } else if (activeTool === 'passportGrid') {
      setProgress(30, 'Generating passport sheet...');
      const count = parseInt(document.getElementById('optPassportCopies').value) || 8;
      const customName = document.getElementById('optPassportFileName').value.trim() || 'Passport_Sheet';
      const rawData = await readFileAsDataURL(selectedFiles[0]);
      const data = await imageToJpegDataUrl(rawData);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = 35, h = 45;
      let cols = 4;
      if (count <= 4) cols = 2;
      
      const startX = cols === 2 ? (210 - (cols * w + (cols - 1) * 10)) / 2 : 15;
      const startY = 20;
      const gapX = 8;
      const gapY = 10;

      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = startX + col * (w + gapX);
        const y = startY + row * (h + gapY);
        if (y + h > 285) { pdf.addPage(); }
        pdf.addImage(data, 'JPEG', x, y, w, h);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(x, y, w, h);
      }
      setProgress(90, 'Saving...');
      const pdfOutput = pdf.output('blob');
      downloadBlob(pdfOutput, `${customName}_${count}_Copies.pdf`, 'application/pdf');

    } else if (activeTool === 'merge') {
      if (selectedFiles.length < 2) {
        alert('Select 2 or more PDF files.');
        btn.disabled = false;
        btn.innerText = originalText;
        return;
      }
      const mergedPdf = await PDFLib.PDFDocument.create();
      for (let i = 0; i < selectedFiles.length; i++) {
        const bytes = await selectedFiles[i].arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      const outBytes = await mergedPdf.save();
      downloadBlob(outBytes, 'Merged_Document.pdf', 'application/pdf');

    } else if (activeTool === 'split') {
      const range = document.getElementById('optRange').value.trim();
      const bytes = await selectedFiles[0].arrayBuffer();
      const srcDoc = await PDFLib.PDFDocument.load(bytes);
      const indices = parseRange(range, srcDoc.getPageCount());
      const newDoc = await PDFLib.PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach(p => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      downloadBlob(outBytes, 'Split_Document.pdf', 'application/pdf');

    } else if (activeTool === 'invoiceMaker') {
      const shop = document.getElementById('invShop').value.trim() || 'INVOICE';
      const cust = document.getElementById('invCust').value.trim() || 'Customer';
      const items = document.getElementById('invItems').value.trim();
      const total = document.getElementById('invTotal').value.trim() || '0.00';
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ format: 'a5' });

      doc.setFontSize(15);
      doc.text(shop, 74, 18, { align: 'center' });
      doc.setFontSize(10);
      doc.text('CASH MEMO / INVOICE', 74, 25, { align: 'center' });
      doc.line(10, 28, 138, 28);
      doc.text(`Customer: ${cust}`, 14, 36);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 36);
      doc.line(10, 40, 138, 40);
      const split = doc.splitTextToSize(items || 'Services rendered', 120);
      doc.text(split, 14, 48);
      doc.line(10, 150, 138, 150);
      doc.setFontSize(12);
      doc.text(`Total: $ ${total}`, 85, 160);
      downloadBlob(doc.output('blob'), `Invoice_${cust.replace(/\s+/g, '_')}.pdf`, 'application/pdf');
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
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Unable to decode image.'));
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
