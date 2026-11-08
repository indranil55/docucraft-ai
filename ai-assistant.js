/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false; // Flag to maintain continuous listening state

// Knowledge base of all tools available on the site
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF / Document Scanner & Merger", cat: "PDF", desc: "Combines multiple PDF files or scanned pages into a single document." },
  { name: "Split PDF / PDF Page Rotator & Splitter", cat: "PDF", desc: "Separates specific pages or cuts large PDF documents into smaller parts." },
  { name: "Compress PDF", cat: "PDF", desc: "Reduces PDF file size while maintaining high visual quality." },
  { name: "PDF Scanner & Enhancer", cat: "PDF", desc: "Enhances photo contrast and creates clean scanned PDF documents." },
  { name: "ZIP to PDF Converter", cat: "PDF", desc: "Extracts images or documents inside a ZIP file and converts them to PDF." },
  { name: "Repair PDF (Fix Corrupted File)", cat: "PDF", desc: "Repairs damaged or unreadable PDF files and rebuilds stream structures." },
  { name: "Organize / Reorder Pages", cat: "PDF", desc: "Rearranges, reorders, or sequences pages in a PDF document." },
  { name: "Rotate PDF", cat: "PDF", desc: "Rotates upside-down or sideways PDF pages by 90, 180, or 270 degrees." },
  { name: "Delete PDF Pages", cat: "PDF", desc: "Removes unwanted, blank, or defective pages from PDF files." },
  { name: "JPG / PNG to PDF", cat: "PDF", desc: "Converts images and photo gallery files into standard A4 PDF pages." },
  { name: "Word to PDF (Docx to PDF)", cat: "PDF", desc: "Converts Microsoft Word documents directly into standardized PDF format." },
  { name: "Excel to PDF (XLS/XLSX)", cat: "PDF", desc: "Converts Excel spreadsheets and data tables into printable PDFs." },
  { name: "PowerPoint to PDF (PPT/PPTX)", cat: "PDF", desc: "Converts PowerPoint presentation decks and slides into portable PDF files." },
  { name: "HTML to PDF Converter", cat: "PDF", desc: "Converts raw HTML markup code or snippets into downloadable PDF pages." },
  { name: "PDF to JPG / PNG", cat: "PDF", desc: "Extracts PDF document pages into high-resolution individual images." },
  { name: "PDF to Word (DOCX)", cat: "PDF", desc: "Transforms PDF files into fully editable Microsoft Word documents." },
  { name: "PDF to Excel (XLSX)", cat: "PDF", desc: "Extracts table data from PDF documents directly into Excel sheets." },
  { name: "PDF to Text (OCR Extractor)", cat: "PDF", desc: "Extracts selectable and editable text from scanned images or book pages." },
  { name: "Edit PDF", cat: "PDF", desc: "Adds text annotations, signatures, or notes onto PDF documents." },
  { name: "Sign PDF", cat: "PDF", desc: "Adds personal digital signatures or verification stamps to documents." },
  { name: "Watermark PDF / Watermark Generator", cat: "PDF", desc: "Stamps custom text watermarks across document pages." },
  { name: "Protect / Lock PDF", cat: "PDF", desc: "Encrypts PDF files with a secret password to prevent unauthorized viewing." },
  { name: "Unlock PDF", cat: "PDF", desc: "Removes password security and restrictions from unlocked PDF files." },
  { name: "Add Page Numbers", cat: "PDF", desc: "Adds page numbers at the bottom center of each PDF page." },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", cat: "Cyber", desc: "Compresses images precisely to target KB or MB limits for job forms." },
  { name: "Exam Photo & Signature Resizer", cat: "Cyber", desc: "Resizes photos and signatures according to exam board dimensions (SSC, UPSC, NEET)." },
  { name: "Passport Photo Sheet Maker", cat: "Cyber", desc: "Arranges passport photo grids on an A4 sheet for direct printing." },
  { name: "Digital Signature Maker (Sign Pad)", cat: "Cyber", desc: "Lets users draw signatures on screen and download transparent PNG files." },
  { name: "QR Code & UPI Generator", cat: "Cyber", desc: "Creates instant QR codes for payment links, UPI IDs, and URLs." },
  { name: "Color Picker & HEX Extractor", cat: "Cyber", desc: "Uploads pictures to grab exact HEX, RGB, and HSL color values." },
  { name: "YouTube Thumbnail Downloader", cat: "Cyber", desc: "Downloads full resolution HD and 4K thumbnails from YouTube video links." },

  // Finance & Calculator Tools
  { name: "DocuCraft AI Scientific Calculator", cat: "Calculator", desc: "Scientific calculator with trigonometry, calculus, algebra, and math functions." },
  { name: "Loan EMI Calculator", cat: "Finance", desc: "Calculates monthly EMI, total interest, and complete loan repayment charts." },
  { name: "Loan Prepayment & Interest Saver", cat: "Finance", desc: "Calculates how much money and time you save with extra prepayments." },
  { name: "GST Calculator", cat: "Finance", desc: "Calculates 5%, 12%, 18%, and 28% GST inclusive and exclusive prices." },
  { name: "SIP Calculator", cat: "Finance", desc: "Calculates expected wealth and return growth for mutual fund investments." },
  { name: "Simple & Compound Interest", cat: "Finance", desc: "Calculates simple interest and quarterly compounded interest." },
  { name: "FD & RD Maturity Calculator", cat: "Finance", desc: "Calculates maturity returns on bank fixed and recurring deposits." },
  { name: "Gold & Jewellery Price Calculator", cat: "Finance", desc: "Calculates gold jewelry prices with making charges and 3% GST." },
  { name: "Inflation & Future Value Calculator", cat: "Finance", desc: "Forecasts future product costs and purchasing power degradation." },
  { name: "PPF Calculator", cat: "Finance", desc: "Calculates 15-year Public Provident Fund returns and tax-free maturity." },
  { name: "Electricity Bill & Power Calculator", cat: "Utility", desc: "Calculates appliance power consumption, kWh units, and electricity bill." },
  { name: "Fuel Cost & Trip Mileage Calculator", cat: "Utility", desc: "Calculates total fuel needed and overall trip costs based on vehicle mileage." },
  { name: "Take-Home Salary & CTC Calculator", cat: "Finance", desc: "Calculates in-hand monthly salary deducting EPF, PT, and TDS." },
  { name: "Friend Bill Split & Tip Calculator", cat: "Finance", desc: "Splits group bills equally including tip percentages." },
  { name: "Discount & Sale Calculator", cat: "Finance", desc: "Calculates final prices and total savings after applying discounts." },
  { name: "Percentage Calculator", cat: "Finance", desc: "Finds percentage values, increases, decreases, and exam marks." },
  { name: "Number to Words (Cheque Amount)", cat: "Finance", desc: "Converts numeric amounts to bank cheque wording format." },
  { name: "Land Area Converter", cat: "Utility", desc: "Converts land between Bigha, Katha, Chhatak, Acre, Decimil, and Square Feet." },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", cat: "Utility", desc: "Translates text and paragraphs into all world languages instantly." },
  { name: "Pitch to Text (Voice Typing)", cat: "Utility", desc: "Converts voice speech through the microphone into editable text." },
  { name: "Text-to-Speech Converter", cat: "Utility", desc: "Speaks any text out loud with natural voice audio." },
  { name: "Unlimited Text Notepad", cat: "Generator", desc: "Provides notepad capability for 100,000+ lines of text." },
  { name: "Govt Job Alerts & Results", cat: "Jobs", desc: "Provides latest notifications from Sarkari Result, NTA, and job portals." },
  { name: "Age Calculator (Exam DOB)", cat: "Utility", desc: "Calculates exact age in years, months, and days for exam forms." },
  { name: "Exam Age Eligibility Checker", cat: "Utility", desc: "Checks if a candidate falls within age limits for job notifications." },
  { name: "1-Minute Typing Speed Test", cat: "Utility", desc: "Measures typing speed in Words Per Minute (WPM) and accuracy." },
  { name: "Daily Calorie & BMR Calculator", cat: "Health", desc: "Calculates daily calorie requirements and basal metabolic rates." },
  { name: "Daily Water Intake Goal", cat: "Health", desc: "Calculates recommended daily water drinking amounts in liters." },
  { name: "Sleep Calculator", cat: "Health", desc: "Calculates optimal bedtimes based on 90-minute sleep cycles." },
  { name: "Barcode Generator (Code 128)", cat: "Generator", desc: "Generates standard printable barcodes in PNG format." },
  { name: "Base64 Encoder & Decoder", cat: "Generator", desc: "Encodes plain text into Base64 format and decodes it back." },
  { name: "Random Password & PIN Generator", cat: "Security", desc: "Generates high security random passwords and passphrases." },
  { name: "Universal Unit Converter", cat: "Utility", desc: "Converts length, weight, and temperature units." },
  { name: "Duplicate Line Remover", cat: "Generator", desc: "Removes duplicate repeated lines from lists with one click." },
  { name: "Text Reverse & Flip Tool", cat: "Utility", desc: "Reverses letters, words, and flips text strings." },
  { name: "Marks to Percentage & CGPA", cat: "Utility", desc: "Converts academic marks and CGPA into percentage scores." },
  { name: "Average & Grade Calculator", cat: "Utility", desc: "Calculates average scores and letter grades across subjects." },
  { name: "Invoice / Bill Generator", cat: "Generator", desc: "Builds clean billing receipts and customer invoices." },
  { name: "Resume / CV Maker to PDF", cat: "Generator", desc: "Builds curriculum vitae and resumes ready for job applications." },
  { name: "Prescription / Memo Maker", cat: "Generator", desc: "Creates digital prescriptions and diagnostic memos." },
  { name: "Contact & Support Desk", cat: "Support", desc: "Direct contact form to send questions or report issues." }
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

// Scrolls the best-matching tool card to center, highlights, and auto-opens
function scrollToMatchedTool(query) {
  if (!query) return;

  // Clean voice prompt by removing common command filler words
  const cleanQuery = query.toLowerCase()
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please)\s+/i, '')
    .trim();

  // Query all potential tool cards and visible tool items
  const candidates = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .tool-item, a[href*=".html"], [class*="card"]'));
  let bestTarget = null;

  // 1. Check visible elements for full match
  for (const el of candidates) {
    if (el.offsetParent === null) continue; // Skip hidden elements
    const elText = (el.innerText || el.textContent || '').toLowerCase();
    if (cleanQuery.length >= 2 && elText.includes(cleanQuery)) {
      bestTarget = el;
      break;
    }
  }

  // 2. Token-based match fallback if full phrase isn't matched
  if (!bestTarget) {
    const tokens = cleanQuery.split(/\s+/).filter(w => w.length > 2);
    for (const el of candidates) {
      if (el.offsetParent === null) continue;
      const elText = (el.innerText || el.textContent || '').toLowerCase();
      if (tokens.some(t => elText.includes(t))) {
        bestTarget = el;
        break;
      }
    }
  }

  // Smoothly center the element on screen, highlight it, and auto-open it
  if (bestTarget) {
    bestTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bestTarget.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    bestTarget.style.boxShadow = '0 0 18px rgba(0, 150, 255, 0.7)';
    bestTarget.style.transform = 'scale(1.03)';

    // Automatically click and open the tool after smooth scroll completes
    setTimeout(() => {
      bestTarget.click();
    }, 450);

    // Remove focus styles smoothly
    setTimeout(() => {
      bestTarget.style.boxShadow = '';
      bestTarget.style.transform = '';
    }, 1800);
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

  // Handle user manual toggle off
  if (isListening && globalRecognition) {
    shouldRestart = false; // Disable auto-restart
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

  // Set recognition language based on user's device/browser settings
  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

  let hasGreeted = false;

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";

    // Speak initial greeting once per mic activation
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

      // Smoothly scroll and auto-open matched tool
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
    // Automatically restart recognition unless explicitly stopped by the user
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
// 1. Category Filter Logic
// ==========================================
function filterCategory(category, buttonElement) {
  // Update active chip state
  document.querySelectorAll('.filter-chips-container .chip').forEach(btn => btn.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  const cards = document.querySelectorAll('.tool-card, .popular-card, [data-tool]');
  cards.forEach(card => {
    const cardText = (card.innerText || card.textContent || '').toLowerCase();
    const cardCat = (card.getAttribute('data-cat') || '').toLowerCase();
    const targetCat = category.toLowerCase();

    if (targetCat === 'all') {
      card.style.display = '';
    } else {
      // Matches either data-cat attribute or category in text
      const isMatch = cardCat.includes(targetCat) || cardText.includes(targetCat);
      card.style.display = isMatch ? '' : 'none';
    }
  });
}

// ==========================================
// 2. Recently Used Tools (LocalStorage)
// ==========================================
function trackToolUsage(toolName, toolUrl) {
  let recent = JSON.parse(localStorage.getItem('docucraft_recent_tools') || '[]');
  recent = recent.filter(t => t.name !== toolName); // Remove duplicates
  recent.unshift({ name: toolName, url: toolUrl }); // Add to front
  if (recent.length > 4) recent.pop(); // Keep top 4
  localStorage.setItem('docucraft_recent_tools', JSON.stringify(recent));
  renderRecentTools();
}

function renderRecentTools() {
  const container = document.getElementById('recentToolsSection');
  const grid = document.getElementById('recentToolsGrid');
  if (!container || !grid) return;

  const recent = JSON.parse(localStorage.getItem('docucraft_recent_tools') || '[]');
  if (recent.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  grid.innerHTML = recent.map(tool => `
    <a href="${tool.url}" class="recent-chip" style="
      display: flex; 
      align-items: center; 
      gap: 8px; 
      padding: 10px 14px; 
      background: rgba(255,255,255,0.06); 
      border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 12px; 
      text-decoration: none; 
      color: #fff; 
      font-size: 13px;
      transition: all 0.2s ease;">
      ⚡ <span>${tool.name}</span>
    </a>
  `).join('');
}

function clearRecentTools() {
  localStorage.removeItem('docucraft_recent_tools');
  renderRecentTools();
}

// Listen to all tool clicks automatically to update Recent list
document.addEventListener('DOMContentLoaded', () => {
  renderRecentTools();

  document.querySelectorAll('a[href*=".html"], .tool-card').forEach(link => {
    link.addEventListener('click', function() {
      const toolName = this.querySelector('h3, h4, .tool-title')?.innerText || this.innerText.split('\n')[0];
      const toolUrl = this.getAttribute('href') || window.location.href;
      if (toolName && toolUrl && toolUrl !== '#') {
        trackToolUsage(toolName.trim(), toolUrl);
      }
    });
  });
});
// Category Filter Logic
function filterCategory(category, element) {
    // Update active state on buttons
    document.querySelectorAll('.filter-chips-container .chip').forEach(btn => {
        btn.classList.remove('active');
    });
    if (element) element.classList.add('active');

    // Filter tool cards
    const cards = document.querySelectorAll('.tool-card, .popular-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCategory.toLowerCase().includes(category.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
