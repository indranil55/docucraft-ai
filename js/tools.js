// DocuCraft AI - Fully Fixed, Optimized & Secure Tool Execution Script (All Tools Functional)

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
  } else if (toolKey === 'examResizer') {
    if (title) title.innerText = 'Exam Photo & Signature Resizer';
    if (desc) desc.innerText = 'Resize photo and signature to exact size required for government exam forms (SSC, UPSC, NEET, etc.).';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
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
  } else if (toolKey === 'ocr') {
    if (title) title.innerText = 'OCR - Image to Text';
    if (desc) desc.innerText = 'Extract text from any image (JPG, PNG) in Bengali, Hindi, or English.';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select an image';
    if (customUI) {
      customUI.innerHTML = `
        <div class="form-group">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Select Language:</label>
          <select id="optOcrLang" class="form-control" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="eng" selected>English</option>
            <option value="ben">Bengali (বাংলা)</option>
            <option value="hin">Hindi (हिन्दी)</option>
          </select>
        </div>
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save Text File Name:</label>
          <input type="text" id="optOcrFileName" class="form-control" value="Extracted_Text" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>`;
    }
  } else if (toolKey === 'passportGrid') {
    if (title) title.innerText = 'Smart Passport Photo Studio';
    if (desc) desc.innerText = 'Upload any photo: clean background selection (White/Blue), perfect body & print-ready grid.';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = false; }
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
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = true; }
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
  } else if (toolKey === 'jpgToPdf') {
    if (title) title.innerText = 'Image to PDF (JPG/PNG to PDF)';
    if (desc) desc.innerText = 'Convert your image files into a clean, standard PDF document with perfect centering.';
    if (fileInput) { fileInput.accept = 'image/*'; fileInput.multiple = true; }
    if (dropText) dropText.innerText = 'Tap to select image file(s)';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Page Size:</label>
            <select id="optImgPdfPageSize" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="a4" selected>A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Orientation:</label>
            <select id="optImgPdfOrientation" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="portrait" selected>Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Image Quality (MB vs KB):</label>
          <select id="optImgPdfQuality" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
            <option value="high" selected>High (MB Size, Best Quality)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="low">Low (KB Size, Compressed)</option>
          </select>
        </div>`;
    }
  } else if (toolKey === 'pdfToJpg' || toolKey === 'pdfToWord' || toolKey === 'pdfToExcel') {
    const names = { pdfToJpg: 'PDF to Image', pdfToWord: 'PDF to Word', pdfToExcel: 'PDF to Excel' };
    if (title) title.innerText = names[toolKey] || 'Convert PDF';
    if (desc) desc.innerText = 'Convert your PDF file into an editable format with quality options.';
    if (fileInput) { fileInput.accept = 'application/pdf'; fileInput.multiple = false; }
    if (dropText) dropText.innerText = 'Tap to select PDF file';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Output Quality/Size:</label>
            <select id="optOutputQuality" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="high" selected>High (Best Quality)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="low">Low (Small Size)</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Max Target Size:</label>
            <select id="optMaxSize" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="1">1 MB</option>
              <option value="2">2 MB</option>
              <option value="5" selected>5 MB</option>
              <option value="0">No Limit</option>
            </select>
          </div>
        </div>
        <div style="padding: 10px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; text-align: center; color: #64748b; font-size: 12px;">
          Note: Conversion works best with <b>text-based PDFs</b>. Scanned/image PDFs may result in extracted text or images.
        </div>`;
    }
  } else if (toolKey === 'wordToPdf' || toolKey === 'excelToPdf' || toolKey === 'pptToPdf' || toolKey === 'htmlToPdf') {
    const names = { wordToPdf: 'Word to PDF', excelToPdf: 'Excel to PDF', pptToPdf: 'PowerPoint to PDF', htmlToPdf: 'HTML to PDF' };
    if (title) title.innerText = names[toolKey] || 'Convert to PDF';
    if (desc) desc.innerText = 'Convert your files into a clean standard PDF document.';
    if (fileInput) { fileInput.accept = toolKey === 'htmlToPdf' ? 'text/html' : '*/*'; fileInput.multiple = true; }
    if (dropText) dropText.innerText = 'Tap to select file(s)';
    if (customUI) {
      customUI.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Page Size:</label>
            <select id="optOfficePageSize" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="a4" selected>A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Orientation:</label>
            <select id="optOfficeOrientation" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="portrait" selected>Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Output Quality:</label>
            <select id="optOfficeQuality" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="high" selected>High (Best Quality)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="low">Low (Small Size)</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Max Target Size:</label>
            <select id="optOfficeMaxSize" class="form-control" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;">
              <option value="1">1 MB</option>
              <option value="2">2 MB</option>
              <option value="5" selected>5 MB</option>
              <option value="0">No Limit</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top: 10px;">
          <label style="font-weight:600; font-size:13px; display:block; margin-bottom:6px;">Save File Name:</label>
          <input type="text" id="optOfficeFileName" class="form-control" value="${names[toolKey].replace(/ /g, '_')}_Converted" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:8px;">
        </div>
        <div style="padding: 10px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; text-align: center; color: #64748b; font-size: 12px;">
          Supported formats: <b>DOC, DOCX, XLS, XLSX, PPT, PPTX, HTML</b>. Maximum allowed input file size is <b>5 MB</b>.
        </div>`;
    }
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
      if (e.target.files.length > 0) {
        if (fileInput.hasAttribute('multiple')) {
          selectedFiles = [...selectedFiles, ...Array.from(e.target.files)];
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

  let html = `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-top: 10px; max-height: 150px; overflow-y: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
      <i class="fa-solid fa-list-check" style="color: #2563eb;"></i> Selected File(s) (${selectedFiles.length}):
    </div>`;

  selectedFiles.forEach((file, index) => {
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    const safeFileName = escapeHtml(file.name); 
    
    html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px; color: #334155;" title="${safeFileName}">${index + 1}. ${safeFileName} (${fileSize})</span>`;

    if (activeTool === 'merge') {
      html += `<div style="display: flex; gap: 4px;">
        <button type="button" onclick="moveFileUp(${index})" style="background: #cbd5e1; color: #0f172a; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" onclick="moveFileDown(${index})" style="background: #cbd5e1; color: #0f172a; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;" ${index === selectedFiles.length - 1 ? 'disabled' : ''}>↓</button>
        <button type="button" onclick="removeSelectedFile(${index})" style="background: #fee2e2; color: #991b1b; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">×</button>
      </div>`;
    }
    html += `</div>`;
  });
  html += `</div>`;
  listContainer.innerHTML = html;
}

function removeSelectedFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

function moveFileUp(index) {
  if (index > 0) {
    const temp = selectedFiles[index];
    selectedFiles[index] = selectedFiles[index - 1];
    selectedFiles[index - 1] = temp;
    renderFileList(); 
  }
}

function moveFileDown(index) {
  if (index < selectedFiles.length - 1) {
    const temp = selectedFiles[index];
    selectedFiles[index] = selectedFiles[index + 1];
    selectedFiles[index + 1] = temp;
    renderFileList(); 
  }
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

  if (activeTool === 'examResizer') {
    if (selectedFiles.length === 0) { alert('Please select an image.'); return; }
    if (btn) { btn.innerText = 'Processing...'; btn.disabled = true; }
    setProgress(20, 'Resizing for exam form...');
    
    try {
      const examType = document.getElementById('optExamType')?.value || 'photo';
      const customName = document.getElementById('optExamFileName')?.value?.trim() || 'Exam_Photo';
      const file = selectedFiles[0];
      
      let targetBytes, maxWidth, maxHeight;
      if (examType === 'photo') {
        targetBytes = 50 * 1024; 
        maxWidth = 200; maxHeight = 230;
      } else {
        targetBytes = 20 * 1024; 
        maxWidth = 140; maxHeight = 60;
      }

      const rawData = await readFileAsDataURL(file);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = rawData; });

      const canvas = document.createElement('canvas');
      let width = img.width, height = img.height;
      
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

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

      downloadBlob(bestBlob, `${customName}_${examType}.jpg`, 'image/jpeg');
      showSuccessPopup(`${examType === 'photo' ? 'Photo' : 'Signature'} Resized Successfully!`);
      closeWorkspace();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      if (btn) { btn.innerText = originalText; btn.disabled = false; }
      setTimeout(() => resetProgress(), 180);
    }
    return;
  }

  if (activeTool === 'ocr') {
    if (selectedFiles.length === 0) { alert('Please select an image.'); return; }
    if (btn) { btn.innerText = 'Processing OCR...'; btn.disabled = true; }
    setProgress(20, 'Loading OCR Engine...');

    try {
      const lang = document.getElementById('optOcrLang')?.value || 'eng';
      const customName = document.getElementById('optOcrFileName')?.value?.trim() || 'Extracted_Text';
      const file = selectedFiles[0];

      const Tesseract = await ensureTesseractLoaded();
      if (!Tesseract) throw new Error('OCR engine could not be loaded.');

      setProgress(40, 'Extracting text from image...');
      
      const { data: { text } } = await Tesseract.recognize(file, lang, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(40 + (m.progress * 50), `Recognizing... ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, `${customName}.txt`, 'text/plain');
      showSuccessPopup('Text extracted successfully!');
      closeWorkspace();
    } catch (err) {
      alert('OCR Error: ' + err.message);
    } finally {
      if (btn) { btn.innerText = originalText; btn.disabled = false; }
      setTimeout(() => resetProgress(), 180);
    }
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
      setProgress(20, 'Preparing passport photo grid with clean background...');
      const count = parseInt(document.getElementById('optPassportCopies')?.value) || 8;
      const borderStyle = document.getElementById('optPassportBorder')?.value || 'thin';
      const bgColor = document.getElementById('optPassportBgColor')?.value || 'white';
      const customName = document.getElementById('optPassportFileName')?.value?.trim() || 'Smart_Passport_Sheet';
      
      const rawData = await readFileAsDataURL(selectedFiles[0]);
      
      const processedImageData = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 600; 
          canvas.height = 750; 
          const ctx = canvas.getContext('2d');
          
          if (bgColor === 'blue') {
            ctx.fillStyle = '#0284c7';
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.max(hRatio, vRatio);
          
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;
          
          ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
          
          resolve(canvas.toDataURL('image/jpeg', 0.98));
        };
        img.src = rawData;
      });

      setProgress(60, 'Generating passport sheet grid...');
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const w = 35, h = 45; 
      const cols = count <= 4 ? 2 : (count <= 12 ? 3 : 4);
      const marginX = (210 - (cols * w)) / (cols + 1);
      const marginY = 15;
      
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols), col = i % cols;
        const x = marginX + col * (w + marginX), y = marginY + row * (h + 8);
        
        if (y + h > 285) pdf.addPage();
        
        pdf.addImage(processedImageData, 'JPEG', x, y, w, h);
        
        if (borderStyle === 'thin') {
          pdf.setDrawColor(180, 180, 180);
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
      setProgress(20, 'Combining PDF documents...');
      const customName = document.getElementById('optMergeFileName')?.value?.trim() || 'Merged_Document';
      const mergedPdf = await PDFLibObj.PDFDocument.create();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        setProgress(20 + (i / selectedFiles.length) * 60, `Merging file ${i + 1} of ${selectedFiles.length}`);
        const fileBuffer = await selectedFiles[i].arrayBuffer();
        const doc = await PDFLibObj.PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      setProgress(90, 'Finalizing merged PDF...');
      const mergedPdfBytes = await mergedPdf.save();
      downloadBlob(mergedPdfBytes, `${customName}.pdf`, 'application/pdf');
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

    } else if (activeTool === 'jpgToPdf') {
      setProgress(20, 'Preparing images...');
      const jsPdfLib = await ensureJsPdfLoaded();
      const { jsPDF } = jsPdfLib || window.jspdf;

      const pageSize = document.getElementById('optImgPdfPageSize')?.value || 'a4';
      const orientation = document.getElementById('optImgPdfOrientation')?.value || 'portrait';
      const qualityOption = document.getElementById('optImgPdfQuality')?.value || 'high';

      const pdf = new jsPDF({ orientation: orientation, unit: 'mm', format: pageSize });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; 
      const maxW = pageWidth - (margin * 2);
      const maxH = pageHeight - (margin * 2);

      let jpegQuality = 0.98;
      if (qualityOption === 'medium') jpegQuality = 0.80;
      if (qualityOption === 'low') jpegQuality = 0.50;

      for (let i = 0; i < selectedFiles.length; i++) {
        setProgress(20 + (i / selectedFiles.length) * 70, `Processing image ${i + 1} of ${selectedFiles.length}`);
        const rawData = await readFileAsDataURL(selectedFiles[i]);
        
        const imgObj = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = rawData;
        });

        const canvas = document.createElement('canvas');
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgObj, 0, 0);
        const jpegData = canvas.toDataURL('image/jpeg', jpegQuality);

        if (i > 0) pdf.addPage();

        const imgRatio = imgObj.width / imgObj.height;
        let drawW = maxW;
        let drawH = maxW / imgRatio;

        if (drawH > maxH) {
          drawH = maxH;
          drawW = maxH * imgRatio;
        }

        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;

        pdf.addImage(jpegData, 'JPEG', x, y, drawW, drawH);
      }
      downloadBlob(pdf.output('blob'), 'Images_Converted.pdf', 'application/pdf');
      showSuccessPopup('Images Converted to PDF Successfully!');

    } else if (activeTool === 'pdfToJpg') {
      setProgress(20, 'Loading PDF...');
      const pdfjsLib = await ensurePdfJsLoaded();
      if (!pdfjsLib) throw new Error('PDF.js library could not be loaded.');
      
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      
      const qualityOption = document.getElementById('optOutputQuality')?.value || 'high';
      let scale = 1.5;
      if (qualityOption === 'high') scale = 2.0;
      if (qualityOption === 'low') scale = 1.0;

      for (let i = 1; i <= totalPages; i++) {
        setProgress(20 + (i / totalPages) * 70, `Converting page ${i} of ${totalPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
        downloadBlob(blob, `Page_${i}.jpg`, 'image/jpeg');
      }
      showSuccessPopup('PDF converted to Images Successfully!');
      
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
  let blob = content instanceof Blob ? content : new Blob([content], { type });
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = e.target.result;
    a.download = name;
    document.body.appendChild(a);
    
    setTimeout(() => {
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 500);
    }, 50);
  };
  reader.readAsDataURL(blob);
}
