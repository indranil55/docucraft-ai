/* =========================================================
   DocuCraft AI - Complete Productivity & Tools Assistant
   All-in-One JavaScript: Voice Search, Greeting & Navigation
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let currentUtterance = null;
let autoRedirectTimer = null;

// 1. System Voices Loader
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// 2. Dynamic Date & Time Speech Greeting
function getWelcomeGreeting() {
  const now = new Date();
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  // Date ordinal suffix (1st, 2nd, 3rd, 11th, etc.)
  const suffix = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  };

  // 12-hour formatted time with AM/PM
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const timeString = `${hours}:${minutes} ${ampm}`;
  return `Welcome to DocuCraft AI. Today is ${dayName}, ${monthName} ${date}${suffix(date)}, ${year}, and the current time is ${timeString}. Have a productive day.`;
}

// 3. Center Floating AI Card UI (Responsive on Mobile & Desktop)
function showCenterAICard(userQuery, aiReply, toolName = '', targetUrl = '') {
  let modal = document.getElementById('aiCenterModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'aiCenterModal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
    modal.style.zIndex = '999999';
    modal.style.background = 'rgba(15, 23, 42, 0.95)';
    modal.style.backdropFilter = 'blur(16px)';
    modal.style.border = '1.5px solid rgba(59, 130, 246, 0.4)';
    modal.style.borderRadius = '24px';
    modal.style.padding = '24px 28px';
    modal.style.boxShadow = '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.35)';
    modal.style.width = '90%';
    modal.style.maxWidth = '480px';
    modal.style.textAlign = 'center';
    modal.style.color = '#fff';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    modal.style.opacity = '0';
    modal.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    modal.innerHTML = `
      <div style="display: flex; justify-content: center; margin-bottom: 12px;">
        <div id="aiOrb" style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); animation: aiPulse 1.8s infinite ease-in-out;"></div>
      </div>
      <div id="aiUserText" style="font-size: 13px; color: #94a3b8; margin-bottom: 6px; font-style: italic;"></div>
      <div id="aiToolHeader" style="font-size: 19px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;"></div>
      <div id="aiReplyText" style="font-size: 14.5px; line-height: 1.5; color: #f1f5f9; margin-bottom: 16px;"></div>
      <div id="aiActionBtnContainer"></div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(236, 72, 153, 0.8); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  const userElem = document.getElementById('aiUserText');
  const toolElem = document.getElementById('aiToolHeader');
  const replyElem = document.getElementById('aiReplyText');
  const btnContainer = document.getElementById('aiActionBtnContainer');

  if (userQuery) userElem.innerText = `“${userQuery}”`;
  toolElem.innerText = toolName || "DocuCraft AI";
  replyElem.innerText = aiReply;

  if (targetUrl) {
    btnContainer.innerHTML = `
      <a href="${targetUrl}" style="display: inline-block; padding: 10px 22px; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; text-decoration: none; border-radius: 20px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">
        Open Tool Now →
      </a>
    `;
  } else {
    btnContainer.innerHTML = '';
  }

  modal.style.opacity = '1';
  modal.style.transform = 'translate(-50%, -50%) scale(1)';
}

function hideCenterAICard() {
  const modal = document.getElementById('aiCenterModal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
  }
}

// 4. Multi-Device Speech Function
function speakAndDisplay(userQuery, text, langCode = 'en-US', toolName = '', targetUrl = '') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (targetUrl) window.location.href = targetUrl;
    return;
  }

  window.speechSynthesis.cancel();
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);

  showCenterAICard(userQuery, text, toolName, targetUrl);

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 1.0;
  currentUtterance.pitch = 1.0;
  currentUtterance.lang = langCode;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchedVoice = voices.find(v => v.lang.startsWith('en'));
    if (matchedVoice) {
      currentUtterance.voice = matchedVoice;
    }
  }

  // Voice শেষ হওয়ার পর অটো রিডাইরেক্ট (যদি targetUrl থাকে)
  currentUtterance.onend = function() {
    if (targetUrl) {
      autoRedirectTimer = setTimeout(() => {
        hideCenterAICard();
        window.location.href = targetUrl;
      }, 700);
    }
  };

  currentUtterance.onerror = function() {
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  window.speechSynthesis.speak(currentUtterance);
}

// 5. Complete Tool Knowledge Base
const siteKnowledgeBase = [
  // --- Document & PDF Tools ---
  {
    name: "Merge PDF",
    category: "all",
    desc: "Combine multiple PDF documents into a single unified file.",
    keywords: ["merge", "scanner", "merger", "combine", "join pdf", "merge pdf"],
    url: "merge-pdf.html"
  },
  {
    name: "Split PDF",
    category: "all",
    desc: "Extract and separate specific pages from your PDF file.",
    keywords: ["split", "separate", "split pdf", "extract pages", "cut pdf"],
    url: "split-pdf.html"
  },
  {
    name: "Compress PDF",
    category: "all",
    desc: "Reduce PDF file size while keeping high quality.",
    keywords: ["compress", "compress pdf", "reduce size", "shrink pdf", "reduce file size"],
    url: "compress-pdf.html"
  },
  {
    name: "PDF Scanner & Enhancer",
    category: "all",
    desc: "Scan and sharpen document photos into clear PDF files.",
    keywords: ["scanner", "scan", "enhance", "pdf scanner", "scan document"],
    url: "pdf-scanner.html"
  },
  {
    name: "ZIP to PDF Converter",
    category: "all",
    desc: "Convert ZIP archives directly into PDF files.",
    keywords: ["zip to pdf", "zip converter", "archive to pdf"],
    url: "zip-to-pdf.html"
  },
  {
    name: "Repair PDF",
    category: "all",
    desc: "Repair damaged or corrupted PDF documents.",
    keywords: ["repair", "fix", "repair pdf", "restore pdf", "damaged pdf"],
    url: "repair-pdf.html"
  },
  {
    name: "Organize / Reorder Pages",
    category: "all",
    desc: "Reorder and sort PDF pages quickly and easily.",
    keywords: ["organize", "reorder", "sort pages", "rearrange pdf"],
    url: "organize-pdf.html"
  },
  {
    name: "Rotate PDF",
    category: "all",
    desc: "Rotate inverted or landscape PDF pages to correct orientation.",
    keywords: ["rotate", "rotate pdf", "turn pdf", "orientation"],
    url: "rotate-pdf.html"
  },
  {
    name: "Delete PDF Pages",
    category: "all",
    desc: "Permanently remove unwanted pages from your PDF.",
    keywords: ["delete", "remove pages", "delete pdf pages", "drop pages"],
    url: "delete-pdf.html"
  },
  {
    name: "JPG / PNG to PDF",
    category: "all",
    desc: "Convert image files into high quality PDF documents.",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf"],
    url: "jpg-to-pdf.html"
  },
  {
    name: "Word to PDF",
    category: "all",
    desc: "Convert Microsoft Word documents directly into PDF format.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf"],
    url: "word-to-pdf.html"
  },
  {
    name: "Excel to PDF",
    category: "all",
    desc: "Convert Excel spreadsheets into printable PDF files.",
    keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf", "sheet to pdf"],
    url: "excel-to-pdf.html"
  },
  {
    name: "PowerPoint to PDF",
    category: "all",
    desc: "Convert presentation slides into PDF documents.",
    keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides to pdf"],
    url: "powerpoint-to-pdf.html"
  },
  {
    name: "HTML to PDF Converter",
    category: "all",
    desc: "Convert HTML codes and web pages directly to PDF format.",
    keywords: ["html to pdf", "web to pdf", "website to pdf"],
    url: "html-to-pdf.html"
  },
  {
    name: "PDF to JPG / PNG",
    category: "all",
    desc: "Extract and convert PDF pages into high resolution images.",
    keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"],
    url: "pdf-to-jpg.html"
  },
  {
    name: "PDF to Word",
    category: "all",
    desc: "Convert PDF documents into editable Word format.",
    keywords: ["pdf to word", "pdf to docx", "pdf to doc"],
    url: "pdf-to-word.html"
  },
  {
    name: "PDF to Excel",
    category: "all",
    desc: "Extract tables from PDF files into editable spreadsheets.",
    keywords: ["pdf to excel", "pdf to xlsx", "table to excel"],
    url: "pdf-to-excel.html"
  },
  {
    name: "PDF to Text (OCR Extractor)",
    category: "utility",
    desc: "Extract editable text from scanned documents and images.",
    keywords: ["ocr", "pdf to text", "extract text", "optical character recognition"],
    url: "pdf-to-text.html"
  },
  {
    name: "Edit PDF",
    category: "all",
    desc: "Annotate, draw, and write text directly on PDF files.",
    keywords: ["edit pdf", "write on pdf", "modify pdf", "annotate pdf"],
    url: "edit-pdf.html"
  },
  {
    name: "Sign PDF",
    category: "all",
    desc: "Place secure electronic and digital signatures onto PDF files.",
    keywords: ["sign pdf", "signature on pdf", "digital signature pdf"],
    url: "sign-pdf.html"
  },
  {
    name: "Watermark PDF",
    category: "all",
    desc: "Protect your documents with custom text or image watermarks.",
    keywords: ["watermark", "watermark pdf", "add watermark"],
    url: "watermark-pdf.html"
  },
  {
    name: "Protect / Lock PDF",
    category: "all",
    desc: "Secure PDF files with strong password encryption.",
    keywords: ["protect", "lock", "password", "lock pdf", "protect pdf"],
    url: "protect-pdf.html"
  },
  {
    name: "Unlock PDF",
    category: "all",
    desc: "Remove passwords and security restrictions from PDF files.",
    keywords: ["unlock", "remove password", "unlock pdf"],
    url: "unlock-pdf.html"
  },
  {
    name: "Add Page Numbers",
    category: "all",
    desc: "Add customized page numbering headers or footers to PDFs.",
    keywords: ["page numbers", "page number", "add page numbers"],
    url: "add-page-numbers.html"
  },

  // --- Cyber & Photo Tools ---
  {
    name: "Photo & Sign KB / MB Resizer",
    category: "utility",
    desc: "Resize photo and signature files to exact KB limits for forms.",
    keywords: ["resizer", "photo resizer", "sign resizer", "kb resizer", "mb resizer"],
    url: "photo-resizer.html"
  },
  {
    name: "Exam Photo & Signature Resizer",
    category: "utility",
    desc: "Pre-set dimensions and KB limits for official exam applications.",
    keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"],
    url: "exam-resizer.html"
  },
  {
    name: "Passport Photo Sheet Maker",
    category: "utility",
    desc: "Generate printable multi-grid passport photos in standard formats.",
    keywords: ["passport photo", "passport sheet", "photo grid"],
    url: "passport-photo.html"
  },
  {
    name: "Digital Signature Maker (Sign Pad)",
    category: "utility",
    desc: "Draw digital signatures and download transparent PNG images.",
    keywords: ["digital signature", "sign pad", "draw sign", "signature maker"],
    url: "signature-maker.html"
  },
  {
    name: "QR Code & UPI Generator",
    category: "utility",
    desc: "Create customized QR codes for UPI payments, Wi-Fi, and web links.",
    keywords: ["qr code", "qr", "upi qr", "qr generator"],
    url: "qr-generator.html"
  },
  {
    name: "Color Picker & HEX Extractor",
    category: "utility",
    desc: "Pick colors and extract exact HEX and RGB color values.",
    keywords: ["color picker", "hex extractor", "color code", "rgb picker"],
    url: "color-picker.html"
  },
  {
    name: "YouTube Thumbnail Downloader",
    category: "utility",
    desc: "Download full HD thumbnails from any YouTube video URL.",
    keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "download thumbnail"],
    url: "youtube-thumbnail.html"
  },

  // --- Finance & Calculator Tools ---
  {
    name: "DocuCraft AI Scientific Calculator",
    category: "finance",
    desc: "Full-featured scientific calculator for advanced mathematics and trigonometry.",
    keywords: ["scientific calculator", "calculator", "math", "calculator open", "open calculator"],
    url: "calculator.html"
  },
  {
    name: "Loan EMI Calculator",
    category: "finance",
    desc: "Calculate monthly installments, interest rates, and loan breakdowns.",
    keywords: ["loan emi", "emi calculator", "loan", "monthly emi", "loan calculator"],
    url: "loan-emi.html"
  },
  {
    name: "Loan Prepayment & Interest Saver",
    category: "finance",
    desc: "Calculate interest savings and reduced tenure with prepayments.",
    keywords: ["prepayment", "interest saver", "loan prepayment"],
    url: "loan-prepayment.html"
  },
  {
    name: "GST Calculator",
    category: "finance",
    desc: "Quickly calculate inclusive and exclusive GST amounts.",
    keywords: ["gst calculator", "gst", "tax calculator", "gst rate"],
    url: "gst-calculator.html"
  },
  {
    name: "SIP Calculator",
    category: "finance",
    desc: "Calculate returns on monthly mutual fund investments over time.",
    keywords: ["sip calculator", "sip", "mutual fund", "investment calculator"],
    url: "sip-calculator.html"
  },
  {
    name: "Simple & Compound Interest",
    category: "finance",
    desc: "Calculate simple and compounding interest over specified terms.",
    keywords: ["simple interest", "compound interest", "interest calculator"],
    url: "interest-calculator.html"
  },
  {
    name: "FD & RD Maturity Calculator",
    category: "finance",
    desc: "Calculate maturity amounts and interest returns for FD and RD schemes.",
    keywords: ["fd calculator", "rd calculator", "fixed deposit"],
    url: "fd-rd-calculator.html"
  },
  {
    name: "Gold & Jewellery Price Calculator",
    category: "finance",
    desc: "Calculate final jewelry cost with making charges and taxes included.",
    keywords: ["gold calculator", "gold price", "jewellery calculator"],
    url: "gold-calculator.html"
  },
  {
    name: "Inflation Calculator",
    category: "finance",
    desc: "Calculate future and historical purchasing power based on inflation.",
    keywords: ["inflation calculator", "inflation", "money power"],
    url: "inflation-calculator.html"
  },
  {
    name: "PPF Calculator",
    category: "finance",
    desc: "Calculate 15-year maturity returns for Public Provident Fund.",
    keywords: ["ppf calculator", "ppf", "provident fund"],
    url: "ppf-calculator.html"
  },
  {
    name: "Electricity Bill & Power Calculator",
    category: "finance",
    desc: "Calculate power consumption units and estimate monthly electricity bills.",
    keywords: ["electricity bill", "power calculator", "electric bill", "power units"],
    url: "electricity-calculator.html"
  },
  {
    name: "Fuel Cost & Trip Mileage Calculator",
    category: "finance",
    desc: "Estimate total fuel cost and trip mileage for petrol or diesel cars.",
    keywords: ["fuel cost", "mileage calculator", "petrol cost", "trip cost"],
    url: "fuel-calculator.html"
  },
  {
    name: "Take-Home Salary & CTC Calculator",
    category: "finance",
    desc: "Calculate in-hand net salary from annual CTC after deductions.",
    keywords: ["salary calculator", "ctc calculator", "in hand salary", "take home salary"],
    url: "salary-calculator.html"
  },
  {
    name: "Friend Bill Split & Tip Calculator",
    category: "finance",
    desc: "Evenly split restaurant and trip bills among friends with tips.",
    keywords: ["bill split", "split bill", "tip calculator"],
    url: "bill-split.html"
  },
  {
    name: "Discount & Sale Calculator",
    category: "finance",
    desc: "Calculate final sale price and total savings after percentage discounts.",
    keywords: ["discount calculator", "sale calculator", "savings calculator"],
    url: "discount-calculator.html"
  },
  {
    name: "Percentage Calculator",
    category: "finance",
    desc: "Quickly compute percentage increase, decrease, and differences.",
    keywords: ["percentage calculator", "percentage", "percent calculation"],
    url: "percentage-calculator.html"
  },
  {
    name: "Number to Words (Cheque Amount)",
    category: "finance",
    desc: "Convert numbers into formal written English words for bank cheques.",
    keywords: ["number to words", "cheque amount", "words converter"],
    url: "number-to-words.html"
  },
  {
    name: "Land Area Converter",
    category: "finance",
    desc: "Convert land units including bigha, katha, acre, and square feet.",
    keywords: ["land area converter", "land converter", "bigha", "katha", "acre to sqft"],
    url: "land-converter.html"
  },

  // --- Utilities & Productivity Tools ---
  {
    name: "DocuCraft AI Translator",
    category: "utility",
    desc: "Translate sentences and documents across multiple international languages.",
    keywords: ["translator", "translate", "translation", "translator open", "open translator"],
    url: "translator.html"
  },
  {
    name: "Pitch to Text (Voice Typing)",
    category: "utility",
    desc: "Convert live speech into accurate text directly on screen.",
    keywords: ["pitch to text", "voice typing", "speech to text"],
    url: "voice-typing.html"
  },
  {
    name: "Text-to-Speech Converter",
    category: "utility",
    desc: "Convert written text into natural spoken voice audio.",
    keywords: ["text to speech", "tts", "speak text"],
    url: "text-to-speech.html"
  },
  {
    name: "Unlimited Text Notepad",
    category: "utility",
    desc: "Clean, fast browser notepad to draft and save text notes.",
    keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "open notepad"],
    url: "notepad.html"
  },
  {
    name: "Govt Job Alerts & Results",
    category: "utility",
    desc: "Track the latest government job vacancies, tests, and results.",
    keywords: ["govt job", "job alert", "sarkari result", "job notifications"],
    url: "job-alerts.html"
  },
  {
    name: "Age Calculator (Exam DOB)",
    category: "utility",
    desc: "Calculate exact age in years, months, and days from date of birth.",
    keywords: ["age calculator", "calculate age", "dob calculator"],
    url: "age-calculator.html"
  },
  {
    name: "Exam Age Eligibility Checker",
    category: "utility",
    desc: "Check if you qualify for government exams based on age criteria.",
    keywords: ["age eligibility", "eligibility checker", "exam criteria"],
    url: "exam-eligibility.html"
  },
  {
    name: "1-Minute Typing Speed Test",
    category: "utility",
    desc: "Measure your typing speed (WPM) and accuracy in a 60-second test.",
    keywords: ["typing speed test", "typing test", "speed test", "typing text", "typing test open", "typing text open"],
    url: "typing-test.html"
  },
  {
    name: "Daily Calorie & BMR Calculator",
    category: "utility",
    desc: "Calculate Basal Metabolic Rate and daily maintenance calories.",
    keywords: ["calorie calculator", "bmr calculator", "daily calorie"],
    url: "calorie-calculator.html"
  },
  {
    name: "Daily Water Intake Goal",
    category: "utility",
    desc: "Calculate optimal daily water hydration based on your body weight.",
    keywords: ["water intake", "water goal", "hydration tracker"],
    url: "water-intake.html"
  },
  {
    name: "Sleep Calculator",
    category: "utility",
    desc: "Calculate healthy sleep cycles to wake up feeling fresh.",
    keywords: ["sleep calculator", "sleep cycle", "wake up time"],
    url: "sleep-calculator.html"
  },
  {
    name: "Barcode Generator (Code 128)",
    category: "utility",
    desc: "Generate and download custom Code 128 barcodes for products.",
    keywords: ["barcode generator", "barcode", "create barcode"],
    url: "barcode-generator.html"
  },
  {
    name: "Base64 Encoder & Decoder",
    category: "utility",
    desc: "Encode and decode raw strings and binary files to Base64 format.",
    keywords: ["base64", "base64 encoder", "base64 decoder"],
    url: "base64.html"
  },
  {
    name: "Random Password & PIN Generator",
    category: "utility",
    desc: "Generate random, high-security passwords and custom numeric PINs.",
    keywords: ["password generator", "pin generator", "random password"],
    url: "password-generator.html"
  },
  {
    name: "Universal Unit Converter",
    category: "utility",
    desc: "Convert standard measurement units across length, weight, and volume.",
    keywords: ["unit converter", "universal converter", "measurements"],
    url: "unit-converter.html"
  },
  {
    name: "Duplicate Line Remover",
    category: "utility",
    desc: "Remove repeated and duplicate lines from blocks of text.",
    keywords: ["duplicate line remover", "remove duplicates"],
    url: "duplicate-remover.html"
  },
  {
    name: "Text Reverse & Flip Tool",
    category: "utility",
    desc: "Reverse text and flip words upside down.",
    keywords: ["text reverse", "flip text", "reverse words"],
    url: "text-reverse.html"
  },
  {
    name: "Marks to Percentage & CGPA",
    category: "utility",
    desc: "Convert test marks into exact percentages and CGPA grades.",
    keywords: ["marks to percentage", "cgpa calculator", "cgpa"],
    url: "marks-calculator.html"
  },
  {
    name: "Average & Grade Calculator",
    category: "utility",
    desc: "Calculate weighted grade averages and final letter scores.",
    keywords: ["average calculator", "grade calculator"],
    url: "grade-calculator.html"
  },
  {
    name: "Invoice / Bill Generator",
    category: "finance",
    desc: "Generate professional printable invoices with automated tax calculation.",
    keywords: ["invoice generator", "bill generator", "create invoice"],
    url: "invoice-generator.html"
  },
  {
    name: "Resume / CV Maker to PDF",
    category: "utility",
    desc: "Build modern professional resumes and export directly to PDF.",
    keywords: ["resume maker", "cv maker", "biodata", "cv builder"],
    url: "resume-maker.html"
  },
  {
    name: "Prescription / Memo Maker",
    category: "utility",
    desc: "Create clean digital doctor prescriptions and medical memos.",
    keywords: ["prescription maker", "memo maker", "doctor memo"],
    url: "prescription-maker.html"
  },
  {
    name: "Contact & Support Desk",
    category: "all",
    desc: "Reach out to the official customer support team for inquiries.",
    keywords: ["contact", "support", "help", "customer service"],
    url: "contact.html"
  }
];

// 6. Category Filtering Logic
window.filterCategory = function(category, element) {
  const allChips = document.querySelectorAll('.filter-chips-container .chip');
  allChips.forEach(chip => chip.classList.remove('active'));
  
  if (element) {
    element.classList.add('active');
  } else {
    allChips.forEach(chip => {
      const onclickAttr = chip.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${category}'`)) {
        chip.classList.add('active');
      }
    });
  }

  const cards = document.querySelectorAll('.tool-card, .popular-card');
  cards.forEach(card => {
    const cardCategory = (card.getAttribute('data-category') || card.className || '').toLowerCase();
    const cardTitle = (card.querySelector('h3, h4, .tool-title')?.innerText || card.innerText || '').toLowerCase();
    
    const matchedKB = siteKnowledgeBase.find(item => cardTitle.includes(item.name.toLowerCase()));
    const effectiveCategory = matchedKB ? matchedKB.category : cardCategory;

    if (category === 'all') {
      card.style.display = '';
    } else if (category === 'finance') {
      card.style.display = (effectiveCategory === 'finance' || cardCategory.includes('finance')) ? '' : 'none';
    } else if (category === 'utility') {
      card.style.display = (effectiveCategory === 'utility' || cardCategory.includes('utility')) ? '' : 'none';
    } else if (cardCategory.includes(category.toLowerCase())) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
};

// 7. Matching & Responding when User Speaks
function handleUserQuery(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();

  // Greeting trigger check (যদি ইউজার সময়, তারিখ বা গ্রিটিং জানতে চায়)
  if (
    raw.includes("welcome") || 
    raw.includes("time") || 
    raw.includes("date") || 
    raw.includes("today") || 
    raw.includes("hello") || 
    raw.includes("hi docucraft")
  ) {
    const greetingText = getWelcomeGreeting();
    speakAndDisplay(raw, greetingText, 'en-US', "DocuCraft AI", "");
    return;
  }

  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|please|tool)\s+/i, '')
    .trim();

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    if (cleanQuery === nameLower) score += 120;
    else if (nameLower.includes(cleanQuery)) score += 80;
    else if (cleanQuery.includes(nameLower)) score += 60;

    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (cleanQuery === kwLower) score += 100;
      else if (cleanQuery.includes(kwLower)) score += 70;
      else if (kwLower.includes(cleanQuery)) score += 50;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  if (bestMatchedItem && maxScore >= 40) {
    const message = bestMatchedItem.desc;
    speakAndDisplay(raw, message, 'en-US', bestMatchedItem.name, bestMatchedItem.url);
  } else {
    const notFoundMsg = "Sorry, I could not find that specific tool. Please tell me what you need.";
    speakAndDisplay(raw, notFoundMsg, 'en-US', "DocuCraft AI", "");
  }
}

// 8. Microphone Input Handler
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const micBtn = document.getElementById('voiceSearchBtn');
  const statusElem = document.getElementById('voice-status');

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    hideCenterAICard();
    return;
  }

  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  hideCenterAICard();

  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;
  globalRecognition.lang = 'en-US';

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";
  };

  globalRecognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      const cleanTranscript = transcript.trim();
      const inputField = document.getElementById(inputElementId);
      if (inputField) {
        inputField.value = cleanTranscript;
      }
      handleUserQuery(cleanTranscript);
    }
  };

  globalRecognition.onerror = function() {
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
  };

  globalRecognition.onend = function() {
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
  };

  try {
    globalRecognition.start();
  } catch (err) {
    console.error("Start error:", err);
  }
}

// 9. Direct Seamless Card Navigation
function handleCardClick(element) {
  if (!element) return;

  let url = element.getAttribute('href') || element.querySelector('a')?.getAttribute('href') || '';

  if (!url || url === '#' || url.startsWith('javascript:')) {
    const titleElem = element.querySelector('h3, h4, .tool-title');
    const title = (titleElem ? titleElem.innerText : element.innerText.split('\n')[0] || '').trim();
    const match = siteKnowledgeBase.find(item => item.name.toLowerCase() === title.toLowerCase());
    if (match && match.url) {
      url = match.url;
    }
  }

  if (url && url !== '#' && !url.startsWith('javascript:')) {
    window.location.href = url;
  }
}

function startVoice() {
  toggleVoiceInput('toolSearchInput');
}

// 10. Delegated Click Listener for Tools and Cards
document.addEventListener('click', (e) => {
  const card = e.target.closest('.popular-card, .tool-card');
  if (card) {
    handleCardClick(card);
  }
});
