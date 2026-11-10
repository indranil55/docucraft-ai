/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;

// Knowledge base of all tools available on the site
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "যুক্ত", "scanner", "merger"], url: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "ভাগ", "কাটা", "rotator", "splitter"], url: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "size", "কমানো", "কম্প্রেস"], url: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "enhance", "স্ক্যানার"], url: "pdf-scanner.html" },
  { name: "ZIP to PDF", keywords: ["zip", "জিপ"], url: "zip-to-pdf.html" },
  { name: "Repair PDF", keywords: ["repair", "fix", "মেরামত", "corrupt"], url: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "সাজানো"], url: "organize-pdf.html" },
  { name: "Rotate PDF", keywords: ["rotate", "ঘোরানো"], url: "rotate-pdf.html" },
  { name: "Delete PDF Pages", keywords: ["delete", "মুছে", "বাদ"], url: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf.html" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "ওয়ার্ড"], url: "word-to-pdf.html" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xlsx to pdf", "এক্সেল"], url: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "পাওয়ারপয়েন্ট"], url: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF", keywords: ["html to pdf"], url: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to png"], url: "pdf-to-jpg.html" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR)", keywords: ["ocr", "pdf to text", "টেক্সট"], url: "pdf-to-text.html" },
  { name: "Edit PDF", keywords: ["edit pdf", "এডিট"], url: "edit-pdf.html" },
  { name: "Sign PDF", keywords: ["sign pdf", "স্বাক্ষর", "সই"], url: "sign-pdf.html" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ"], url: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", keywords: ["lock", "protect", "password", "পাসওয়ার্ড", "লক"], url: "protect-pdf.html" },
  { name: "Unlock PDF", keywords: ["unlock", "আনলক"], url: "unlock-pdf.html" },
  { name: "Add Page Numbers", keywords: ["page number", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["photo resizer", "sign resizer", "kb resizer", "mb resizer", "ছবি সাইজ", "রিসাইজার"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport", "পাসপোর্ট"], url: "passport-photo.html" },
  { name: "Digital Signature Maker", keywords: ["digital signature", "sign pad", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr", "upi", "কিউআর"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color", "hex", "কালার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube", "ইউটিউব", "থাম্বনেইল"], url: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["calculator", "scientific", "ক্যালকুলেটর"], url: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["emi", "loan", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment Saver", keywords: ["prepayment", "interest saver"], url: "loan-prepayment.html" },
  { name: "GST Calculator", keywords: ["gst", "জিএসটি"], url: "gst-calculator.html" },
  { name: "SIP Calculator", keywords: ["sip", "এসআইপি", "mutual fund"], url: "sip-calculator.html" },
  { name: "Simple & Compound Interest", keywords: ["interest", "compound", "সুদ"], url: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd", "rd", "ফিক্সড ডিপোজিট"], url: "fd-rd-calculator.html" },
  { name: "Gold Price Calculator", keywords: ["gold", "সোনার দাম", "জুয়েলারি"], url: "gold-calculator.html" },
  { name: "Inflation Calculator", keywords: ["inflation", "মুদ্রাস্ফীতি"], url: "inflation-calculator.html" },
  { name: "PPF Calculator", keywords: ["ppf", "পিপিএফ"], url: "ppf-calculator.html" },
  { name: "Electricity Bill Calculator", keywords: ["electricity", "electric", "কারেন্ট", "বিদ্যুৎ বিল"], url: "electricity-calculator.html" },
  { name: "Fuel Cost Calculator", keywords: ["fuel", "petrol", "diesel", "তেল", "মাইলেজ"], url: "fuel-calculator.html" },
  { name: "Salary Calculator", keywords: ["salary", "ctc", "বেতন"], url: "salary-calculator.html" },
  { name: "Bill Split Calculator", keywords: ["split", "tip", "বিল ভাগ"], url: "bill-split.html" },
  { name: "Discount Calculator", keywords: ["discount", "sale", "ছাড়"], url: "discount-calculator.html" },
  { name: "Percentage Calculator", keywords: ["percentage", "শতাংশ", "পার্সেন্টেজ"], url: "percentage-calculator.html" },
  { name: "Number to Words", keywords: ["words", "cheque", "কথায় লেখা"], url: "number-to-words.html" },
  { name: "Land Area Converter", keywords: ["land", "bigha", "katha", "জমি", "কাঠা", "বিঘা"], url: "land-converter.html" },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "অনুবাদ"], url: "translator.html" },
  { name: "Voice Typing (Pitch to Text)", keywords: ["voice typing", "speech to text", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "কথা বলা"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "note", "নোটপ্যাড", "নোট"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["job", "sarkari", "চাকরি", "রেজাল্ট"], url: "job-alerts.html" },
  { name: "Age Calculator", keywords: ["age", "বয়স", "dob"], url: "age-calculator.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing test", "speed test", "টাইপিং স্পিড"], url: "typing-test.html" },
  { name: "Calorie & BMR Calculator", keywords: ["calorie", "bmr", "ক্যালোরি"], url: "calorie-calculator.html" },
  { name: "Sleep Calculator", keywords: ["sleep", "ঘুম"], url: "sleep-calculator.html" },
  { name: "Barcode Generator", keywords: ["barcode", "বারকোড"], url: "barcode-generator.html" },
  { name: "Password Generator", keywords: ["password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator.html" },
  { name: "Resume / CV Maker", keywords: ["resume", "cv", "বায়োডাটা", "রেজুমে"], url: "resume-maker.html" },
  { name: "Invoice / Bill Generator", keywords: ["invoice", "bill", "ইনভয়েস", "বিল"], url: "invoice-generator.html" }
];

// Load available browser voices
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// Automatically detect language and translate text
async function translateUniversal(text, targetLang, sourceLang = 'auto') {
  if (!text || targetLang === sourceLang) return { text, detected: sourceLang };
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0].map(item => item[0]).join('');
    const detectedLang = data[2] || 'en';
    return { text: translatedText, detected: detectedLang };
  } catch (err) {
    return { text: text, detected: 'en' };
  }
}

// Speak greeting or response aloud in matching user voice
function speakResponseInNativeLanguage(text, langCode) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = langCode || 'en-US';

  if (availableVoices.length > 0) {
    const target = langCode.toLowerCase().split('-')[0];
    const matchedVoice = availableVoices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(target)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

// Greet user in their native language
async function playIndranilGreeting(userLangCode) {
  const baseGreeting = "I am Indranil, how can I help you?";
  const targetShort = userLangCode.split('-')[0];

  if (targetShort === 'en') {
    speakResponseInNativeLanguage(baseGreeting, 'en-US');
    return;
  }

  try {
    const res = await translateUniversal(baseGreeting, targetShort, 'en');
    speakResponseInNativeLanguage(res.text, userLangCode);
  } catch (e) {
    speakResponseInNativeLanguage(baseGreeting, 'en-US');
  }
}

// Smart Tool Search & Navigation Logic
function scrollToMatchedTool(query) {
  if (!query) return;

  const rawQuery = query.toLowerCase().trim();
  const cleanQuery = rawQuery
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|খুলুন|খোল|দেখাও|যাও)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

  // 1. First, check siteKnowledgeBase for accurate keyword matching
  let matchedKbItem = null;
  let maxKbScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();
    
    if (nameLower.includes(cleanQuery) || cleanQuery.includes(nameLower)) {
      score += 100;
    }

    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (cleanQuery.includes(kwLower) || kwLower.includes(cleanQuery)) {
        score += 50;
      }
    });

    if (score > maxKbScore) {
      maxKbScore = score;
      matchedKbItem = item;
    }
  });

  // 2. Locate DOM element
  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  let targetElement = null;

  // If KB matched with high confidence, locate by href or title
  if (matchedKbItem && maxKbScore >= 50) {
    const targetFilename = matchedKbItem.url.toLowerCase();
    targetElement = cards.find(c => {
      const href = (c.getAttribute('href') || (c.querySelector('a')?.getAttribute('href')) || '').toLowerCase();
      return href.includes(targetFilename);
    });
  }

  // 3. Fallback: Fuzzy DOM Scoring on Title Only
  if (!targetElement) {
    let bestDomScore = 0;
    const tokens = cleanQuery.split(/\s+/).filter(w => w.length >= 2);

    cards.forEach(card => {
      if (card.offsetParent === null) return;
      const titleEl = card.querySelector('h3, h4, .tool-title, strong, b');
      const titleText = (titleEl ? (titleEl.innerText || titleEl.textContent) : card.innerText || '').toLowerCase();

      let score = 0;
      if (titleText.includes(cleanQuery)) score += 80;
      tokens.forEach(t => {
        if (titleText.includes(t)) score += 20;
      });

      if (score > bestDomScore) {
        bestDomScore = score;
        targetElement = card;
      }
    });
  }

  // 4. Highlight & Open the matching tool
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    targetElement.style.boxShadow = '0 0 25px rgba(0, 150, 255, 0.9)';
    targetElement.style.transform = 'scale(1.05)';

    setTimeout(() => {
      const clickEl = targetElement.tagName === 'A' ? targetElement : (targetElement.querySelector('a') || targetElement);
      if (clickEl) clickEl.click();
    }, 600);

    setTimeout(() => {
      targetElement.style.boxShadow = '';
      targetElement.style.transform = '';
    }, 2200);
  }
}

// Global voice input (Microphone / Speech Recognition)
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
    return;
  }

  shouldRestart = true;
  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = true;
  globalRecognition.interimResults = true;

  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

  let hasGreeted = false;

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";

    if (!hasGreeted) {
      hasGreeted = true;
      playIndranilGreeting(userPreferredLang);
    }
  };

  globalRecognition.onresult = function(event) {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      const cleanTranscript = finalTranscript.trim();
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
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      shouldRestart = false;
      isListening = false;
      if (micBtn) micBtn.classList.remove('listening');
      if (statusElem) statusElem.innerText = "";
    }
  };

  globalRecognition.onend = function() {
    if (shouldRestart) {
      try {
        globalRecognition.start();
      } catch (err) {
        setTimeout(() => {
          if (shouldRestart) {
            try { globalRecognition.start(); } catch (e) {}
          }
        }, 300);
      }
    } else {
      isListening = false;
      if (micBtn) micBtn.classList.remove('listening');
      if (statusElem) statusElem.innerText = "";
    }
  };

  try {
    globalRecognition.start();
  } catch (err) {
    console.error("Start error:", err);
  }
}

// Hook for index.html onclick="startVoice()"
function startVoice() {
  toggleVoiceInput('toolSearchInput');
}

// ==========================================
// 1. Unified Category Filter Logic
// ==========================================
function filterCategory(category, buttonElement) {
  document.querySelectorAll('.filter-chips-container .chip, .category-chip, .filter-chip').forEach(btn => {
    btn.classList.remove('active');
  });
  if (buttonElement) buttonElement.classList.add('active');

  const cards = document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item');
  const target = category.toLowerCase().trim();

  cards.forEach(card => {
    if (target === 'all') {
      card.style.display = '';
      return;
    }

    const cardCat = (card.getAttribute('data-category') || card.getAttribute('data-cat') || '').toLowerCase();
    const cardText = (card.innerText || card.textContent || '').toLowerCase();

    let isMatch = false;
    if (target === 'pdf' && (cardCat.includes('pdf') || cardText.includes('pdf'))) isMatch = true;
    else if (target === 'photo' && (cardCat.includes('photo') || cardCat.includes('cyber') || cardText.includes('photo') || cardText.includes('image') || cardText.includes('resizer'))) isMatch = true;
    else if (target === 'finance' && (cardCat.includes('finance') || cardCat.includes('calc') || cardText.includes('calculator') || cardText.includes('loan') || cardText.includes('gst') || cardText.includes('sip') || cardText.includes('emi'))) isMatch = true;
    else if (target === 'utility' && (cardCat.includes('utility') || cardCat.includes('generator') || cardText.includes('converter') || cardText.includes('typing') || cardText.includes('translator'))) isMatch = true;
    else if (target === 'jobs' && (cardCat.includes('job') || cardText.includes('job') || cardText.includes('sarkari'))) isMatch = true;
    else {
      isMatch = cardCat.includes(target) || cardText.includes(target);
    }

    card.style.display = isMatch ? '' : 'none';
  });
}

// ==========================================
// 2. Strict Safe URL Resolver (CodeQL Compliant)
// ==========================================
function getCleanSafeHref(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// ==========================================
// 3. Recently Used Tools
// ==========================================
function trackToolUsage(toolName, toolUrl) {
  const safeUrl = getCleanSafeHref(toolUrl);
  if (!safeUrl) return;

  let recent = JSON.parse(localStorage.getItem('docucraft_recent_tools') || '[]');
  recent = recent.filter(t => t.name !== toolName);
  recent.unshift({ name: String(toolName).slice(0, 80), url: safeUrl });
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
    const safeHref = getCleanSafeHref(tool.url);
    if (!safeHref) return;

    const link = document.createElement('a');
    link.setAttribute('href', safeHref);
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

// Listen to all tool clicks automatically to update Recent list
document.addEventListener('DOMContentLoaded', () => {
  renderRecentTools();

  document.querySelectorAll('a[href*=".html"], .tool-card, .popular-card').forEach(link => {
    link.addEventListener('click', function() {
      const toolName = this.querySelector('h3, h4, .tool-title')?.innerText || this.innerText.split('\n')[0];
      const rawUrl = this.getAttribute('href') || (this.querySelector('a') ? this.querySelector('a').getAttribute('href') : null);
      const safeUrl = getCleanSafeHref(rawUrl);
      if (toolName && safeUrl) {
        trackToolUsage(toolName.trim(), safeUrl);
      }
    });
  });
});
