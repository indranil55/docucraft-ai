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
      <i class="fa-solid fa-list-check" style="color: #2563eb;"></i> Selected File(s):
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
      </div>`;
    }
    html += `</div>`;
  });
  html += `</div>`;
  listContainer.innerHTML = html;
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
  str.split(',').forEach(p =>
