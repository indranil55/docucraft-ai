/* =========================================================
   DocuCraft AI - Instant Visual Tool Focus & Center HUD
   Responsive Across All Global Mobile & Laptop Devices
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let audioUnlocked = false;

// 1. Center Floating AI Card HUD (Mobile & Desktop)
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
        transform: scale(1.06) !important;
        box-shadow: 0 0 35px rgba(59, 130, 246, 0.95), 0 0 15px rgba(139, 92, 246, 0.8) !important;
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

// Mobile Audio Auto-Unlock on first touch
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

// 3. Multi-Device Voice Output
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

// Language Detector
function detectLanguage(text) {
  if (!text) return 'en-US';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 4. Knowledge Base with Keywords & Target Identifiers
const siteKnowledgeBase = [
  { name: "Merge PDF", keywords: ["merge", "pdf merge", "merge pdf", "মার্জ", "পিডিএফ জোড়া", "যুক্ত"], slug: "merge-pdf" },
  { name: "Split PDF", keywords: ["split", "split pdf", "ভাগ", "কাটা", "স্প্লিট"], slug: "split-pdf" },
  { name: "Compress PDF", keywords: ["compress", "compress pdf", "কম্প্রেস", "সাইজ কমানো"], slug: "compress-pdf" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "স্ক্যানার", "স্ক্যান"], slug: "pdf-scanner" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip", "জিপ"], slug: "zip-to-pdf" },
  { name: "Repair PDF", keywords: ["repair", "fix", "মেরামত", "corrupt"], slug: "repair-pdf" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "সাজানো"], slug: "organize-pdf" },
  { name: "Rotate PDF", keywords: ["rotate", "ঘোরানো"], slug: "rotate-pdf" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "বাদ দেওয়া"], slug: "delete-pdf" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "ছবি থেকে পিডিএফ"], slug: "jpg-to-pdf" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "ওয়ার্ড টু পিডিএফ"], slug: "word-to-pdf" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "এক্সেল টু পিডিএফ"], slug: "excel-to-pdf" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "পাওয়ারপয়েন্ট"], slug: "powerpoint-to-pdf" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], slug: "html-to-pdf" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "পিডিএফ থেকে ছবি"], slug: "pdf-to-jpg" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], slug: "pdf-to-word" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], slug: "pdf-to-excel" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], slug: "pdf-to-text" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "এডিট"], slug: "edit-pdf" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "সই"], slug: "sign-pdf" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ"], slug: "watermark-pdf" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], slug: "protect-pdf" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "আনলক"], slug: "unlock-pdf" },
  { name: "Add Page Numbers", keywords: ["page numbers", "পেজ নম্বর"], slug: "add-page-numbers" },
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "রিসাইজার", "ছবি রিসাইজ"], slug: "photo-resizer" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "চাকরির ছবি"], slug: "exam-resizer" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "পাসপোর্ট ছবি"], slug: "passport-photo" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "ডিজিটাল সই"], slug: "signature-maker" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], slug: "qr-generator" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "কালার পিকার"], slug: "color-picker" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "থাম্বনেইল"], slug: "youtube-thumbnail" },
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "ক্যালকুলেটর", "হিসাব", "calculate"], slug: "calculator" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "কিস্তি", "লোন"], slug: "loan-emi" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "প্রিপেমেন্ট"], slug: "loan-prepayment" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "জিএসটি"], slug: "gst-calculator" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], slug: "sip-calculator" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "সুদ"], slug: "interest-calculator" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "এফডি"], slug: "fd-rd-calculator" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "সোনার দাম"], slug: "gold-calculator" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation", "মুদ্রাস্ফীতি"], slug: "inflation-calculator" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf", "পিপিএফ"], slug: "ppf-calculator" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "বিদ্যুৎ বিল"], slug: "electricity-calculator" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "তেল খরচ"], slug: "fuel-calculator" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "বেতন", "স্যালারি"], slug: "salary-calculator" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "tip calculator", "বিল ভাগ"], slug: "bill-split" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "ছাড়"], slug: "discount-calculator" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "শতকরা", "শতাংশ"], slug: "percentage-calculator" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], slug: "number-to-words" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], slug: "land-converter" },
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ", "dokocraft translator"], slug: "translator" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], slug: "voice-typing" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "টেক্সট টু স্পিচ"], slug: "text-to-speech" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "নোটপ্যাড"], slug: "notepad" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], slug: "job-alerts" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], slug: "age-calculator" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], slug: "exam-eligibility" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "টাইপিং টেস্ট"], slug: "typing-test" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "ক্যালোরি"], slug: "calorie-calculator" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "জল"], slug: "water-intake" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle", "ঘুম"], slug: "sleep-calculator" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "বারকোড"], slug: "barcode-generator" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder"], slug: "base64" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "পাসওয়ার্ড জেনারেটর"], slug: "password-generator" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "একক রূপান্তর"], slug: "unit-converter" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], slug: "duplicate-remover" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], slug: "text-reverse" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], slug: "marks-calculator" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], slug: "grade-calculator" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "বিল"], slug: "invoice-generator" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "রিজিউমে", "সিভি"], slug: "resume-maker" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], slug: "prescription-maker" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], slug: "contact" }
];

// 5. Intelligent Match and Bring Directly in Front of Screen
function bringToolToFrontOfScreen(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  const cleanQuery = raw
    .replace(/(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও|দাও|আমাকে|হিসাব)/gi, ' ')
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

  // পেজে থাকা সমস্ত কার্ড সার্চ করা
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

  // পূর্বের হাইলাইট মুছে ফেলা
  document.querySelectorAll('.ai-focused-card').forEach(el => el.classList.remove('ai-focused-card'));

  if (targetCard && bestMatchedItem) {
    // ১. কার্ডটিকে স্ক্রিনের ঠিক মাঝখানে স্ক্রোল করে আনা
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetCard.classList.add('ai-focused-card');

    let replyMsg = `Here is your ${bestMatchedItem.name}.`;
    if (lang === 'bn-IN') replyMsg = `এই যে আপনার ${bestMatchedItem.name}, স্ক্রিনের সামনে আনা হয়েছে।`;
    else if (lang === 'hi-IN') replyMsg = `यह रहा आपका ${bestMatchedItem.name}, स्क्रीन के सामने आ गया है।`;

    // ২. সেন্টারে AI কার্ড দেখানো
    showCenterAICard(raw, replyMsg, bestMatchedItem.name);
    speakText(replyMsg, lang, () => {
      setTimeout(hideCenterAICard, 2500);
    });

    // ৫ সেকেন্ড পর হাইলাইট আস্তে আস্তে স্বাভাবিক হয়ে যাবে
    setTimeout(() => {
      targetCard.classList.remove('ai-focused-card');
    }, 5000);

  } else {
    let notFound = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    if (lang === 'bn-IN') notFound = "দুঃখিত, এই টুলটি বুঝতে পারিনি। দয়া করে টুলের নাম স্পষ্ট করে বলুন।";
    else if (lang === 'hi-IN') notFound = "माफ़ कीजिए, यह टूल नहीं मिला। कृपया टूल का नाम साफ़ बोलें।";

    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakText(notFound, lang, () => {
      setTimeout(hideCenterAICard, 3000);
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

  const userLang = navigator.language || 'en-US';
  globalRecognition.lang = userLang;

  const greeting = userLang.startsWith('bn') ? "বলুন, কোন টুলটি আপনার সামনে আনব?" : "Which tool would you like to open?";
  showCenterAICard('', greeting, 'Indranil AI');
  speakText(greeting, userLang, () => {
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
