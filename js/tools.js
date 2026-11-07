// DocuCraft AI - Fully Fixed, Robust & Cross-Platform Execution Script

let activeTool = '';
let selectedFiles = [];
let sigCanvasInstance = null;

// Dynamic Script Loader
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

function openCustomModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  try {
    history.pushState({ modalOpen: true, target: modalId }, '', window.location.pathname + '#modal-' + modalId);
  } catch(e) {}
}

function launchTool(toolKey) {
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
    document.body.style.overflow = 'hidden';
    
    try {
      history.pushState({ modalOpen: true, tool: toolKey }, '', window.location.pathname + '#tool-' + toolKey);
    } catch(e) {
      history.pushState({ modalOpen: true }, '', window.location.href);
    }
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
            <canvas id="sigCanvas" style="width: 100%; height: 180px; display: block; cursor: crosshair; touch-action: none;"></canvas>
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
    if (desc) desc.innerText = 'Select photo: get original 3.5x4.5 cm photo and print-ready tight grid.';
    if (dropText) dropText.innerText = 'Tap to select photo';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Download Type:</label>
            <select id="optPassportType" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="both" selected>Both (Single Photo + Grid)</option>
              <option value="single">Only Original Single Photo (3.5x4.5 cm)</option>
              <option value="grid">Only Photo Grid Sheet</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Number of Copies:</label>
            <select id="optPassportCopies" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="1">1 Photo</option>
              <option value="2">2 Photos (1x2)</option>
              <option value="4">4 Photos (2x2)</option>
              <option value="6">6 Photos (2x3)</option>
              <option value="8" selected>8 Photos (3+3+2)</option>
              <option value="12">12 Photos (3x4)</option>
              <option value="16">16 Photos (4x4)</option>
            </select>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Photo Border:</label>
            <select id="optPassportBorder" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="thin" selected>Thin Cutting Border</option>
              <option value="none">No Border</option>
              <option value="black">Dark Border</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Save File Name:</label>
            <input type="text" id="optPassportFileName" class="form-control" value="Passport_Photo" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
          </div>
        </div>`;
    }
  } else if (toolKey === 'merge') {
    if (title) title.innerText = 'Merge PDF';
    if (desc) desc.innerText = 'Select multiple PDF files to combine. Order can be rearranged.';
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
    if (title) title.innerText = 'Optimize / Compact PDF';
    if (desc) desc.innerText = 'Streamline document data and remove redundant streams.';
    if (dropText) dropText.innerText = 'Tap to select PDF';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optCompressFileName" class="form-control" value="Compressed_Document" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'organize') {
    if (title) title.innerText = 'Organize / Reorder Pages';
    if (desc) desc.innerText = 'Rearrange or change the sequence of pages.';
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
    if (desc) desc.innerText = 'Convert your image files into a clean PDF with proper sizing.';
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
  } else {
    let formattedTitle = toolKey;
    const lowerKey = toolKey.toLowerCase();
    if (lowerKey === 'pdfexcel') formattedTitle = 'PDF to Excel';
    else if (lowerKey === 'pdftext') formattedTitle = 'PDF to Text';
    else if (lowerKey === 'pdfword') formattedTitle = 'PDF to Word';
    else if (lowerKey === 'pdfjpg') formattedTitle = 'PDF to JPG';
    else if (lowerKey === 'pdfpng') formattedTitle = 'PDF to PNG';
    else if (lowerKey === 'wordtopdf') formattedTitle = 'Word to PDF';
    else if (lowerKey === 'exceltopdf') formattedTitle = 'Excel to PDF';
    else if (lowerKey === 'ppttopdf') formattedTitle = 'PowerPoint to PDF';
    else if (lowerKey === 'htmltopdf') formattedTitle = 'HTML to PDF';
    else if (lowerKey === 'texttopdf') formattedTitle = 'Text to PDF';
    else {
      formattedTitle = toolKey.replace(/([A-Z])/g, ' $1').toUpperCase();
    }

    if (title) title.innerText = formattedTitle;
    if (desc) desc.innerText = 'Process your document instantly.';
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

let currentSigColor = '#000000';

function setSigColor(color, btn) {
  currentSigColor = color;
  document.querySelectorAll('.sig-color-btn').forEach(b => {
    b.style.borderColor = 'transparent';
  });
  if (btn) btn.style.borderColor = '#2563eb';
}

function initSignaturePad() {
  const canvas = document.getElementById('sigCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Retina / High-DPI Display Scaling
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  }

  canvas.onpointerdown = (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    const p = getPos(e);
    lastX = p.x;
    lastY = p.y;
    ctx.strokeStyle = currentSigColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    e.preventDefault();
  };

  canvas.onpointermove = (e) => {
    if (!drawing) return;
    const p = getPos(e);
    ctx.strokeStyle = currentSigColor;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
    e.preventDefault();
  };

  canvas.onpointerup = (e) => {
    drawing = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch(err) {}
  };
  canvas.onpointercancel = canvas.onpointerup;

  sigCanvasInstance = canvas;
}

function clearSigCanvas() {
  if (!sigCanvasInstance) return;
  const ctx = sigCanvasInstance.getContext('2d');
  const rect = sigCanvasInstance.getBoundingClientRect();
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, sigCanvasInstance.width, sigCanvasInstance.height);
  ctx.restore();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function closeWorkspace() {
  const overlay = document.getElementById('workspaceOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
  if (window.location.hash.includes('#tool-')) {
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch(e) {}
  }
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
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    
    sigCanvasInstance.toBlob(async (blob) => {
      await downloadBlob(blob, `Digital_Signature.${ext}`, format);
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
      await downloadBlob(blob, 'QRCode.png', 'image/png');
      showSuccessPopup('QR Code Generated Successfully!');
    } catch {
      window.open(qrUrl, '_blank');
    }
    closeWorkspace();
    return;
  }

  const fileNeeded = ['kbResizer', 'examResizer', 'passportGrid', 'merge', 'split', 'compress', 'organize', 'rotate', 'removePages', 'jpgToPdf', 'pngToPdf', 'watermark'];
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
      canvas.width = img.width; 
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      let low = 0.05, high = 0.95, bestBlob = null;
      for (let i = 0; i < 10; i++) {
        const quality = (low + high) / 2;
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        if (blob.size <= targetBytes) { 
          bestBlob = blob; 
          low = quality; 
        } else { 
          high = quality; 
        }
      }
      if (!bestBlob) bestBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.1));

      await downloadBlob(bestBlob, `${customName}_${valInput}${unit}.jpg`, 'image/jpeg');
      showSuccessPopup('Photo Resized Successfully!');

    } else if (activeTool === 'passportGrid') {
      setProgress(30, 'Generating Passport Photo Grid...');
      const copies = parseInt(document.getElementById('optPassportCopies')?.value) || 8;
      const bgColor = document.getElementById('optPassportBgColor')?.value || 'white';
      const borderType = document.getElementById('optPassportBorder')?.value || 'thin';
      const fileName = document.getElementById('optPassportFileName')?.value?.trim() || 'Smart_Passport_Sheet';

      const rawData = await readFileAsDataURL(selectedFiles[0]);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = 2480;
      sheetCanvas.height = 3508;
      const sheetCtx = sheetCanvas.getContext('2d');

      sheetCtx.fillStyle = '#ffffff';
      sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

      let cols = 2, rows = 2;
      if (copies === 8) { cols = 2; rows = 4; }
      else if (copies === 12) { cols = 3; rows = 4; }
      else if (copies === 20) { cols = 4; rows = 5; }

      const pw = 413, ph = 531, gapX = 60, gapY = 60;
      const totalGridW = (cols * pw) + ((cols - 1) * gapX);
      const totalGridH = (rows * ph) + ((rows - 1) * gapY);
      const startX = (sheetCanvas.width - totalGridW) / 2;
      const startY = (sheetCanvas.height - totalGridH) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (pw + gapX);
          const y = startY + r * (ph + gapY);

          sheetCtx.fillStyle = bgColor === 'blue' ? '#1d4ed8' : '#ffffff';
          sheetCtx.fillRect(x, y, pw, ph);

          const aspectImg = img.width / img.height;
          const aspectPass = pw / ph;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;

          if (aspectImg > aspectPass) {
            sw = img.height * aspectPass;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / aspectPass;
            sy = (img.height - sh) / 2;
          }
          sheetCtx.drawImage(img, sx, sy, sw, sh, x, y, pw, ph);

          if (borderType === 'thin') {
            sheetCtx.strokeStyle = '#cbd5e1';
            sheetCtx.lineWidth = 4;
            sheetCtx.strokeRect(x, y, pw, ph);
          } else if (borderType === 'black') {
            sheetCtx.strokeStyle = '#000000';
            sheetCtx.lineWidth = 6;
            sheetCtx.strokeRect(x, y, pw, ph);
          }
        }
      }

      const sheetBlob = await new Promise(r => sheetCanvas.toBlob(r, 'image/jpeg', 0.95));
      await downloadBlob(sheetBlob, `${fileName}.jpg`, 'image/jpeg');
      showSuccessPopup('Passport Photo Sheet Generated Successfully!');

    } else if (activeTool === 'examResizer') {
      setProgress(30, 'Formatting Exam Photo/Signature...');
      const examType = document.getElementById('optExamType')?.value || 'photo';
      const fileName = document.getElementById('optExamFileName')?.value?.trim() || 'Exam_Document';
      
      const targetW = examType === 'photo' ? 200 : 140;
      const targetH = examType === 'photo' ? 230 : 60;
      const targetMaxBytes = examType === 'photo' ? 50 * 1024 : 20 * 1024;

      const rawData = await readFileAsDataURL(selectedFiles[0]);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let low = 0.1, high = 0.95, bestBlob = null;
      for (let i = 0; i < 8; i++) {
        const quality = (low + high) / 2;
        const b = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
        if (b.size <= targetMaxBytes) { bestBlob = b; low = quality; }
        else { high = quality; }
      }
      if (!bestBlob) bestBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.3));

      await downloadBlob(bestBlob, `${fileName}.jpg`, 'image/jpeg');
      showSuccessPopup('Exam Photo/Sign Resized Successfully!');

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
      await downloadBlob(mergedPdfBytes, `${customName}.pdf`, 'application/pdf');
      showSuccessPopup('PDFs Merged Successfully!');

    } else if (activeTool === 'compress' && PDFLibObj) {
      setProgress(30, 'Optimizing PDF streams...');
      const customName = document.getElementById('optCompressFileName')?.value?.trim() || 'Compressed_Document';
      const fileBuffer = await selectedFiles[0].arrayBuffer();
      const doc = await PDFLibObj.PDFDocument.load(fileBuffer);
      const compressedBytes = await doc.save({ useObjectStreams: true });
      await downloadBlob(compressedBytes, `${customName}.pdf`, 'application/pdf');
      showSuccessPopup('PDF Optimized Successfully!');

    } else if (activeTool === 'split' && PDFLibObj) {
      const range = document.getElementById('optRange')?.value.trim();
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      const indices = parseRange(range, doc.getPageCount());
      if (indices.length === 0) { alert('Invalid page range selected.'); return; }
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach(p => newDoc.addPage(p));
      await downloadBlob(await newDoc.save(), 'Split_Document.pdf', 'application/pdf');
      showSuccessPopup('PDF Split Successfully!');

    } else if (activeTool === 'rotate' && PDFLibObj) {
      const angle = parseInt(document.getElementById('optAngle')?.value) || 90;
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      doc.getPages().forEach(p => p.setRotation(PDFLibObj.degrees(p.getRotation().angle + angle)));
      await downloadBlob(await doc.save(), 'Rotated_Document.pdf', 'application/pdf');
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
      if (keepIndices.length === 0) { alert('Cannot delete all pages.'); return; }
      const newDoc = await PDFLibObj.PDFDocument.create();
      const pages = await newDoc.copyPages(doc, keepIndices);
      pages.forEach(p => newDoc.addPage(p));
      await downloadBlob(await newDoc.save(), 'Cleaned_Document.pdf', 'application/pdf');
      showSuccessPopup('Pages Deleted Successfully!');

    } else if (activeTool === 'watermark' && PDFLibObj) {
      const wmText = document.getElementById('optWatermark')?.value.trim() || 'CONFIDENTIAL';
      const doc = await PDFLibObj.PDFDocument.load(await selectedFiles[0].arrayBuffer(), { ignoreEncryption: true });
      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(wmText, {
          x: width / 6,
          y: height / 2,
          size: 36,
          color: PDFLibObj.rgb(0.75, 0.75, 0.75),
          rotate: PDFLibObj.degrees(45),
        });
      });
      await downloadBlob(await doc.save(), 'Watermarked_Document.pdf', 'application/pdf');
      showSuccessPopup('Watermark Added Successfully!');

    } else if (activeTool === 'jpgToPdf' || activeTool === 'pngToPdf') {
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;
      
      const orientation = document.getElementById('optImgPdfOrientation')?.value || 'portrait';
      const pageSize = document.getElementById('optImgPdfPageSize')?.value || 'a4';

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      for (let i = 0; i < selectedFiles.length; i++) {
        const rawData = await readFileAsDataURL(selectedFiles[i]);
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

        if (i > 0) pdf.addPage(pageSize, orientation);

        const maxW = pageWidth - (margin * 2);
        const maxH = pageHeight - (margin * 2);
        let renderW = maxW;
        let renderH = (img.height * renderW) / img.width;

        if (renderH > maxH) {
          renderH = maxH;
          renderW = (img.width * renderH) / img.height;
        }

        const x = margin + (maxW - renderW) / 2;
        const y = margin + (maxH - renderH) / 2;

        pdf.addImage(rawData, 'JPEG', x, y, renderW, renderH);
      }
      
      const pdfBlob = pdf.output('blob');
      await downloadBlob(pdfBlob, 'Images_Converted.pdf', 'application/pdf');
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
      if (!isNaN(s) && !isNaN(e)) {
        for (let i = s; i <= e; i++) if (i >= 1 && i <= total) indices.add(i - 1);
      }
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

// Universal Cross-Platform Downloader (Supports iOS/Android Native Share Sheet + Desktop Anchor)
async function downloadBlob(content, name, mimeType = 'application/octet-stream') {
  if (!content) return;
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });

  // Native mobile sharing if supported
  if (navigator.canShare) {
    try {
      const testFile = new File([blob], name, { type: mimeType });
      if (navigator.canShare({ files: [testFile] })) {
        await navigator.share({
          files: [testFile],
          title: name
        });
        return;
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.warn('Native share failed, using fallback:', e);
    }
  }

  // Anchor download fallback
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
  }, 1500);
}
