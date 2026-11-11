/* =========================================================
   DocuCraft AI - Instant Voice Match & Guaranteed Opener
   Universal Mobile & Desktop Browser Compatibility
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let audioUnlocked = false;

// 1. Center Floating AI Card HUD
function showCenterAICard(userQuery, aiReply, toolName = '') {
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
    modal.style.border = '1.5px solid rgba(59, 130, 246, 0.5)';
    modal.style.borderRadius = '24px';
    modal.style.padding = '22px 26px';
    modal.style.boxShadow = '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.4)';
    modal.style.width = '88%';
    modal.style.maxWidth = '420px';
    modal.style.textAlign = 'center';
    modal.style.color = '#fff';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    modal.innerHTML = `
      <div style="display: flex; justify-content: center; margin-bottom: 12px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); animation: aiPulse 2s infinite ease-in-out;"></div>
      </div>
      <div id="aiUserText" style="font-size: 13px; color: #94a3b8; margin-bottom: 6px; font-style: italic;"></div>
      <div id="aiToolHeader" style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;"></div>
      <div id="aiReplyText" style="font-size: 14.5px; line-height: 1.5; color: #f1f5f9;"></div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        50% { transform: scale(1.1); box-shadow: 0 0 32px rgba(236, 72, 153, 0.8); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  const userElem = document.getElementById('aiUserText');
  const toolElem = document.getElementById('aiToolHeader');
  const replyElem = document.getElementById('aiReplyText');

  if (userQuery) userElem.innerText = `“${userQuery}”`;
  toolElem.innerText = toolName || "DocuCraft AI";
  replyElem.innerText = aiReply;

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

// 2. Global Voice Engine Loader
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

function unlockAudioEngine() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if ('speechSynthesis' in window) {
    const silent = new SpeechSynthesisUtterance('');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
    loadSystemVoices();
  }
}
document.addEventListener('click', unlockAudioEngine, { once: true });
document.addEventListener('touchstart', unlockAudioEngine, { once: true });

function speakText(text, langCode = 'en-US', onComplete) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetPrefix = (langCode || 'en').toLowerCase().split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(targetPrefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  let hasExecuted = false;
  const finish = () => {
    if (!hasExecuted) {
      hasExecuted = true;
      if (typeof onComplete === 'function') onComplete();
    }
  };

  utterance.onend = finish;
  utterance.onerror = finish;
  
  // Safety timeout fallback to ensure page opens even if speech stalls
  setTimeout(finish, 1500);

  window.speechSynthesis.speak(utterance);
}

// 3. Knowledge Base Catalog
const siteKnowledgeBase = [
  // Speed Tests & Network
  { name: "Internet Speed Test", keywords: ["internet speed", "speed test", "net speed", "wifi speed", "network speed"], file: "speed-test.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "typing speed", "type test"], file: "typing-test.html" },

  // PDF & Document Tools
  { name: "Merge PDF", keywords: ["merge", "pdf merge", "merge pdf", "combine pdf"], file: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "split pdf", "separate pdf", "cut pdf"], file: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "compress pdf", "reduce pdf", "shrink pdf"], file: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "pdf scanner", "document scanner"], file: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip", "zip converter"], file: "zip-to-pdf.html" },
  { name: "Repair PDF", keywords: ["repair", "repair pdf", "fix pdf", "corrupt pdf"], file: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "sort pages", "rearrange"], file: "organize-pdf.html" },
  { name: "Rotate PDF", keywords: ["rotate", "rotate pdf", "turn pages"], file: "rotate-pdf.html" },
  { name: "Delete PDF Pages", keywords: ["delete pages", "remove pages", "delete pdf pages"], file: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf"], file: "jpg-to-pdf.html" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "doc to pdf"], file: "word-to-pdf.html" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], file: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "slides to pdf"], file: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], file: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], file: "pdf-to-jpg.html" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], file: "pdf-to-word.html" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], file: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text"], file: "pdf-to-text.html" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "modify pdf"], file: "edit-pdf.html" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "digital signature"], file: "sign-pdf.html" },
  { name: "Watermark PDF", keywords: ["watermark", "watermark pdf"], file: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock pdf", "password pdf"], file: "protect-pdf.html" },
  { name: "Unlock PDF", keywords: ["unlock", "unlock pdf", "remove password"], file: "unlock-pdf.html" },
  { name: "Add Page Numbers", keywords: ["page numbers", "add page numbers", "numbering"], file: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "photo resizer", "sign resizer", "kb resizer", "mb resizer"], file: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "exam resizer"], file: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "passport size photo", "photo sheet"], file: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "signature maker"], file: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "upi qr", "qr generator"], file: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code"], file: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail"], file: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "calculate"], file: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan"], file: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], file: "loan-prepayment.html" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "tax calculator"], file: "gst-calculator.html" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund"], file: "sip-calculator.html" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "interest calculator"], file: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "fixed deposit"], file: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "jewellery price"], file: "gold-calculator.html" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation"], file: "inflation-calculator.html" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf"], file: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "electric bill"], file: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "petrol cost", "fuel"], file: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "in hand salary", "salary"], file: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "tip calculator", "split bill"], file: "bill-split.html" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "discount", "sale"], file: "discount-calculator.html" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "percent"], file: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "words converter"], file: "number-to-words.html" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "acre"], file: "land-converter.html" },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation"], file: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text"], file: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts"], file: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "text notepad"], file: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "job notifications"], file: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "dob calculator"], file: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "eligibility"], file: "exam-eligibility.html" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "daily calorie"], file: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "daily water"], file: "water-intake.html" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle"], file: "sleep-calculator.html" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "code 128"], file: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder", "base64 decoder"], file: "base64.html" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "random password"], file: "password-generator.html" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "universal converter", "convert units"], file: "unit-converter.html" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], file: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "reverse text"], file: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], file: "marks-calculator.html" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], file: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "invoice maker"], file: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "resume builder"], file: "resume-maker.html" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "rx maker"], file: "prescription-maker.html" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "support desk"], file: "contact.html" }
];

// 4. Safe Direct Open Execution
function openRequestedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();

  // Strip operational filler phrases
  const cleanQuery = raw
    .replace(/(open|show|find|go to|launch|please|tool|bring|give me|calculate|start)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    // Exact name match
    if (cleanQuery && nameLower === cleanQuery) score += 200;
    else if (cleanQuery && nameLower.includes(cleanQuery)) score += 90;

    // Keyword match
    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (cleanQuery === kwLower) score += 150;
      else if (raw.includes(kwLower)) score += 80;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  if (bestMatchedItem && maxScore >= 80) {
    const replyMsg = `Opening ${bestMatchedItem.name}...`;
    showCenterAICard(raw, replyMsg, bestMatchedItem.name);

    // Reliable redirect using absolute path resolver
    const targetFile = bestMatchedItem.file;
    const targetUrl = new URL(targetFile, window.location.href).href;

    speakText(replyMsg, 'en-US', () => {
      window.location.assign(targetUrl);
    });

    // Fallback timer (redirects automatically if audio gets delayed)
    setTimeout(() => {
      window.location.assign(targetUrl);
    }, 1200);

  } else {
    const notFound = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakText(notFound, 'en-US', () => {
      setTimeout(hideCenterAICard, 2500);
    });
  }
}

// 5. Voice Recognition Handler
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported. Please use Google Chrome.");
    return;
  }

  unlockAudioEngine();

  const micBtn = document.getElementById('voiceSearchBtn');
  const statusElem = document.getElementById('voice-status');

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    hideCenterAICard();
    return;
  }

  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;
  globalRecognition.lang = 'en-US';

  const greeting = "Which tool would you like to open?";
  showCenterAICard('', greeting, 'Indranil AI');
  speakText(greeting, 'en-US', () => {
    try {
      globalRecognition.start();
    } catch (e) {
      console.warn("Speech recognition start notice:", e);
    }
  });

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
      if (inputField) inputField.value = cleanTranscript;

      openRequestedTool(cleanTranscript);
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
}

function startVoice() {
  toggleVoiceInput('toolSearchInput');
}
