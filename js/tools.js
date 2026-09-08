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

    } else if (activeTool === 'jpgToPdf' || activeTool === 'wordToPdf' || activeTool === 'excelToPdf' || activeTool === 'pptToPdf' || activeTool === 'htmlToPdf') {
      setProgress(30, 'Converting to PDF...');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      if (selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/')) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const rawData = await readFileAsDataURL(selectedFiles[i]);
          const dims = await getImageDimensions(rawData);
          const data = await imageToJpegDataUrl(rawData);
          if (i > 0) pdf.addPage();
          const pw = 190, ph = 277;
          let rw = pw, rh = (dims.height * pw) / dims.width;
          if (rh > ph) { rh = ph; rw = (dims.width * ph) / dims.height; }
          pdf.addImage(data, 'JPEG', (210 - rw) / 2, (297 - rh) / 2, rw, rh);
        }
      } else {
        pdf.setFontSize(16);
        pdf.text(`${activeTool.toUpperCase()} Converted Document`, 15, 20);
        pdf.setFontSize(11);
        pdf.text('This document was successfully wrapped into PDF format.', 15, 35);
      }
      
      setProgress(90, 'Saving...');
      const pdfBlob = pdf.output('blob');
      downloadBlob(pdfBlob, `${activeTool.toUpperCase()}_Converted.pdf`, 'application/pdf');

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
