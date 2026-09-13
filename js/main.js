// DocuCraft AI - Complete Tools Studio Logic & UI Handlers

function getToolDetails(key) {
  const map = {
    kbResizer: {
      title: 'Photo & Sign KB / MB Resizer',
      desc: 'Compress image precisely to exact target KB or MB (up to 500 MB).',
      dropText: 'Tap to select photo/signature',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Select Target Size & Unit:</label>
          <div style="display: flex; gap: 8px;">
            <select id="targetSizeVal" class="form-control">
              <option value="20">20 KB</option>
              <option value="50" selected>50 KB</option>
              <option value="100">100 KB</option>
              <option value="200">200 KB</option>
              <option value="500">500 KB (0.5 MB)</option>
              <option value="1024">1024 KB (1 MB)</option>
            </select>
            <select id="targetUnit" class="form-control" style="width: 100px;">
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Resized_Photo" placeholder="Enter file name">
        </div>
      `
    },
    passportGrid: {
      title: 'Passport Photo Sheet (Custom / Grid)',
      desc: 'Generate print-ready sheets of custom passport photo copies on a single A4 page.',
      dropText: 'Tap to select your passport photo',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Copies Count:</label>
          <select id="passportCopies" class="form-control">
            <option value="8">8 Copies</option>
            <option value="16" selected>16 Copies</option>
            <option value="32">32 Copies</option>
          </select>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Passport_Sheet" placeholder="Enter file name">
        </div>
      `
    },
    sigPad: {
      title: 'Digital Signature Maker (Sign Pad)',
      desc: 'Draw your signature on screen and download as transparent PNG for form uploads.',
      dropText: 'Tap to upload reference or sign below',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Signature Drawing Area:</label>
          <div style="border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; height: 140px; background: #0f172a; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-weight: 600; text-align: center;">
            Draw your signature here using finger/mouse
          </div>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="My_Signature" placeholder="Enter file name">
        </div>
      `
    },
    qrGen: {
      title: 'QR Code & UPI Generator',
      desc: 'Generate instant QR codes for payment links, UPI IDs, or website URLs.',
      dropText: 'Enter text or UPI link below',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Enter Text / URL / UPI ID:</label>
          <input type="text" id="qrText" class="form-control" placeholder="e.g. yourname@upi or https://docucraftai.website">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="My_QRCode" placeholder="Enter file name">
        </div>
      `
    },
    examResizer: {
      title: 'Exam Photo & Signature Resizer',
      desc: 'Resize photo and signature to exact size required for government exam forms (SSC, UPSC, NEET, etc.).',
      dropText: 'Tap to select photo/signature',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Select Exam Standard:</label>
          <select id="examType" class="form-control">
            <option value="ssc">SSC / UPSC (Photo: 20-50KB, Sign: 10-20KB)</option>
            <option value="neet">NEET / JEE Standard</option>
          </select>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Exam_Optimized" placeholder="Enter file name">
        </div>
      `
    },
    merge: {
      title: 'Merge PDF',
      desc: 'Combine multiple PDF documents into a single organized file in seconds.',
      dropText: 'Tap to select multiple PDF files',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Merged_Document" placeholder="Enter file name">
        </div>
      `
    },
    split: {
      title: 'Split PDF',
      desc: 'Separate one page or an entire set for easy conversion into independent PDF files.',
      dropText: 'Tap to select PDF file to split',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Split Range (e.g., 1-3):</label>
          <input type="text" id="splitRange" class="form-control" placeholder="e.g. 1-2">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Split_PDF" placeholder="Enter file name">
        </div>
      `
    },
    compress: {
      title: 'Compress PDF',
      desc: 'Reduce file size while optimizing for maximal visual and document quality.',
      dropText: 'Tap to select PDF file to compress',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Compression Level:</label>
          <select id="compLevel" class="form-control">
            <option value="recommended">Recommended Compression</option>
            <option value="extreme">Extreme Compression (Smallest size)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Compressed_PDF" placeholder="Enter file name">
        </div>
      `
    },
    organize: {
      title: 'Organize / Reorder Pages',
      desc: 'Rearrange, reverse, or reorder the page sequence of your PDF document.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Organized_PDF" placeholder="Enter file name">
        </div>
      `
    },
    rotate: {
      title: 'Rotate PDF',
      desc: 'Rotate upside-down or sideways pages by 90, 180, or 270 degrees.',
      dropText: 'Tap to select PDF to rotate',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Rotation Angle:</label>
          <select id="rotationAngle" class="form-control">
            <option value="90">90 Degrees Clockwise</option>
            <option value="180">180 Degrees</option>
            <option value="270">270 Degrees</option>
          </select>
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Rotated_PDF" placeholder="Enter file name">
        </div>
      `
    },
    removePages: {
      title: 'Delete PDF Pages',
      desc: 'Remove unwanted, defective, or blank pages from an existing PDF file.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Cleaned_PDF" placeholder="Enter file name">
        </div>
      `
    },
    jpgToPdf: {
      title: 'Image to PDF (JPG/PNG to PDF)',
      desc: 'Convert gallery pictures, screenshots, or document scans into a standard A4 PDF.',
      dropText: 'Tap to select image files',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Converted_PDF" placeholder="Enter file name">
        </div>
      `
    },
    wordToPdf: {
      title: 'Word to PDF (DOC/DOCX to PDF)',
      desc: 'Convert Microsoft Word documents to clean, standardized PDF format.',
      dropText: 'Tap to select Word file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Word_Converted" placeholder="Enter file name">
        </div>
      `
    },
    excelToPdf: {
      title: 'Excel to PDF (XLS/XLSX to PDF)',
      desc: 'Convert Excel spreadsheets and tables into formatted, printable PDF documents.',
      dropText: 'Tap to select Excel spreadsheet',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Excel_Converted" placeholder="Enter file name">
        </div>
      `
    },
    pptToPdf: {
      title: 'PowerPoint to PDF (PPT/PPTX to PDF)',
      desc: 'Transform slideshow decks and presentations into portable PDF files.',
      dropText: 'Tap to select Presentation file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Presentation_Converted" placeholder="Enter file name">
        </div>
      `
    },
    htmlToPdf: {
      title: 'HTML / Web to PDF',
      desc: 'Convert HTML text, markup, or web content into downloadable PDF pages.',
      dropText: 'Tap to select HTML file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Web_Converted" placeholder="Enter file name">
        </div>
      `
    },
    pdfToJpg: {
      title: 'PDF to Image (PDF to JPG/PNG)',
      desc: 'Extract all pages or individual visual graphics from a PDF into JPG images.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="PDF_Images" placeholder="Enter file name">
        </div>
      `
    },
    pdfToWord: {
      title: 'PDF to Word (PDF to DOCX)',
      desc: 'Convert PDF documents into editable Word files with intact textual layout.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Editable_Word" placeholder="Enter file name">
        </div>
      `
    },
    pdfToExcel: {
      title: 'PDF to Excel (PDF to XLSX)',
      desc: 'Extract tables, cell grids, and numerical sheets from PDF files into Excel.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Extracted_Excel" placeholder="Enter file name">
        </div>
      `
    },
    ocr: {
      title: 'OCR - Image to Text',
      desc: 'Extract text from any image (JPG, PNG) in Bengali, Hindi, or English.',
      dropText: 'Tap to select image for OCR',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Extracted_Text" placeholder="Enter file name">
        </div>
      `
    },
    editPdf: {
      title: 'Edit PDF',
      desc: 'Add text annotations, markings, or additional notes onto PDF documents.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Edited_PDF" placeholder="Enter file name">
        </div>
      `
    },
    sign: {
      title: 'Sign PDF',
      desc: 'Add handwritten digital signatures or formal verification stamps to your file.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Signed_PDF" placeholder="Enter file name">
        </div>
      `
    },
    watermark: {
      title: 'Watermark PDF',
      desc: 'Stamp customized text like \'CONFIDENTIAL\' or business logos across pages.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Watermark Text:</label>
          <input type="text" id="watermarkText" class="form-control" value="CONFIDENTIAL" placeholder="Watermark text">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Watermarked_PDF" placeholder="Enter file name">
        </div>
      `
    },
    protect: {
      title: 'Protect / Lock PDF',
      desc: 'Encrypt PDF files with a secret password to prevent unauthorized viewing.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Set Password:</label>
          <input type="password" id="pdfPassword" class="form-control" placeholder="Enter secret password">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Protected_PDF" placeholder="Enter file name">
        </div>
      `
    },
    unlock: {
      title: 'Unlock PDF',
      desc: 'Remove security permissions and password locks from locked documents.',
      dropText: 'Tap to select locked PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>PDF Password:</label>
          <input type="password" id="unlockPassword" class="form-control" placeholder="Enter PDF password">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Unlocked_PDF" placeholder="Enter file name">
        </div>
      `
    },
    pageNumbers: {
      title: 'Add Page Numbers',
      desc: 'Add standardized Page N of M stamps at the bottom center of each page.',
      dropText: 'Tap to select PDF file',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Numbered_PDF" placeholder="Enter file name">
        </div>
      `
    },
    invoiceMaker: {
      title: 'Invoice / Bill Generator',
      desc: 'Generate professional customer billing receipts, invoices, and service memos.',
      dropText: 'Tap or configure invoice details below',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Customer Name:</label>
          <input type="text" id="invoiceCustomer" class="form-control" placeholder="Enter customer name">
        </div>
        <div class="form-group">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Invoice_Receipt" placeholder="Enter file name">
        </div>
      `
    },
    resumeMaker: {
      title: 'Resume / CV Maker to PDF',
      desc: 'Build and format clean resumes or curriculum vitae ready for job applications.',
      dropText: 'Enter candidate details or upload',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="My_Resume" placeholder="Enter file name">
        </div>
      `
    },
    docMaker: {
      title: 'Prescription / Memo Maker',
      desc: 'Create clean digital prescriptions, diagnostic notes, or customer memos.',
      dropText: 'Enter details or upload template',
      customHTML: `
        <div class="form-group" style="margin-top: 12px;">
          <label>Save File Name:</label>
          <input type="text" id="saveFileName" class="form-control" value="Prescription_Memo" placeholder="Enter file name">
        </div>
      `
    }
  };

  return map[key] || {
    title: 'Document Tool Studio',
    desc: 'Process your files securely right inside your browser.',
    dropText: 'Tap to select file',
    customHTML: `
      <div class="form-group" style="margin-top: 12px;">
        <label>Save File Name:</label>
        <input type="text" id="saveFileName" class="form-control" value="Processed_Document" placeholder="Enter file name">
      </div>
    `
  };
}
