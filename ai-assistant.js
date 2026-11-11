/* =========================================================
   DocuCraft AI - Instant Voice Match & Direct Tool Opener
   Universal Mobile & Desktop Browser Compatibility (.html Added)
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

// Mobile Audio Auto-Unlock
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

// 4. Safe URL Validator (Allowing verified HTML page destinations)
function isSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === '#') return false;

  if (/^[a-zA-Z0-9_-]+\.html$/i.test(trimmed)) {
    return true;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// 5. Complete Knowledge Base with .html Added to All Files
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "pdf merge", "merge pdf", "পিডিএফ জোড়া", "যুক্ত", "combine"], file: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "split pdf", "ভাগ", "কাটা", "স্প্লিট", "separate"], file: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "compress pdf", "কম্প্রেস", "সাইজ কমানো", "reduce"], file: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "স্ক্যানার", "স্ক্যান", "pdf scanner"], file: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip", "জিপ"], file: "zip-to-pdf.html" },
  { name: "Repair PDF", keywords: ["repair", "fix", "মেরামত", "corrupt"], file: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "সাজানো"], file: "organize-pdf.html" },
  { name: "Rotate PDF", keywords: ["rotate", "ঘোরানো"], file: "rotate-pdf.html" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "বাদ দেওয়া"], file: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "ছবি থেকে পিডিএফ"], file: "jpg-to-pdf.html" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "ওয়ার্ড টু পিডিএফ"], file: "word-to-pdf.html" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "এক্সেল টু পিডিএফ"], file: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "পাওয়ারপয়েন্ট"], file: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], file: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "পিডিএফ থেকে ছবি"], file: "pdf-to-jpg.html" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], file: "pdf-to-word.html" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], file: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], file: "pdf-to-text.html" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "এডিট"], file: "edit-pdf.html" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "সই"], file: "sign-pdf.html" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ"], file: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], file: "protect-pdf.html" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "আনলক"], file: "unlock-pdf.html" },
  { name: "Add Page Numbers", keywords: ["page numbers", "পেজ নম্বর"], file: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "রিসাইজার", "ছবি রিসাইজ"], file: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "চাকরির ছবি"], file: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "পাসপোর্ট ছবি"], file: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "ডিজিটাল সই"], file: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], file: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "কালার পিকার"], file: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "থাম্বনেইল"], file: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "ক্যালকুলেটর", "হিসাব", "calculate"], file: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "কিস্তি", "লোন"], file: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "প্রিপেমেন্ট"], file: "loan-prepayment.html" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "জিএসটি"], file: "gst-calculator.html" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], file: "sip-calculator.html" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "সুদ"], file: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "এফডি"], file: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "সোনার দাম"], file: "gold-calculator.html" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation", "মুদ্রাস্ফীতি"], file: "inflation-calculator.html" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf", "পিপিএফ"], file: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "বিদ্যুৎ বিল"], file: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "তেল খরচ"], file: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "বেতন", "স্যালারি"], file: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "tip calculator", "বিল ভাগ"], file: "bill-split.html" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "ছাড়"], file: "discount-calculator.html" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "শতকরা", "শতাংশ"], file: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], file: "number-to-words.html" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], file: "land-converter.html" },

  // Utilities & Productivity Tools
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ", "dokocraft translator"], file: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], file: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "টেক্সট টু স্পিচ"], file: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "নোটপ্যাড"], file: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], file: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], file: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], file: "exam-eligibility.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট", "typing text"], file: "typing-test.html" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "ক্যালোরি"], file: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "জল"], file: "water-intake.html" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle", "ঘুম"], file: "sleep-calculator.html" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "বারকোড"], file: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder"], file: "base64.html" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "পাসওয়ার্ড জেনারেটর"], file: "password-generator.html" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "একক রূপান্তর"], file: "unit-converter.html" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], file: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], file: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], file: "marks-calculator.html" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], file: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "বিল"], file: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "রিজিউমে", "সিভি"], file: "resume-maker.html" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], file: "prescription-maker.html" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], file: "contact.html" }
];

// 6. Match and Directly Open the HTML Page
function openRequestedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();

  const cleanQuery = raw
    .replace(/(open|show|find|go to|launch|please|tool|bring|give me|calculate|start|চালু করো|খুলুন|খোল|দেখাও|দাও|আমাকে|হিসাব)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    if (cleanQuery && nameLower === cleanQuery) score += 200;
    else if (cleanQuery && nameLower.includes(cleanQuery)) score += 90;

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

  if (bestMatchedItem && maxScore >= 50) {
    const replyMsg = `Opening ${bestMatchedItem.name}...`;

    showCenterAICard(raw, replyMsg, bestMatchedItem.name);

    // কথা শেষ হওয়ার সাথে সাথেই সরাসরি .html পেজটি ওপেন হবে
    speakText(replyMsg, 'en-US', () => {
      setTimeout(() => {
        hideCenterAICard();
        if (isSafeUrl(bestMatchedItem.file)) {
          window.location.href = bestMatchedItem.file; // Redirect to file.html
        }
      }, 300);
    });

  } else {
    const notFound = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakText(notFound, 'en-US', () => {
      setTimeout(hideCenterAICard, 2500);
    });
  }
}

// 7. Voice Recognition Handler
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

  const greeting = "Which tool would you like to open?";
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
