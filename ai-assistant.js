/* =========================================================
   DocuCraft AI - Smart Adaptive Multi-Language Voice Assistant
   Responsive Center Floating Card & Global Cross-Device Engine
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;
let hasPlayedInitialGreeting = false;
let audioContextUnlocked = false;

// 1. Safe URL Validator (Whitelist Protocol to fix GitHub CodeQL alerts)
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

// 2. Global Voice Engine Loader
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      availableVoices = voices;
    }
  }
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// Mobile Audio Auto-Unlock on first touch/click
function unlockAudioEngine() {
  if (audioContextUnlocked) return;
  audioContextUnlocked = true;

  if ('speechSynthesis' in window) {
    // Silent unlock utterance for Android and iOS Safari
    const silent = new SpeechSynthesisUtterance('');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
    loadSystemVoices();
  }

  playSiteInitialGreeting();
}

document.addEventListener('click', unlockAudioEngine, { once: true });
document.addEventListener('touchstart', unlockAudioEngine, { once: true });

// 3. Center Floating AI Card UI (Mobile & Laptop)
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

// 4. Multi-Device Voice Output
function speakText(text, langCode = 'en-US', onCompleteCallback) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
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
    if (typeof onCompleteCallback === 'function') {
      onCompleteCallback();
    }
  };

  utterance.onerror = function() {
    if (typeof onCompleteCallback === 'function') {
      onCompleteCallback();
    }
  };

  window.speechSynthesis.speak(utterance);
}

// 5. Initial Welcome Greeting in English
function playSiteInitialGreeting() {
  if (hasPlayedInitialGreeting) return;
  hasPlayedInitialGreeting = true;

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

  const greetingText = `Welcome to DocuCraft AI. Today is ${dayName}, ${monthName} ${date}, ${year}, and the current time is ${hours}:${minutesFormatted} ${ampm}. Have a productive day.`;

  speakText(greetingText, 'en-US');
}

// Microphone Assistant Introduction
function playIndranilGreeting(onDone) {
  const greeting = "I am Indranil. How can I help you?";
  showCenterAICard('', greeting, 'Indranil AI');
  speakText(greeting, 'en-US', onDone);
}

// Language Detection
function detectLanguage(text) {
  if (!text) return 'en-US';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 6. Complete Tool Catalog
const siteKnowledgeBase = [
  // Document & PDF Tools
  { 
    name: "Merge PDF", 
    desc_bn: "পিডিএফ মার্জার খোলা হচ্ছে। এখানে একাধিক পিডিএফ ফাইল জোড়া লাগাতে পারবেন।",
    desc_hi: "पीडीएफ मर्ज टूल खोला जा रहा है। यहाँ कई फाइलें जोड़ सकते हैं।",
    desc_en: "Opening Merge PDF. Combine multiple PDF documents into one.",
    keywords: ["merge", "pdf merge", "merge pdf", "মার্জ", "পিডিএফ জোড়া", "পিডিএফ মার্জ", "combine pdf"], 
    url: "merge-pdf.html" 
  },
  { 
    name: "Split PDF", 
    desc_bn: "পিডিএফ স্প্লিট টুল খোলা হচ্ছে। এখান থেকে নির্দিষ্ট পেজ আলাদা করতে পারবেন।",
    desc_hi: "पीडीएफ स्प्लिट टूल खोला जा रहा है।",
    desc_en: "Opening Split PDF. Extract and separate specific pages.",
    keywords: ["split", "split pdf", "পিডিএফ স্প্লিট", "ভাগ", "কাটা", "separate pdf"], 
    url: "split-pdf.html" 
  },
  { 
    name: "Compress PDF", 
    desc_bn: "পিডিএফ কম্প্রেসার খোলা হচ্ছে। কোয়ালিটি বজায় রেখে ফাইলের সাইজ কমাতে পারবেন।",
    desc_hi: "पीडीएफ कंप्रेस टूल खोला जा रहा है।",
    desc_en: "Opening Compress PDF to reduce document file size.",
    keywords: ["compress", "compress pdf", "কম্প্রেস", "পিডিএফ সাইজ কমানো", "reduce pdf"], 
    url: "compress-pdf.html" 
  },
  { 
    name: "PDF Scanner & Enhancer", 
    desc_bn: "পিডিএফ স্ক্যানার খোলা হচ্ছে। ডকুমেন্ট পরিষ্কার স্ক্যান করার জন্য এটি কাজ করবে।",
    desc_hi: "पीडीएफ स्कैनर खोला जा रहा है।",
    desc_en: "Opening PDF Scanner & Enhancer to scan and optimize documents.",
    keywords: ["scanner", "pdf scanner", "scan", "স্ক্যানার", "স্ক্যান", "document scanner"], 
    url: "pdf-scanner.html" 
  },
  { 
    name: "ZIP to PDF Converter", 
    desc_bn: "জিপ টু পিডিএফ কনভার্টার খোলা হচ্ছে।",
    desc_hi: "ज़िप टू पीडीएफ कनवर्टर खोला जा रहा है।",
    desc_en: "Opening ZIP to PDF Converter.",
    keywords: ["zip to pdf", "zip converter", "জিপ"], 
    url: "zip-to-pdf.html" 
  },
  { 
    name: "Repair PDF", 
    desc_bn: "পিডিএফ রিপেয়ার টুল খোলা হচ্ছে। ক্ষতিগ্রস্ত ফাইল ঠিক করতে এটি ব্যবহার করুন।",
    desc_hi: "पीडीएफ रिपेयर टूल खोला जा रहा है।",
    desc_en: "Opening Repair PDF to recover damaged documents.",
    keywords: ["repair pdf", "repair", "মেরামত", "রিপেয়ার"], 
    url: "repair-pdf.html" 
  },
  { 
    name: "Organize / Reorder Pages", 
    desc_bn: "পেজ অর্গানাইজার খোলা হচ্ছে। পেজগুলোর সিরিয়াল নিজের মতো সাজিয়ে নিন।",
    desc_hi: "पेज रीऑर्डर टूल खोला जा रहा है।",
    desc_en: "Opening Page Organizer to sort your document pages.",
    keywords: ["organize", "reorder", "pages sequence", "সাজানো"], 
    url: "organize-pdf.html" 
  },
  { 
    name: "Rotate PDF", 
    desc_bn: "রোটেট পিডিএফ খোলা হচ্ছে। উল্টো পেজ ঘুরিয়ে সোজা করুন।",
    desc_hi: "पीडीएफ रोटेट टूल खोला जा रहा है।",
    desc_en: "Opening Rotate PDF.",
    keywords: ["rotate", "rotate pdf", "ঘোরানো"], 
    url: "rotate-pdf.html" 
  },
  { 
    name: "Delete PDF Pages", 
    desc_bn: "ডিলিট পেজেস টুল খোলা হচ্ছে। অপ্রয়োজনীয় পেজ বাদ দিন।",
    desc_hi: "पीडीएफ पेज रिमूवर खोला जा रहा है।",
    desc_en: "Opening Delete PDF Pages.",
    keywords: ["delete pages", "remove pages", "বাদ দেওয়া"], 
    url: "delete-pdf.html" 
  },
  { 
    name: "JPG / PNG to PDF", 
    desc_bn: "ছবি থেকে পিডিএফ কনভার্টার খোলা হচ্ছে। ছবি সহজেই পিডিএফে রূপান্তর করুন।",
    desc_hi: "फोटो से पीडीएफ कनवर्टर खोला जा रहा है।",
    desc_en: "Opening Image to PDF converter.",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf", "ছবি থেকে পিডিএফ", "photo to pdf"], 
    url: "jpg-to-pdf.html" 
  },
  { 
    name: "Word to PDF", 
    desc_bn: "ওয়ার্ড টু পিডিএফ কনভার্টার খোলা হচ্ছে।",
    desc_hi: "वर्ड टू पीडीएफ कनवर्टर खोला जा रहा है।",
    desc_en: "Opening Word to PDF converter.",
    keywords: ["word to pdf", "docx to pdf", "ওয়ার্ড টু পিডিএফ"], 
    url: "word-to-pdf.html" 
  },
  { 
    name: "Excel to PDF", 
    desc_bn: "এক্সেল টু পিডিএফ কনভার্টার খোলা হচ্ছে।",
    desc_hi: "एक्सेल टू पीडीएफ कनवर्टर खोला जा रहा है।",
    desc_en: "Opening Excel to PDF converter.",
    keywords: ["excel to pdf", "xls to pdf", "এক্সেল টু পিডিএফ"], 
    url: "excel-to-pdf.html" 
  },
  { 
    name: "PowerPoint to PDF", 
    desc_bn: "পাওয়ারপয়েন্ট টু পিডিএফ খোলা হচ্ছে।",
    desc_hi: "पावरपॉइंट टू पीडीएफ खोला जा रहा है।",
    desc_en: "Opening PowerPoint to PDF converter.",
    keywords: ["powerpoint to pdf", "ppt to pdf", "পাওয়ারপয়েন্ট"], 
    url: "powerpoint-to-pdf.html" 
  },
  { 
    name: "HTML to PDF Converter", 
    desc_bn: "এইচটিএমএল টু পিডিএফ কনভার্টার খোলা হচ্ছে।",
    desc_hi: "वेबपेज टू पीडीएफ खोला जा रहा है।",
    desc_en: "Opening HTML to PDF converter.",
    keywords: ["html to pdf", "web to pdf"], 
    url: "html-to-pdf.html" 
  },
  { 
    name: "PDF to JPG / PNG", 
    desc_bn: "পিডিএফ টু ফটো কনভার্টার খোলা হচ্ছে।",
    desc_hi: "पीडीएफ टू फोटो कनवर्टर खोला जा रहा है।",
    desc_en: "Opening PDF to Image converter.",
    keywords: ["pdf to jpg", "pdf to image", "পিডিএফ থেকে ছবি"], 
    url: "pdf-to-jpg.html" 
  },
  { 
    name: "PDF to Word", 
    desc_bn: "পিডিএফ থেকে ওয়ার্ড কনভার্টার খোলা হচ্ছে।",
    desc_hi: "पीडीएफ से वर्ड कनवर्टर खोला जा रहा है।",
    desc_en: "Opening PDF to Word converter.",
    keywords: ["pdf to word", "pdf to docx"], 
    url: "pdf-to-word.html" 
  },
  { 
    name: "PDF to Excel", 
    desc_bn: "পিডিএফ টু এক্সেল কনভার্টার খোলা হচ্ছে।",
    desc_hi: "पीडीएफ टू एक्सेल खोला जा रहा है।",
    desc_en: "Opening PDF to Excel converter.",
    keywords: ["pdf to excel", "pdf to xlsx"], 
    url: "pdf-to-excel.html" 
  },
  { 
    name: "PDF to Text (OCR Extractor)", 
    desc_bn: "ওসিআর টেক্সট এক্সট্রাক্টর খোলা হচ্ছে। ডকুমেন্টের ভেতরের লেখা কপি করুন।",
    desc_hi: "ओसीआर टेक्स्ट एक्सट्रैक्टर खोला जा रहा है।",
    desc_en: "Opening OCR Extractor to retrieve text from files.",
    keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], 
    url: "pdf-to-text.html" 
  },
  { 
    name: "Edit PDF", 
    desc_bn: "পিডিএফ এডিটর খোলা হচ্ছে। পিডিএফে লেখা বা পরিবর্তন করুন।",
    desc_hi: "पीडीएफ एडिटर खोला जा रहा है।",
    desc_en: "Opening PDF Editor to add text and annotations.",
    keywords: ["edit pdf", "write on pdf", "এডিট"], 
    url: "edit-pdf.html" 
  },
  { 
    name: "Sign PDF", 
    desc_bn: "পিডিএফ সাইন টুল খোলা হচ্ছে। ডিজিটাল সই যুক্ত করুন।",
    desc_hi: "पीडीएफ साइन टूल खोला जा रहा है।",
    desc_en: "Opening Sign PDF tool to add digital signatures.",
    keywords: ["sign pdf", "signature on pdf", "সই", "সাইন"], 
    url: "sign-pdf.html" 
  },
  { 
    name: "Watermark PDF", 
    desc_bn: "ওয়াটারমার্ক টুল খোলা হচ্ছে। ডকুমেন্টে জলছাপ যুক্ত করুন।",
    desc_hi: "वॉटरमार्क टूल खोला जा रहा है।",
    desc_en: "Opening Watermark PDF.",
    keywords: ["watermark", "জলছাপ"], 
    url: "watermark-pdf.html" 
  },
  { 
    name: "Protect / Lock PDF", 
    desc_bn: "পিডিএফ লক টুল খোলা হচ্ছে। ফাইলে পাসওয়ার্ড সেট করুন।",
    desc_hi: "पीडीएफ लॉक टूल खोला जा रहा है।",
    desc_en: "Opening Protect PDF to encrypt your documents.",
    keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], 
    url: "protect-pdf.html" 
  },
  { 
    name: "Unlock PDF", 
    desc_bn: "আনলক পিডিএফ খোলা হচ্ছে। পাসওয়ার্ড রিমুভ করুন।",
    desc_hi: "पीडीएफ अनलॉक टूल खोला जा रहा है।",
    desc_en: "Opening Unlock PDF to remove password security.",
    keywords: ["unlock", "unlock pdf", "আনলক"], 
    url: "unlock-pdf.html" 
  },
  { 
    name: "Add Page Numbers", 
    desc_bn: "পেজ নম্বর টুল খোলা হচ্ছে। ফাইলে ক্রমিক নম্বর যুক্ত করুন।",
    desc_hi: "पेज नंबर टूल खोला जा रहा है।",
    desc_en: "Opening Add Page Numbers.",
    keywords: ["page numbers", "পেজ নম্বর"], 
    url: "add-page-numbers.html" 
  },

  // Cyber & Photo Tools
  { 
    name: "Photo & Sign KB / MB Resizer", 
    desc_bn: "ফটো ও সাইন রিসাইজার খোলা হচ্ছে। নির্দিষ্ট কেবি বা এমবি সাইজ করুন।",
    desc_hi: "फोटो और साइन रिसाइजर खोला जा रहा है।",
    desc_en: "Opening Photo and Signature Resizer to adjust file limits.",
    keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "রিসাইজার", "ছবি রিসাইজ"], 
    url: "photo-resizer.html" 
  },
  { 
    name: "Exam Photo & Signature Resizer", 
    desc_bn: "পরীক্ষার ফর্ম রিসাইজার খোলা হচ্ছে। সরকারি ফর্মের মাপ অনুযায়ী ছবি বানান।",
    desc_hi: "एग्जाम फॉर्म रिसाइजर खोला जा रहा है।",
    desc_en: "Opening Exam Photo Resizer for official application standards.",
    keywords: ["exam photo", "exam signature", "ssc", "upsc", "চাকরির ছবি"], 
    url: "exam-resizer.html" 
  },
  { 
    name: "Passport Photo Sheet Maker", 
    desc_bn: "পাসপোর্ট ফটো মেকার খোলা হচ্ছে। প্রিন্ট উপযোগী পাসপোর্ট শিট তৈরি করুন।",
    desc_hi: "पासपोर्ट फोटो शीट मेकर खोला जा रहा है।",
    desc_en: "Opening Passport Photo Sheet Maker.",
    keywords: ["passport photo", "passport sheet", "পাসপোর্ট ছবি"], 
    url: "passport-photo.html" 
  },
  { 
    name: "Digital Signature Maker (Sign Pad)", 
    desc_bn: "ডিজিটাল সিগনেচার প্যাড খোলা হচ্ছে। স্ক্রিনে সই করে স্বচ্ছ পিএনজি ডাউনলোড করুন।",
    desc_hi: "डिजिटल सिग्नेचर पैड खोला जा रहा है।",
    desc_en: "Opening Digital Signature Maker.",
    keywords: ["digital signature", "sign pad", "ডিজিটাল সই"], 
    url: "signature-maker.html" 
  },
  { 
    name: "QR Code & UPI Generator", 
    desc_bn: "কিউআর কোড জেনারেটর খোলা হচ্ছে। পেমেন্ট বা ইউআরএল কিউআর কোড তৈরি করুন।",
    desc_hi: "क्यूआर कोड जनरेटर खोला जा रहा है।",
    desc_en: "Opening QR Code Generator for UPI and URLs.",
    keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], 
    url: "qr-generator.html" 
  },
  { 
    name: "Color Picker & HEX Extractor", 
    desc_bn: "কালার পিকার খোলা হচ্ছে। হেক্স কালার কোড সহজে বের করে নিন।",
    desc_hi: "कलर पिकर खोला जा रहा है।",
    desc_en: "Opening Color Picker and HEX Extractor.",
    keywords: ["color picker", "hex extractor", "কালার পিকার"], 
    url: "color-picker.html" 
  },
  { 
    name: "YouTube Thumbnail Downloader", 
    desc_bn: "ইউটিউব থাম্বনেইল ডাউনলোডার খোলা হচ্ছে।",
    desc_hi: "यूट्यूब थंबनेल डाउनलोडर खोला जा रहा है।",
    desc_en: "Opening YouTube Thumbnail Downloader.",
    keywords: ["thumbnail", "youtube thumbnail", "থাম্বনেইল"], 
    url: "youtube-thumbnail.html" 
  },

  // Finance & Calculator Tools
  { 
    name: "DocuCraft AI Scientific Calculator", 
    desc_bn: "সায়েন্টিফিক ক্যালকুলেটর খোলা হচ্ছে। বৈজ্ঞানিক ও সাধারণ হিসাব-নিকাশ করুন।",
    desc_hi: "वैज्ञानिक कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Scientific Calculator for calculations.",
    keywords: ["calculator", "scientific calculator", "math", "ক্যালকুলেটর", "হিসাব", "calculate"], 
    url: "calculator.html" 
  },
  { 
    name: "Loan EMI Calculator", 
    desc_bn: "লোন ইএমআই ক্যালকুলেটর খোলা হচ্ছে। মাসিক কিস্তি ও মোট সুদের হিসাব জানুন।",
    desc_hi: "लोन ईएमआई कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Loan EMI Calculator.",
    keywords: ["loan emi", "emi calculator", "loan", "কিস্তি", "লোন"], 
    url: "loan-emi.html" 
  },
  { 
    name: "Loan Prepayment & Interest Saver", 
    desc_bn: "লোন প্রিপেমেন্ট ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "लोन प्रीपेमेंट कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Loan Prepayment Calculator.",
    keywords: ["prepayment", "interest saver", "প্রিপেমেন্ট"], 
    url: "loan-prepayment.html" 
  },
  { 
    name: "GST Calculator", 
    desc_bn: "জিএসটি ক্যালকুলেটর খোলা হচ্ছে। পণ্যের ট্যাক্স হিসাব করুন।",
    desc_hi: "जीएसटी कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening GST Calculator.",
    keywords: ["gst calculator", "gst", "জিএসটি"], 
    url: "gst-calculator.html" 
  },
  { 
    name: "SIP Calculator", 
    desc_bn: "এসআইপি ক্যালকুলেটর খোলা হচ্ছে। মিউচুয়াল ফান্ডের রিটার্ন হিসাব করুন।",
    desc_hi: "एसआईपी कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening SIP Calculator.",
    keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], 
    url: "sip-calculator.html" 
  },
  { 
    name: "Simple & Compound Interest", 
    desc_bn: "সুদ ক্যালকুলেটর খোলা হচ্ছে। সরল ও চক্রবৃদ্ধি সুদ হিসাব করুন।",
    desc_hi: "ब्याज कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Interest Calculator.",
    keywords: ["interest calculator", "simple interest", "compound interest", "সুদ হিসাব"], 
    url: "interest-calculator.html" 
  },
  { 
    name: "FD & RD Maturity Calculator", 
    desc_bn: "এফডি ও আরডি ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "एफडी आरडी कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening FD and RD Maturity Calculator.",
    keywords: ["fd calculator", "rd calculator", "এফডি"], 
    url: "fd-rd-calculator.html" 
  },
  { 
    name: "Gold & Jewellery Price Calculator", 
    desc_bn: "সোনার গহনা ক্যালকুলেটর খোলা হচ্ছে। সঠিক দাম হিসাব করুন।",
    desc_hi: "सोना मूल्य कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Gold & Jewellery Price Calculator.",
    keywords: ["gold calculator", "gold price", "সোনার দাম"], 
    url: "gold-calculator.html" 
  },
  { 
    name: "Inflation Calculator", 
    desc_bn: "মুদ্রাস্ফীতি ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "महंगाई कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Inflation Calculator.",
    keywords: ["inflation calculator", "inflation", "মুদ্রাস্ফীতি"], 
    url: "inflation-calculator.html" 
  },
  { 
    name: "PPF Calculator", 
    desc_bn: "পিপিএফ ক্যালকুলেটর খোলা হচ্ছে। সঞ্চয় হিসাব করুন।",
    desc_hi: "पीपीएफ कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening PPF Calculator.",
    keywords: ["ppf calculator", "ppf", "পিপিএফ"], 
    url: "ppf-calculator.html" 
  },
  { 
    name: "Electricity Bill & Power Calculator", 
    desc_bn: "বিদ্যুৎ বিল ক্যালকুলেটর খোলা হচ্ছে। বিদ্যুৎ খরচ হিসাব করুন।",
    desc_hi: "बिजली बिल कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Electricity Bill Calculator.",
    keywords: ["electricity bill", "power calculator", "বিদ্যুৎ বিল"], 
    url: "electricity-calculator.html" 
  },
  { 
    name: "Fuel Cost & Trip Mileage Calculator", 
    desc_bn: "ফুয়েল ক্যালকুলেটর খোলা হচ্ছে। পেট্রোল বা ডিজেল খরচ বের করুন।",
    desc_hi: "ईंधन कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Fuel Cost Calculator.",
    keywords: ["fuel cost", "mileage calculator", "তেল খরচ"], 
    url: "fuel-calculator.html" 
  },
  { 
    name: "Take-Home Salary & CTC Calculator", 
    desc_bn: "স্যালারি ক্যালকুলেটর খোলা হচ্ছে। ইন-হ্যান্ড বেতন দেখুন।",
    desc_hi: "सैलरी कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Salary Calculator.",
    keywords: ["salary calculator", "ctc calculator", "বেতন", "স্যালারি"], 
    url: "salary-calculator.html" 
  },
  { 
    name: "Friend Bill Split & Tip Calculator", 
    desc_bn: "বিল স্প্লিটার খোলা হচ্ছে। বন্ধুদের সাথে বিল সমান ভাগে ভাগ করুন।",
    desc_hi: "बिल स्प्लिटर खोला जा रहा है।",
    desc_en: "Opening Friend Bill Splitter.",
    keywords: ["bill split", "tip calculator", "বিল ভাগ"], 
    url: "bill-split.html" 
  },
  { 
    name: "Discount & Sale Calculator", 
    desc_bn: "ডিসকাউন্ট ক্যালকুলেটর খোলা হচ্ছে। ছাড়ের পর আসল দাম বের করুন।",
    desc_hi: "छूट कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Discount Calculator.",
    keywords: ["discount calculator", "sale calculator", "ছাড়"], 
    url: "discount-calculator.html" 
  },
  { 
    name: "Percentage Calculator", 
    desc_bn: "শতকরা ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "प्रतिशत कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Percentage Calculator.",
    keywords: ["percentage calculator", "percentage", "শতকরা", "শতাংশ"], 
    url: "percentage-calculator.html" 
  },
  { 
    name: "Number to Words (Cheque Amount)", 
    desc_bn: "নম্বর থেকে কথায় রূপান্তরকারী খোলা হচ্ছে।",
    desc_hi: "संख्या से शब्द कनवर्टर खोला जा रहा है।",
    desc_en: "Opening Number to Words converter.",
    keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], 
    url: "number-to-words.html" 
  },
  { 
    name: "Land Area Converter", 
    desc_bn: "জমির পরিমাপ কনভার্টার খোলা হচ্ছে। বিঘা, কাঠা ও একর হিসাব করুন।",
    desc_hi: "जमीन मापक कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Land Area Converter.",
    keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], 
    url: "land-converter.html" 
  },

  // Utilities & Productivity Tools
  { 
    name: "DocuCraft AI Translator", 
    desc_bn: "এআই ট্রান্সলেটর খোলা হচ্ছে। যেকোনো ভাষা অনুবাদ করুন।",
    desc_hi: "अनुवादक खोला जा रहा है।",
    desc_en: "Opening DocuCraft AI Translator.",
    keywords: ["translator", "translate", "translation", "অনুবাদ", "dokocraft translator"], 
    url: "translator.html" 
  },
  { 
    name: "Pitch to Text (Voice Typing)", 
    desc_bn: "ভয়েস টাইপিং টুল খোলা হচ্ছে। মুখে বললেই টাইপ হবে।",
    desc_hi: "वॉइस टाइपिंग खोला जा रहा है।",
    desc_en: "Opening Voice Typing tool.",
    keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], 
    url: "voice-typing.html" 
  },
  { 
    name: "Text-to-Speech Converter", 
    desc_bn: "টেক্সট টু স্পিচ টুল খোলা হচ্ছে। লেখাকে অডিও ভয়েসে রূপান্তর করুন।",
    desc_hi: "टेक्स्ट टू स्पीच खोला जा रहा है।",
    desc_en: "Opening Text-to-Speech Converter.",
    keywords: ["text to speech", "tts", "টেক্সট টু স্পিচ"], 
    url: "text-to-speech.html" 
  },
  { 
    name: "Unlimited Text Notepad", 
    desc_bn: "আনলিমিটেড নোটপ্যাড খোলা হচ্ছে। নোট লিখে সংরক্ষণ করুন।",
    desc_hi: "नोटपैड खोला जा रहा है।",
    desc_en: "Opening Unlimited Text Notepad.",
    keywords: ["notepad", "notebook", "নোটপ্যাড"], 
    url: "notepad.html" 
  },
  { 
    name: "Govt Job Alerts & Results", 
    desc_bn: "চাকরির খবর পোর্টাল খোলা হচ্ছে। সরকারি চাকরির আপডেট দেখুন।",
    desc_hi: "सरकारी नौकरी पोर्टल खोला जा रहा है।",
    desc_en: "Opening Government Job Alerts & Results.",
    keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], 
    url: "job-alerts.html" 
  },
  { 
    name: "Age Calculator (Exam DOB)", 
    desc_bn: "বয়স ক্যালকুলেটর খোলা হচ্ছে। জন্মতারিখ দিয়ে বয়স হিসাব করুন।",
    desc_hi: "उम्र कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Age Calculator.",
    keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], 
    url: "age-calculator.html" 
  },
  { 
    name: "Exam Age Eligibility Checker", 
    desc_bn: "বয়স যোগ্যতা যাচাইকারী খোলা হচ্ছে।",
    desc_hi: "आयु पात्रता चेकर खोला जा रहा है।",
    desc_en: "Opening Exam Age Eligibility Checker.",
    keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], 
    url: "exam-eligibility.html" 
  },
  { 
    name: "1-Minute Typing Speed Test", 
    desc_bn: "টাইপিং স্পিড টেস্ট খোলা হচ্ছে। টাইপিং গতি পরীক্ষা করুন।",
    desc_hi: "टाइपिंग स्पीड टेस्ट खोला जा रहा है।",
    desc_en: "Opening Typing Speed Test.",
    keywords: ["typing speed test", "typing test", "টাইপিং টেস্ট"], 
    url: "typing-test.html" 
  },
  { 
    name: "Daily Calorie & BMR Calculator", 
    desc_bn: "ক্যালোরি ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "कैलोरी कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Daily Calorie & BMR Calculator.",
    keywords: ["calorie calculator", "bmr calculator", "ক্যালোরি"], 
    url: "calorie-calculator.html" 
  },
  { 
    name: "Daily Water Intake Goal", 
    desc_bn: "জল ট্র্যাকার খোলা হচ্ছে। প্রতিদিনের জলের চাহিদা নির্ধারণ করুন।",
    desc_hi: "पानी का लक्ष्य चेकर खोला जा रहा है।",
    desc_en: "Opening Water Intake Goal Calculator.",
    keywords: ["water intake", "water goal", "জল"], 
    url: "water-intake.html" 
  },
  { 
    name: "Sleep Calculator", 
    desc_bn: "ঘুমের হিসাব ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "नींद कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Sleep Calculator.",
    keywords: ["sleep calculator", "sleep cycle", "ঘুম"], 
    url: "sleep-calculator.html" 
  },
  { 
    name: "Barcode Generator (Code 128)", 
    desc_bn: "বারকোড জেনারেটর খোলা হচ্ছে।",
    desc_hi: "बारकोड जनरेटर खोला जा रहा है।",
    desc_en: "Opening Barcode Generator.",
    keywords: ["barcode generator", "barcode", "বারকোড"], 
    url: "barcode-generator.html" 
  },
  { 
    name: "Base64 Encoder & Decoder", 
    desc_bn: "বেস৬৪ এনকোডার ও ডিকোডার খোলা হচ্ছে।",
    desc_hi: "बेस64 टूल खोला जा रहा है।",
    desc_en: "Opening Base64 Encoder & Decoder.",
    keywords: ["base64", "base64 encoder"], 
    url: "base64.html" 
  },
  { 
    name: "Random Password & PIN Generator", 
    desc_bn: "পাসওয়ার্ড ও পিন জেনারেটর খোলা হচ্ছে।",
    desc_hi: "पासवर्ड जनरेटर खोला जा रहा है।",
    desc_en: "Opening Password and PIN Generator.",
    keywords: ["password generator", "pin generator", "পাসওয়ার্ড জেনারেটর"], 
    url: "password-generator.html" 
  },
  { 
    name: "Universal Unit Converter", 
    desc_bn: "ইউনিট কনভার্টার খোলা হচ্ছে। একক রূপান্তর করুন।",
    desc_hi: "यूनिट कनवर्टर खोला जा रहा है।",
    desc_en: "Opening Universal Unit Converter.",
    keywords: ["unit converter", "একক রূপান্তর"], 
    url: "unit-converter.html" 
  },
  { 
    name: "Duplicate Line Remover", 
    desc_bn: "ডুপ্লিকেট লাইন রিমুভার খোলা হচ্ছে।",
    desc_hi: "डुप्लीकेट लाइन रिमूवर खोला जा रहा है।",
    desc_en: "Opening Duplicate Line Remover.",
    keywords: ["duplicate line remover", "remove duplicates"], 
    url: "duplicate-remover.html" 
  },
  { 
    name: "Text Reverse & Flip Tool", 
    desc_bn: "টেক্সট রিভার্সার খোলা হচ্ছে। লেখা উল্টো বা ফ্লিপ করুন।",
    desc_hi: "टेक्स्ट रिवर्स टूल खोला जा रहा है।",
    desc_en: "Opening Text Reverse & Flip Tool.",
    keywords: ["text reverse", "flip text", "লেখা উল্টানো"], 
    url: "text-reverse.html" 
  },
  { 
    name: "Marks to Percentage & CGPA", 
    desc_bn: "নম্বর থেকে শতাংশ ও সিজিপিএ ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "सीजीपीए कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Marks to Percentage & CGPA Calculator.",
    keywords: ["marks to percentage", "cgpa calculator", "cgpa"], 
    url: "marks-calculator.html" 
  },
  { 
    name: "Average & Grade Calculator", 
    desc_bn: "গড় ও গ্রেড ক্যালকুলেটর খোলা হচ্ছে।",
    desc_hi: "ग्रेड कैलकुलेटर खोला जा रहा है।",
    desc_en: "Opening Average & Grade Calculator.",
    keywords: ["average calculator", "grade calculator"], 
    url: "grade-calculator.html" 
  },
  { 
    name: "Invoice / Bill Generator", 
    desc_bn: "ইনভয়েস ও বিল জেনারেটর খোলা হচ্ছে।",
    desc_hi: "बिल जनरेटर खोला जा रहा है।",
    desc_en: "Opening Invoice and Bill Generator.",
    keywords: ["invoice generator", "bill generator", "বিল"], 
    url: "invoice-generator.html" 
  },
  { 
    name: "Resume / CV Maker to PDF", 
    desc_bn: "রিজিউমে ও সিভি মেকার চালু হচ্ছে। প্রফেশনাল বায়োডাটা তৈরি করুন।",
    desc_hi: "रिज्यूमे मेकर खोला जा रहा है।",
    desc_en: "Opening Resume / CV Maker.",
    keywords: ["resume maker", "cv maker", "biodata", "রিজিউমে", "সিভি"], 
    url: "resume-maker.html" 
  },
  { 
    name: "Prescription / Memo Maker", 
    desc_bn: "প্রেসক্রিপশন ও মেমো মেকার খোলা হচ্ছে।",
    desc_hi: "प्रिस्क्रिप्शन मेकर खोला जा रहा है।",
    desc_en: "Opening Prescription & Memo Maker.",
    keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], 
    url: "prescription-maker.html" 
  },
  { 
    name: "Contact & Support Desk", 
    desc_bn: "কন্ট্যাক্ট ও সাপোর্ট ডেস্ক খোলা হচ্ছে।",
    desc_hi: "सपोर्ट डेस्क खोला जा रहा है।",
    desc_en: "Opening Contact and Support Desk.",
    keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], 
    url: "contact.html" 
  }
];

// Helper to determine destination URL
function resolveTargetUrl(rawUrl, matchedItem) {
  let url = rawUrl;
  if (!url && matchedItem && matchedItem.url) {
    url = matchedItem.url;
  }
  return url || '';
}

// 7. Intelligent Matching & Direct Redirection
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  let cleanQuery = raw
    .replace(/(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও|খুলবে|খোলো|दिखाओ|चालू करो|আমাকে|হিসাব|দাও)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    // 1. Exact Name Matching
    if (cleanQuery && nameLower === cleanQuery) {
      score += 200;
    } else if (cleanQuery && nameLower.includes(cleanQuery)) {
      score += 90;
    }

    // 2. Exact Keyword Matching
    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (cleanQuery && cleanQuery === kwLower) {
        score += 150;
      } else if (raw.split(' ').includes(kwLower)) {
        score += 100;
      } else if (raw.includes(kwLower)) {
        score += 40;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  let matchedCard = null;

  if (bestMatchedItem && maxScore >= 60) {
    const targetUrlPart = bestMatchedItem.url.toLowerCase().replace('.html', '');
    matchedCard = cards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      return href.includes(targetUrlPart);
    });
  }

  if (bestMatchedItem && maxScore >= 60) {
    let voiceMessage = bestMatchedItem.desc_en;
    if (lang === 'bn-IN' && bestMatchedItem.desc_bn) {
      voiceMessage = bestMatchedItem.desc_bn;
    } else if (lang === 'hi-IN' && bestMatchedItem.desc_hi) {
      voiceMessage = bestMatchedItem.desc_hi;
    }

    showCenterAICard(raw, voiceMessage, bestMatchedItem.name);

    if (matchedCard) {
      matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      matchedCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      matchedCard.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.9)';
      matchedCard.style.transform = 'scale(1.05)';
    }

    // Speak cleanly, then redirect
    speakText(voiceMessage, lang, () => {
      setTimeout(() => {
        hideCenterAICard();
        const finalUrl = resolveTargetUrl(bestMatchedItem.url, bestMatchedItem);
        if (isSafeUrl(finalUrl)) {
          window.location.href = finalUrl;
        }
      }, 500);
    });
  } else {
    let notFoundMsg = "Sorry, I couldn't find that tool. Please say the tool name clearly.";
    if (lang === 'bn-IN') {
      notFoundMsg = "দুঃখিত, এই টুলটি বুঝতে পারিনি। দয়া করে টুলের নাম স্পষ্ট করে বলুন।";
    } else if (lang === 'hi-IN') {
      notFoundMsg = "माफ़ कीजिए, यह टूल नहीं मिला। कृपया टूल का नाम साफ़ बोलें।";
    }
    showCenterAICard(raw, notFoundMsg, "DocuCraft AI");
    speakText(notFoundMsg, lang);
  }
}

// 8. Microphone Voice Recognition
function toggleVoiceInput(inputElementId = 'toolSearchInput', callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  // Ensure Audio context is unlocked on click
  unlockAudioEngine();

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
  globalRecognition.continuous = false; // Prevents background echo loop
  globalRecognition.interimResults = false;

  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

  // Assistant introduction greeting first, then listen
  playIndranilGreeting(() => {
    try {
      globalRecognition.start();
    } catch (e) {
      console.warn("Speech start:", e);
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
    console.warn("Speech Recognition notice:", event.error);
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

// 9. Seamless Card Touch Listener
function handleCardClick(element) {
  if (!element) return;
  const rawUrl = element.getAttribute('href') || element.querySelector('a')?.getAttribute('href') || '';
  if (isSafeUrl(rawUrl)) {
    window.location.href = rawUrl;
  }
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.popular-card, .tool-card');
  if (card && e.target.tagName !== 'BUTTON' && e.target.id !== 'voiceSearchBtn') {
    handleCardClick(card);
  }
});
