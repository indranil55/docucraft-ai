/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   Clean URL (No .html) + Center Floating Card HUD
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;

// 1. Center Floating AI Card Injector & Controller (Mobile & Laptop Display)
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
    modal.style.border = '1.5px solid rgba(59, 130, 246, 0.4)';
    modal.style.borderRadius = '24px';
    modal.style.padding = '24px 28px';
    modal.style.boxShadow = '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.35)';
    modal.style.width = '90%';
    modal.style.maxWidth = '460px';
    modal.style.textAlign = 'center';
    modal.style.color = '#fff';
    modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    modal.innerHTML = `
      <div style="display: flex; justify-content: center; margin-bottom: 14px;">
        <div id="aiOrb" style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); animation: aiPulse 2s infinite ease-in-out;"></div>
      </div>
      <div id="aiUserText" style="font-size: 13px; color: #94a3b8; margin-bottom: 8px; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>
      <div id="aiToolHeader" style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-bottom: 10px;"></div>
      <div id="aiReplyText" style="font-size: 14.5px; line-height: 1.5; color: #f1f5f9; font-weight: 400;"></div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        50% { transform: scale(1.12); box-shadow: 0 0 32px rgba(236, 72, 153, 0.8); }
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

// 2. Comprehensive Tool Catalog with Clean URLs (All .html removed)
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "scanner", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত"], url: "merge-pdf" },
  { name: "Split PDF", keywords: ["split", "separate", "tukde", "katna", "ভাগ", "কাটা", "splitter"], url: "split-pdf" },
  { name: "Compress PDF", keywords: ["compress", "reduce size", "chota karna", "সাইজ কমানো", "কম্প্রেস"], url: "compress-pdf" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "स्कैनर", "স্ক্যানার"], url: "pdf-scanner" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip converter", "জিপ"], url: "zip-to-pdf" },
  { name: "Repair PDF", keywords: ["repair", "fix", "theek karna", "মেরামত", "corrupt"], url: "repair-pdf" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "pages sequence", "সাজানো"], url: "organize-pdf" },
  { name: "Rotate PDF", keywords: ["rotate", "ghumaana", "ঘোরানো"], url: "rotate-pdf" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "hatao", "বাদ দেওয়া", "মুছে ফেলা"], url: "delete-pdf" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "फोटो से पीडीएफ", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "word converter"], url: "word-to-pdf" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], url: "excel-to-pdf" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], url: "powerpoint-to-pdf" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], url: "html-to-pdf" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], url: "pdf-to-jpg" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html", url: "pdf-to-word" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], url: "pdf-to-text" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "এডিট"], url: "edit-pdf" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই"], url: "sign-pdf" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ"], url: "watermark-pdf" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], url: "protect-pdf" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "আনলক"], url: "unlock-pdf" },
  { name: "Add Page Numbers", keywords: ["page numbers", "page number", "पेज नंबर", "পেজ নম্বর"], url: "add-page-numbers" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার"], url: "photo-resizer" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি"], url: "passport-photo" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "हिसाब", "ক্যালকুলেটর"], url: "calculator" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], url: "loan-emi" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "जीएसटी", "জিএসটি"], url: "gst-calculator" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], url: "sip-calculator" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "interest calculator", "ब्याज", "সুদ"], url: "interest-calculator" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], url: "fd-rd-calculator" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "jewellery", "सोना", "সোনার দাম"], url: "gold-calculator" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation", "महंगाई", "মুদ্রাস্ফীতি"], url: "inflation-calculator" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf", "পিপিএফ"], url: "ppf-calculator" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "electric bill", "बिजली बिल", "বিদ্যুৎ বিল"], url: "electricity-calculator" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], url: "fuel-calculator" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], url: "salary-calculator" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], url: "bill-split" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "छूट", "ছাড়"], url: "discount-calculator" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "प्रतिशत", "শতকরা", "শতাংশ"], url: "percentage-calculator" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], url: "number-to-words" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], url: "land-converter" },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ", "अनुवाद", "dokocraft translator", "docucraft translator"], url: "translator" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "बोलकर लिखना", "ভয়েস টাইপিং"], url: "voice-typing" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "नोटपैड", "নোটপ্যাড", "নোটবুক"], url: "notepad" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "सरकारी नौकरी", "চাকরি"], url: "job-alerts" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "उम्र", "বয়স ক্যালকুলেটর"], url: "age-calculator" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], url: "exam-eligibility" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "daily calorie", "ক্যালোরি"], url: "calorie-calculator" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "पानी খাওয়ার लक्ष्य"], url: "water-intake" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব"], url: "sleep-calculator" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "বারকোড"], url: "barcode-generator" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder", "base64 decoder"], url: "base64" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "universal converter", "একক রূপান্তর"], url: "unit-converter" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], url: "duplicate-remover" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], url: "text-reverse" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], url: "marks-calculator" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], url: "grade-calculator" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "बिल जनरेटर", "বিল মেকার"], url: "invoice-generator" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "बायोडाटा", "রিজিউমে"], url: "resume-maker" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], url: "prescription-maker" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], url: "contact" }
];

// 3. Load Available Voices
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// 4. Multi-Device Voice Output
function speakResponseInNativeLanguage(text, langCode = 'en-US', onComplete) {
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
    const target = (langCode || 'en').toLowerCase().split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(target)
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

// 5. Native Greeting
function playIndranilGreeting(userLangCode = 'en-US', onComplete) {
  const lang = (userLangCode || 'en').toLowerCase().split('-')[0];
  let greeting = "Hello, I am Indranil. How can I help you?";

  if (lang === 'bn') {
    greeting = "হ্যালো, আমি ইন্দ্রনীল। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
  } else if (lang === 'hi') {
    greeting = "नमस्ते, मैं इंद्रनील हूँ। मैं आपकी क्या मदद कर सकता हूँ?";
  }

  showCenterAICard('', greeting, 'Indranil AI');
  speakResponseInNativeLanguage(greeting, userLangCode, onComplete);
}

// Language Detector
function detectLanguage(text) {
  if (!text) return 'en-US';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 6. Smart Matching & Direct Visual HUD Navigation
function scrollToMatchedTool(query) {
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

    // Exact Match Priority
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

  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a'));
  let matchedCard = null;

  if (bestMatchedItem && maxScore >= 50) {
    const targetClean = bestMatchedItem.url.toLowerCase();
    matchedCard = cards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      return href.includes(targetClean);
    });
  }

  if (bestMatchedItem && maxScore >= 50) {
    let msg = `Opening ${bestMatchedItem.name}...`;
    if (lang === 'bn-IN') msg = `${bestMatchedItem.name} খোলা হচ্ছে...`;
    else if (lang === 'hi-IN') msg = `${bestMatchedItem.name} खोला जा रहा है...`;

    // মোবাইল বা ল্যাপটপের ঠিক মাঝখানে কার্ডটি ভেসে উঠবে
    showCenterAICard(raw, msg, bestMatchedItem.name);

    if (matchedCard) {
      matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      matchedCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      matchedCard.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.9)';
      matchedCard.style.transform = 'scale(1.05)';
    }

    speakResponseInNativeLanguage(msg, lang, () => {
      setTimeout(() => {
        hideCenterAICard();
        const dest = bestMatchedItem.url;
        if (dest && dest !== '#' && !dest.startsWith('javascript:')) {
          window.location.href = dest;
        }
      }, 500);
    });
  } else {
    let notFound = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    if (lang === 'bn-IN') notFound = "দুঃখিত, এই টুলটি বুঝতে পারিনি। দয়া করে টুলের নাম স্পষ্ট করে বলুন।";
    else if (lang === 'hi-IN') notFound = "माफ़ कीजिए, यह टूल नहीं मिला। कृपया टूल का नाम साफ़ बोलें।";
    
    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakResponseInNativeLanguage(notFound, lang);
  }
}

// 7. Global Voice Input
function toggleVoiceInput(inputElementId = 'toolSearchInput', callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const micBtn = document.getElementById('voiceSearchBtn');
  const statusElem = document.getElementById('voice-status');

  if (isListening && globalRecognition) {
    shouldRestart = false;
    globalRecognition.stop();
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    hideCenterAICard();
    return;
  }

  shouldRestart = false;
  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;

  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

  playIndranilGreeting(userPreferredLang, () => {
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

      if (inputField) {
        inputField.value = cleanTranscript;
      }

      scrollToMatchedTool(cleanTranscript);

      if (typeof callback === 'function') {
        callback(cleanTranscript);
      }
    }
  };

  globalRecognition.onerror = function(event) {
    console.warn("Speech Recognition notice/error:", event.error);
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

// 8. Safe URL Validator (CodeQL Whitelist)
function isSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === '#') return false;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// 9. Tool Usage Tracker
function trackToolUsage(toolName, toolUrl) {
  if (!isSafeUrl(toolUrl)) return;

  let recent = JSON.parse(localStorage.getItem('docucraft_recent_tools') || '[]');
  recent = recent.filter(t => t.name !== toolName);
  recent.unshift({ name: String(toolName).slice(0, 80), url: toolUrl });
  if (recent.length > 4) recent.pop();
  localStorage.setItem('docucraft_recent_tools', JSON.stringify(recent));
  renderRecentTools();
}

function renderRecentTools() {
  const container = document.getElementById('recentToolsSection');
  const grid = document.getElementById('recentToolsGrid');
  if (!container || !grid) return;

  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem('docucraft_recent_tools') || '[]');
  } catch (e) {
    recent = [];
  }

  if (!Array.isArray(recent) || recent.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  grid.replaceChildren();

  recent.forEach(tool => {
    if (!isSafeUrl(tool.url)) return;

    const link = document.createElement('a');
    link.setAttribute('href', tool.url);
    link.className = 'recent-chip';
    link.style.display = 'flex';
    link.style.alignItems = 'center';
    link.style.gap = '8px';
    link.style.padding = '10px 14px';
    link.style.background = 'rgba(255,255,255,0.06)';
    link.style.border = '1px solid rgba(255,255,255,0.1)';
    link.style.borderRadius = '12px';
    link.style.textDecoration = 'none';
    link.style.color = '#fff';
    link.style.fontSize = '13px';
    link.style.transition = 'all 0.2s ease';

    const iconSpan = document.createElement('span');
    iconSpan.textContent = '⚡ ';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = tool.name || 'Tool';

    link.appendChild(iconSpan);
    link.appendChild(titleSpan);
    grid.appendChild(link);
  });
}

function clearRecentTools() {
  localStorage.removeItem('docucraft_recent_tools');
  renderRecentTools();
}

document.addEventListener('DOMContentLoaded', () => {
  renderRecentTools();

  document.querySelectorAll('a, .tool-card, .popular-card').forEach(link => {
    link.addEventListener('click', function() {
      const toolName = this.querySelector('h3, h4, .tool-title')?.innerText || this.innerText.split('\n')[0];
      const rawUrl = this.getAttribute('href') || (this.querySelector('a') ? this.querySelector('a').getAttribute('href') : null);
      if (toolName && rawUrl && isSafeUrl(rawUrl)) {
        trackToolUsage(toolName.trim(), rawUrl);
      }
    });
  });
});
