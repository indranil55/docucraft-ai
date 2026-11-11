/* =========================================================
   DocuCraft AI - Center Focus Voice Engine (No 404 Redirect)
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
      .ai-focused-card {
        transform: scale(1.05) !important;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.95), 0 0 15px rgba(139, 92, 246, 0.8) !important;
        border: 2px solid #38bdf8 !important;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        z-index: 9999 !important;
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

// 3. Multi-Device Voice Output Synthesizer
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

  utterance.onend = function() {
    if (typeof onComplete === 'function') onComplete();
  };
  utterance.onerror = function() {
    if (typeof onComplete === 'function') onComplete();
  };

  window.speechSynthesis.speak(utterance);
}

// 4. Complete Tool Catalog with Keywords and Target Slugs
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "pdf merge", "merge pdf", "combine pdf", "join pdf"], slug: "merge-pdf" },
  { name: "Split PDF", keywords: ["split", "split pdf", "separate pdf", "extract pages"], slug: "split-pdf" },
  { name: "Compress PDF", keywords: ["compress", "compress pdf", "reduce size", "shrink pdf"], slug: "compress-pdf" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "pdf scanner", "document scanner"], slug: "pdf-scanner" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip", "zip converter"], slug: "zip-to-pdf" },
  { name: "Repair PDF", keywords: ["repair", "fix", "repair pdf", "corrupt pdf fix"], slug: "repair-pdf" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "sort pages", "rearrange"], slug: "organize-pdf" },
  { name: "Rotate PDF", keywords: ["rotate", "rotate pdf", "turn pages"], slug: "rotate-pdf" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "delete pdf pages"], slug: "delete-pdf" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf"], slug: "jpg-to-pdf" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "doc to pdf"], slug: "word-to-pdf" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], slug: "excel-to-pdf" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "slides"], slug: "powerpoint-to-pdf" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], slug: "html-to-pdf" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to png"], slug: "pdf-to-jpg" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], slug: "pdf-to-word" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], slug: "pdf-to-excel" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "text extractor"], slug: "pdf-to-text" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "modify pdf"], slug: "edit-pdf" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "digital signature"], slug: "sign-pdf" },
  { name: "Watermark PDF", keywords: ["watermark", "watermark pdf"], slug: "watermark-pdf" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "lock pdf", "password pdf"], slug: "protect-pdf" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "unlock pdf"], slug: "unlock-pdf" },
  { name: "Add Page Numbers", keywords: ["page numbers", "page numbering", "add page numbers"], slug: "add-page-numbers" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer"], slug: "photo-resizer" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "exam form"], slug: "exam-resizer" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "passport size photo", "photo sheet"], slug: "passport-photo" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "signature maker"], slug: "signature-maker" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "qr generator"], slug: "qr-generator" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code"], slug: "color-picker" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail"], slug: "youtube-thumbnail" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "calculate"], slug: "calculator" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "installment"], slug: "loan-emi" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], slug: "loan-prepayment" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "tax calculator"], slug: "gst-calculator" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund"], slug: "sip-calculator" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "interest calculator"], slug: "interest-calculator" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "fixed deposit"], slug: "fd-rd-calculator" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "jewellery"], slug: "gold-calculator" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation"], slug: "inflation-calculator" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf"], slug: "ppf-calculator" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "electric bill"], slug: "electricity-calculator" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel"], slug: "fuel-calculator" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "in hand salary", "salary"], slug: "salary-calculator" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "tip calculator", "split bill"], slug: "bill-split" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "discount", "sale"], slug: "discount-calculator" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "percent"], slug: "percentage-calculator" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "words converter"], slug: "number-to-words" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "acre", "land measure"], slug: "land-converter" },

  // Utilities & Productivity Tools
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "docucraft translator"], slug: "translator" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "voice type"], slug: "voice-typing" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "speak text"], slug: "text-to-speech" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "text notepad", "notes"], slug: "notepad" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "job notifications"], slug: "job-alerts" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "age"], slug: "age-calculator" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "eligibility"], slug: "exam-eligibility" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "speed test", "typing speed", "typing text"], slug: "typing-test" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "daily calorie", "calorie"], slug: "calorie-calculator" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "daily water"], slug: "water-intake" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle", "sleep"], slug: "sleep-calculator" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "code 128"], slug: "barcode-generator" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder", "base64 decoder"], slug: "base64" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "random password"], slug: "password-generator" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "universal converter", "convert units"], slug: "unit-converter" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], slug: "duplicate-remover" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "reverse text"], slug: "text-reverse" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], slug: "marks-calculator" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], slug: "grade-calculator" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "invoice maker"], slug: "invoice-generator" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "resume builder"], slug: "resume-maker" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "rx maker"], slug: "prescription-maker" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "support desk"], slug: "contact" }
];

// 5. Intelligent Match & Bring to Center (Prevents 404 URL Redirects)
function bringToolToFrontOfScreen(query) {
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
      if (cleanQuery && cleanQuery === kwLower) score += 150;
      else if (raw.split(' ').includes(kwLower)) score += 100;
      else if (raw.includes(kwLower)) score += 50;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  const allCards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a'));
  let targetCard = null;

  if (bestMatchedItem && maxScore >= 50) {
    const slug = bestMatchedItem.slug.toLowerCase();
    targetCard = allCards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      const text = (c.innerText || '').toLowerCase();
      return href.includes(slug) || text.includes(bestMatchedItem.name.toLowerCase());
    });
  }

  // Remove existing highlight animations
  document.querySelectorAll('.ai-focused-card').forEach(el => el.classList.remove('ai-focused-card'));

  if (targetCard && bestMatchedItem) {
    // Scroll tool card smoothly directly into viewport center
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetCard.classList.add('ai-focused-card');

    const replyMsg = `Here is your ${bestMatchedItem.name}. Ready to use.`;

    showCenterAICard(raw, replyMsg, bestMatchedItem.name);
    speakText(replyMsg, 'en-US', () => {
      setTimeout(hideCenterAICard, 2500);
    });

    // Remove glow effect after 5 seconds
    setTimeout(() => {
      targetCard.classList.remove('ai-focused-card');
    }, 5000);

  } else {
    const notFound = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakText(notFound, 'en-US', () => {
      setTimeout(hideCenterAICard, 2500);
    });
  }
}

// 6. Voice Recognition Handler
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
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

  const greeting = "Which tool would you like to find?";
  showCenterAICard('', greeting, 'Indranil AI');
  speakText(greeting, 'en-US', () => {
    try {
      globalRecognition.start();
    } catch (e) {
      console.warn("Speech start notice:", e);
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

      // Bring tool directly in front of the screen (no page redirection)
      bringToolToFrontOfScreen(cleanTranscript);
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
