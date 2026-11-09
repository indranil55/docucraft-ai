/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;

// Comprehensive Multi-lingual Tool Catalog (English, Hindi, Bengali)
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "scanner", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত"], url: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "separate", "tukde", "katna", "ভাগ", "কাটা", "splitter"], url: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "reduce size", "chota karna", "সাইজ কমানো", "কম্প্রেস"], url: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "स्कैनर", "স্ক্যানার"], url: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip converter", "জিপ"], url: "zip-to-pdf.html" },
  { name: "Repair PDF", keywords: ["repair", "fix", "theek karna", "মেরামত", "corrupt"], url: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "pages sequence", "সাজানো"], url: "organize-pdf.html" },
  { name: "Rotate PDF", keywords: ["rotate", "ghumaana", "ঘোরানো"], url: "rotate-pdf.html" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "hatao", "বাদ দেওয়া", "মুছে ফেলা"], url: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "फोटो से पीडीएफ", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf.html" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "word converter"], url: "word-to-pdf.html" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], url: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], url: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], url: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], url: "pdf-to-jpg.html" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], url: "pdf-to-text.html" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "এডিট"], url: "edit-pdf.html" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই"], url: "sign-pdf.html" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ"], url: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], url: "protect-pdf.html" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "আনলক"], url: "unlock-pdf.html" },
  { name: "Add Page Numbers", keywords: ["page numbers", "page number", "पेज नंबर", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "हिसाब", "ক্যালকুলেটর"], url: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment.html" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "जीएसटी", "জিএসটি"], url: "gst-calculator.html" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], url: "sip-calculator.html" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "interest calculator", "ब्याज", "সুদ"], url: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], url: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "jewellery", "सोना", "সোনার দাম"], url: "gold-calculator.html" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation", "মহঙ্গাই", "মুদ্রাস্ফীতি"], url: "inflation-calculator.html" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf", "পিপিএফ"], url: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "electric bill", "बिजली बिल", "বিদ্যুৎ বিল"], url: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], url: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], url: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], url: "bill-split.html" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "छूट", "ছাড়"], url: "discount-calculator.html" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "प्रतिशत", "শতকরা", "শতাংশ"], url: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], url: "number-to-words.html" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], url: "land-converter.html" },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ", "अनुवाद", "dokocraft translator", "docucraft translator"], url: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "बोलकर लिखना", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "नोटपैড", "নোটপ্যাড", "নোটবুক"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "सरकारी नौकरी", "চাকরি"], url: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "उम्र", "বয়স ক্যালকুলেটর"], url: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], url: "exam-eligibility.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test.html" },
  { name: "Daily Calorie & BMR Calculator", keywords: ["calorie calculator", "bmr calculator", "daily calorie", "ক্যালোরি"], url: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", keywords: ["water intake", "water goal", "পানি খাওয়ার লক্ষ্য"], url: "water-intake.html" },
  { name: "Sleep Calculator", keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব"], url: "sleep-calculator.html" },
  { name: "Barcode Generator (Code 128)", keywords: ["barcode generator", "barcode", "বারকোড"], url: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", keywords: ["base64", "base64 encoder", "base64 decoder"], url: "base64.html" },
  { name: "Random Password & PIN Generator", keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator.html" },
  { name: "Universal Unit Converter", keywords: ["unit converter", "universal converter", "একক রূপান্তর"], url: "unit-converter.html" },
  { name: "Duplicate Line Remover", keywords: ["duplicate line remover", "remove duplicates"], url: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], url: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], url: "marks-calculator.html" },
  { name: "Average & Grade Calculator", keywords: ["average calculator", "grade calculator"], url: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", keywords: ["invoice generator", "bill generator", "बिल जनरेटर", "বিল মেকার"], url: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "बायोडाटा", "রিজিউমে"], url: "resume-maker.html" },
  { name: "Prescription / Memo Maker", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], url: "prescription-maker.html" },
  { name: "Contact & Support Desk", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], url: "contact.html" }
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

// Speak response
function speakResponseInNativeLanguage(text, langCode) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = langCode || 'en-US';

  if (availableVoices.length > 0) {
    const target = (langCode || 'en').toLowerCase().split('-')[0];
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

// Greet user
async function playIndranilGreeting(userLangCode) {
  const baseGreeting = "I am Indranil, how can I help you?";
  const targetShort = (userLangCode || 'en').split('-')[0];

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

// Smart Tool Navigation
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  // Filter out conversational triggers
  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

  let bestMatchedItem = null;
  let maxScore = 0;

  // 1. Match from siteKnowledgeBase
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

  // 2. Identify target on DOM
  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  let matchedCard = null;

  if (bestMatchedItem && maxScore >= 40) {
    const targetUrlPart = bestMatchedItem.url.toLowerCase().replace('.html', '');
    matchedCard = cards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      return href.includes(targetUrlPart);
    });
  }

  // 3. Fallback to scanning Card Headings if not matched in Knowledge Base
  if (!matchedCard) {
    let highestCardScore = 0;
    const tokens = cleanQuery.split(/\s+/).filter(w => w.length >= 2);

    cards.forEach(card => {
      if (card.offsetParent === null) return;
      const titleElem = card.querySelector('h3, h4, .tool-title, strong, b');
      const title = (titleElem ? (titleElem.innerText || titleElem.textContent) : '').toLowerCase();

      let score = 0;
      if (title && title.includes(cleanQuery)) score += 50;
      tokens.forEach(t => {
        if (title.includes(t)) score += 15;
      });

      if (score > highestCardScore) {
        highestCardScore = score;
        matchedCard = card;
      }
    });
  }

  // 4. Action: Highlight, Scroll & Open
  if (matchedCard) {
    matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    matchedCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    matchedCard.style.boxShadow = '0 0 25px rgba(0, 150, 255, 0.9)';
    matchedCard.style.transform = 'scale(1.05)';

    setTimeout(() => {
      const link = matchedCard.tagName === 'A' ? matchedCard : matchedCard.querySelector('a');
      if (link && link.href) {
        window.location.href = link.href; // Instant safe redirect
      } else if (bestMatchedItem) {
        window.location.href = bestMatchedItem.url;
      } else {
        matchedCard.click();
      }
    }, 600);
  } else if (bestMatchedItem && maxScore >= 50) {
    // Direct URL Navigation if element is hidden in other tabs
    window.location.href = bestMatchedItem.url;
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

function startVoice() {
  toggleVoiceInput('toolSearchInput');
}

// Category Filter Logic
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

// Strict Safe URL Resolver (CodeQL Compliant)
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

// Track Tool Usage
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
// Smart Tool Navigation with Safe DOM-Only URL Extraction
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

  // 1. All tool cards and clickable tool links on page
  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  if (cards.length === 0) return;

  let bestTarget = null;
  let highestScore = 0;
  const tokens = cleanQuery.split(/\s+/).filter(w => w.length >= 2);

  // 2. Score exclusively against elements already existing on the DOM
  cards.forEach(card => {
    const titleElem = card.querySelector('h3, h4, .tool-title, strong, b');
    const titleText = (titleElem ? (titleElem.innerText || titleElem.textContent) : '').toLowerCase();
    const fullText = (card.innerText || card.textContent || '').toLowerCase();
    const href = (card.getAttribute('href') || card.querySelector('a')?.getAttribute('href') || '').toLowerCase();

    let score = 0;

    // Check title match
    if (titleText && titleText.includes(cleanQuery)) score += 100;
    // Check href match
    if (href && href.includes(cleanQuery.replace(/\s+/g, '-'))) score += 80;

    // Word by word matching
    tokens.forEach(tok => {
      if (titleText.includes(tok)) score += 30;
      else if (href.includes(tok)) score += 20;
      else if (fullText.includes(tok)) score += 5;
    });

    if (score > highestScore) {
      highestScore = score;
      bestTarget = card;
    }
  });

  // 3. Highlight and Navigate ONLY using the real link present on the page
  if (bestTarget && highestScore > 0) {
    bestTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bestTarget.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    bestTarget.style.boxShadow = '0 0 25px rgba(0, 150, 255, 0.9)';
    bestTarget.style.transform = 'scale(1.05)';

    setTimeout(() => {
      // Extract the real valid URL from the card
      const linkElem = bestTarget.tagName === 'A' ? bestTarget : bestTarget.querySelector('a');
      const realUrl = linkElem?.getAttribute('href') || bestTarget.getAttribute('href');

      if (realUrl && realUrl !== '#' && (realUrl.startsWith('http://') || realUrl.startsWith('https://') || realUrl.startsWith('/'))) {
        window.location.href = realUrl;
      } else {
        bestTarget.click();
      }
    }, 600);
  }
}
