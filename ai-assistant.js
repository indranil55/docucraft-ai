/* =========================================================
   DocuCraft AI - Universal Global Multi-Language Voice Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let hasSpokenWelcome = false;

// Complete Database of Site Tools
const siteKnowledgeBase = [
  // Document & PDF Tools
  { id: "merge-pdf", name: "Merge PDF / Document Scanner & Merger", cat: "PDF", desc: "Combines multiple PDF files or scanned pages into a single document." },
  { id: "split-pdf", name: "Split PDF / PDF Page Rotator & Splitter", cat: "PDF", desc: "Separates specific pages or cuts large PDF documents into smaller parts." },
  { id: "compress-pdf", name: "Compress PDF", cat: "PDF", desc: "Reduces PDF file size while maintaining high visual quality." },
  { id: "ocr-scanner", name: "PDF Scanner & Enhancer", cat: "PDF", desc: "Enhances photo contrast and creates clean scanned PDF documents." },
  { id: "zip-pdf", name: "ZIP to PDF Converter", cat: "PDF", desc: "Extracts images or documents inside a ZIP file and converts them to PDF." },
  { id: "repair-pdf", name: "Repair PDF (Fix Corrupted File)", cat: "PDF", desc: "Repairs damaged or unreadable PDF files and rebuilds stream structures." },
  { id: "organize-pdf", name: "Organize / Reorder Pages", cat: "PDF", desc: "Rearranges, reorders, or sequences pages in a PDF document." },
  { id: "rotate-pdf", name: "Rotate PDF", cat: "PDF", desc: "Rotates upside-down or sideways PDF pages by 90, 180, or 270 degrees." },
  { id: "delete-pdf", name: "Delete PDF Pages", cat: "PDF", desc: "Removes unwanted, blank, or defective pages from PDF files." },
  { id: "img-to-pdf", name: "JPG / PNG to PDF", cat: "PDF", desc: "Converts images and photo gallery files into standard A4 PDF pages." },
  { id: "word-to-pdf", name: "Word to PDF (Docx to PDF)", cat: "PDF", desc: "Converts Microsoft Word documents directly into standardized PDF format." },
  { id: "excel-to-pdf", name: "Excel to PDF (XLS/XLSX)", cat: "PDF", desc: "Converts Excel spreadsheets and data tables into printable PDFs." },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF (PPT/PPTX)", cat: "PDF", desc: "Converts PowerPoint presentation decks and slides into portable PDF files." },
  { id: "html-to-pdf", name: "HTML to PDF Converter", cat: "PDF", desc: "Converts raw HTML markup code or snippets into downloadable PDF pages." },
  { id: "pdf-to-img", name: "PDF to JPG / PNG", cat: "PDF", desc: "Extracts PDF document pages into high-resolution individual images." },
  { id: "pdf-to-word", name: "PDF to Word (DOCX)", cat: "PDF", desc: "Transforms PDF files into fully editable Microsoft Word documents." },
  { id: "pdf-to-excel", name: "PDF to Excel (XLSX)", cat: "PDF", desc: "Extracts table data from PDF documents directly into Excel sheets." },
  { id: "pdf-to-text", name: "PDF to Text (OCR Extractor)", cat: "PDF", desc: "Extracts selectable and editable text from scanned images or book pages." },
  { id: "edit-pdf", name: "Edit PDF", cat: "PDF", desc: "Adds text annotations, signatures, or notes onto PDF documents." },
  { id: "sign-pdf", name: "Sign PDF", cat: "PDF", desc: "Adds personal digital signatures or verification stamps to documents." },
  { id: "watermark-pdf", name: "Watermark PDF / Watermark Generator", cat: "PDF", desc: "Stamps custom text watermarks across document pages." },
  { id: "protect-pdf", name: "Protect / Lock PDF", cat: "PDF", desc: "Encrypts PDF files with a secret password to prevent unauthorized viewing." },
  { id: "unlock-pdf", name: "Unlock PDF", cat: "PDF", desc: "Removes password security and restrictions from unlocked PDF files." },
  { id: "page-numbers", name: "Add Page Numbers", cat: "PDF", desc: "Adds page numbers at the bottom center of each PDF page." },

  // Cyber & Photo Tools
  { id: "kb-resizer", name: "Photo & Sign KB / MB Resizer", cat: "Cyber", desc: "Compresses images precisely to target KB or MB limits for job forms." },
  { id: "exam-resizer", name: "Exam Photo & Signature Resizer", cat: "Cyber", desc: "Resizes photos and signatures according to exam board dimensions (SSC, UPSC, NEET)." },
  { id: "passport-maker", name: "Passport Photo Sheet Maker", cat: "Cyber", desc: "Arranges passport photo grids on an A4 sheet for direct printing." },
  { id: "sign-pad", name: "Digital Signature Maker (Sign Pad)", cat: "Cyber", desc: "Lets users draw signatures on screen and download transparent PNG files." },
  { id: "qr-generator", name: "QR Code & UPI Generator", cat: "Cyber", desc: "Creates instant QR codes for payment links, UPI IDs, and URLs." },
  { id: "color-picker", name: "Color Picker & HEX Extractor", cat: "Cyber", desc: "Uploads pictures to grab exact HEX, RGB, and HSL color values." },
  { id: "yt-thumbnail", name: "YouTube Thumbnail Downloader", cat: "Cyber", desc: "Downloads full resolution HD and 4K thumbnails from YouTube video links." },

  // Finance & Calculator Tools
  { id: "scientific-calculator", name: "DocuCraft AI Scientific Calculator", cat: "Calculator", desc: "Scientific calculator with trigonometry, calculus, algebra, and math functions." },
  { id: "loan-emi", name: "Loan EMI Calculator", cat: "Finance", desc: "Calculates monthly EMI, total interest, and complete loan repayment charts." },
  { id: "loan-prepayment", name: "Loan Prepayment & Interest Saver", cat: "Finance", desc: "Calculates how much money and time you save with extra prepayments." },
  { id: "gst-calculator", name: "GST Calculator", cat: "Finance", desc: "Calculates 5%, 12%, 18%, and 28% GST inclusive and exclusive prices." },
  { id: "sip-calculator", name: "SIP Calculator", cat: "Finance", desc: "Calculates expected wealth and return growth for mutual fund investments." },
  { id: "interest-calculator", name: "Simple & Compound Interest", cat: "Finance", desc: "Calculates simple interest and quarterly compounded interest." },
  { id: "fd-rd-calculator", name: "FD & RD Maturity Calculator", cat: "Finance", desc: "Calculates maturity returns on bank fixed and recurring deposits." },
  { id: "gold-calculator", name: "Gold & Jewellery Price Calculator", cat: "Finance", desc: "Calculates gold jewelry prices with making charges and 3% GST." },
  { id: "inflation-calculator", name: "Inflation & Future Value Calculator", cat: "Finance", desc: "Forecasts future product costs and purchasing power degradation." },
  { id: "ppf-calculator", name: "PPF Calculator", cat: "Finance", desc: "Calculates 15-year Public Provident Fund returns and tax-free maturity." },
  { id: "electricity-calculator", name: "Electricity Bill & Power Calculator", cat: "Utility", desc: "Calculates appliance power consumption, kWh units, and electricity bill." },
  { id: "fuel-calculator", name: "Fuel Cost & Trip Mileage Calculator", cat: "Utility", desc: "Calculates total fuel needed and overall trip costs based on vehicle mileage." },
  { id: "salary-calculator", name: "Take-Home Salary & CTC Calculator", cat: "Finance", desc: "Calculates in-hand monthly salary deducting EPF, PT, and TDS." },
  { id: "bill-split", name: "Friend Bill Split & Tip Calculator", cat: "Finance", desc: "Splits group bills equally including tip percentages." },
  { id: "discount-calculator", name: "Discount & Sale Calculator", cat: "Finance", desc: "Calculates final prices and total savings after applying discounts." },
  { id: "percentage-calculator", name: "Percentage Calculator", cat: "Finance", desc: "Finds percentage values, increases, decreases, and exam marks." },
  { id: "number-to-words", name: "Number to Words (Cheque Amount)", cat: "Finance", desc: "Converts numeric amounts to bank cheque wording format." },
  { id: "land-converter", name: "Land Area Converter", cat: "Utility", desc: "Converts land between Bigha, Katha, Chhatak, Acre, Decimil, and Square Feet." },

  // Utilities & Productivity
  { id: "translator", name: "DocuCraft AI Translator", cat: "Utility", desc: "Translates text and paragraphs into all world languages instantly." },
  { id: "voice-typing", name: "Pitch to Text (Voice Typing)", cat: "Utility", desc: "Converts voice speech through the microphone into editable text." },
  { id: "text-to-speech", name: "Text-to-Speech Converter", cat: "Utility", desc: "Speaks any text out loud with natural voice audio." },
  { id: "notepad", name: "Unlimited Text Notepad", cat: "Generator", desc: "Provides notepad capability for 100,000+ lines of text." },
  { id: "job-alerts", name: "Govt Job Alerts & Results", cat: "Jobs", desc: "Provides latest notifications from Sarkari Result, NTA, and job portals." },
  { id: "age-calculator", name: "Age Calculator (Exam DOB)", cat: "Utility", desc: "Calculates exact age in years, months, and days for exam forms." },
  { id: "age-eligibility", name: "Exam Age Eligibility Checker", cat: "Utility", desc: "Checks if a candidate falls within age limits for job notifications." },
  { id: "typing-test", name: "1-Minute Typing Speed Test", cat: "Utility", desc: "Measures typing speed in Words Per Minute (WPM) and accuracy." },
  { id: "calorie-calculator", name: "Daily Calorie & BMR Calculator", cat: "Health", desc: "Calculates daily calorie requirements and basal metabolic rates." },
  { id: "water-intake", name: "Daily Water Intake Goal", cat: "Health", desc: "Calculates recommended daily water drinking amounts in liters." },
  { id: "sleep-calculator", name: "Sleep Calculator", cat: "Health", desc: "Calculates optimal bedtimes based on 90-minute sleep cycles." },
  { id: "barcode-generator", name: "Barcode Generator (Code 128)", cat: "Generator", desc: "Generates standard printable barcodes in PNG format." },
  { id: "base64-tool", name: "Base64 Encoder & Decoder", cat: "Generator", desc: "Encodes plain text into Base64 format and decodes it back." },
  { id: "password-generator", name: "Random Password & PIN Generator", cat: "Security", desc: "Generates high security random passwords and passphrases." },
  { id: "unit-converter", name: "Universal Unit Converter", cat: "Utility", desc: "Converts length, weight, and temperature units." },
  { id: "duplicate-remover", name: "Duplicate Line Remover", cat: "Generator", desc: "Removes duplicate repeated lines from lists with one click." },
  { id: "text-reverse", name: "Text Reverse & Flip Tool", cat: "Utility", desc: "Reverses letters, words, and flips text strings." },
  { id: "cgpa-calculator", name: "Marks to Percentage & CGPA", cat: "Utility", desc: "Converts academic marks and CGPA into percentage scores." },
  { id: "grade-calculator", name: "Average & Grade Calculator", cat: "Utility", desc: "Calculates average scores and letter grades across subjects." },
  { id: "invoice-generator", name: "Invoice / Bill Generator", cat: "Generator", desc: "Builds clean billing receipts and customer invoices." },
  { id: "resume-maker", name: "Resume / CV Maker to PDF", cat: "Generator", desc: "Builds curriculum vitae and resumes ready for job applications." },
  { id: "prescription-maker", name: "Prescription / Memo Maker", cat: "Generator", desc: "Creates digital prescriptions and diagnostic memos." },
  { id: "support-desk", name: "Contact & Support Desk", cat: "Support", desc: "Direct contact form to send questions or report issues." }
];

// Initialize and Load Available System Voices
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// Toggle Voice Output State
function toggleVoiceOutput() {
  isVoiceOutputEnabled = !isVoiceOutputEnabled;
  const btn = document.getElementById('voiceToggleBtn');
  if (btn) {
    btn.innerHTML = isVoiceOutputEnabled 
      ? '<i class="fa-solid fa-volume-high"></i> Voice ON' 
      : '<i class="fa-solid fa-volume-xmark"></i> Voice OFF';
  }
  if (!isVoiceOutputEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Universal Translation and Language Detection Engine
async function translateUniversal(text, targetLang = 'en', sourceLang = 'auto') {
  if (!text || text.trim() === '') return { text: '', detected: 'en' };
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0].map(item => item[0]).join('');
    const detectedLang = data[2] || 'en';
    return { text: translatedText, detected: detectedLang };
  } catch (err) {
    console.error("Translation Engine Error:", err);
    return { text: text, detected: 'en' };
  }
}

// Native Speech Output Controller
function speakResponseInNativeLanguage(text, langCode) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  if (availableVoices.length > 0) {
    const primaryCode = langCode.toLowerCase().split('-')[0];
    const matchedVoice = availableVoices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(primaryCode)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

// Central Interactive Modal Window for Opened Tools
function openToolModal(tool) {
  let modalOverlay = document.getElementById('docuCraftToolModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'docuCraftToolModalOverlay';
    modalOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; z-index: 999999;
      animation: fadeIn 0.25s ease-out;
    `;
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div style="
      background: #ffffff; width: 92%; max-width: 620px; border-radius: 18px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden;
      display: flex; flex-direction: column; font-family: system-ui, -apple-system, sans-serif;
    ">
      <!-- Modal Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; padding: 22px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <span style="background: rgba(255,255,255,0.25); padding: 4px 12px; font-size: 11px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${tool.cat}</span>
          <h2 style="margin: 8px 0 0 0; font-size: 21px; font-weight: 700;">${tool.name}</h2>
        </div>
        <button onclick="closeToolModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 22px; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; line-height: 1;">
          &times;
        </button>
      </div>

      <!-- Modal Body -->
      <div style="padding: 24px; color: #374151;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 18px 0; color: #4b5563;">${tool.desc}</p>
        
        <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 28px; text-align: center;">
          <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 32px; color: #6366f1; margin-bottom: 10px; display: block;"></i>
          <p style="margin: 0; font-weight: 600; color: #1e293b;">${tool.name} Workspace Ready</p>
          <small style="color: #64748b; display: block; margin-top: 4px;">Click the button below to launch full screen tool.</small>
        </div>
      </div>

      <!-- Modal Footer -->
      <div style="background: #f8fafc; padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0;">
        <button onclick="closeToolModal()" style="padding: 10px 18px; background: #e2e8f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; color: #334155;">Close</button>
        <button onclick="window.location.hash = '${tool.id}'; closeToolModal();" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Open Tool</button>
      </div>
    </div>
  `;
  modalOverlay.style.display = 'flex';
}

function closeToolModal() {
  const modalOverlay = document.getElementById('docuCraftToolModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
  }
}

// Tool Matching Algorithm
function findMatchingTool(englishQuery) {
  const q = englishQuery.toLowerCase().trim();

  return siteKnowledgeBase.find(tool => {
    const toolName = tool.name.toLowerCase();
    const toolId = tool.id.toLowerCase().replace(/-/g, ' ');
    const toolDesc = tool.desc.toLowerCase();

    return q.includes(toolName) ||
           toolName.split(' ').some(word => word.length > 3 && q.includes(word)) ||
           q.includes(toolId) ||
           toolDesc.includes(q);
  });
}

// Intelligent Multilingual Intent & Command Processing
async function processSmartAssistantMessage(userSpokenText) {
  if (!userSpokenText || !userSpokenText.trim()) return "";

  // 1. Detect language and translate into English query
  const translationToEng = await translateUniversal(userSpokenText, 'en', 'auto');
  const userLangCode = translationToEng.detected || 'en';
  const englishQuery = translationToEng.text.toLowerCase();

  let englishReply = "";
  const matchedTool = findMatchingTool(englishQuery);

  if (matchedTool) {
    // Open central modal window
    setTimeout(() => {
      openToolModal(matchedTool);
    }, 400);

    englishReply = `Opening ${matchedTool.name}. You can now start using this tool.`;
  } else if (/^(hi|hello|hey|namaste|salam)/i.test(englishQuery)) {
    englishReply = "Hello! I am DocuCraft AI Smart Voice Assistant. Tell me which tool you want to open!";
  } else {
    englishReply = `I heard "${userSpokenText}". We have over 75 tools for PDF, image resizing, and financial calculations. Which one would you like to open?`;
  }

  // 2. Translate response back to the user's spoken language
  let finalSpokenReply = englishReply;
  if (userLangCode !== 'en') {
    const translationBack = await translateUniversal(englishReply, userLangCode, 'en');
    finalSpokenReply = translationBack.text;
  }

  // 3. Output speech in the user's native tongue
  speakResponseInNativeLanguage(finalSpokenReply, userLangCode);

  return finalSpokenReply;
}

// Ensure Global Language Selector Dropdown is Mounted
function ensureLanguageSelectorUI() {
  if (document.getElementById('docuCraftLangSelect')) return;

  const selector = document.createElement('select');
  selector.id = 'docuCraftLangSelect';
  selector.style.cssText = `
    padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1;
    font-size: 13px; background: white; cursor: pointer; margin-right: 8px;
    font-family: inherit; outline: none;
  `;

  selector.innerHTML = `
    <option value="auto">🌐 Auto (Browser Default)</option>
    <option value="bn-IN">বাংলা (Bengali)</option>
    <option value="en-US">English (US)</option>
    <option value="hi-IN">हिन्दी (Hindi)</option>
    <option value="es-ES">Español (Spanish)</option>
    <option value="ar-SA">العربية (Arabic)</option>
    <option value="fr-FR">Français (French)</option>
    <option value="de-DE">Deutsch (German)</option>
    <option value="pt-BR">Português (Portuguese)</option>
    <option value="ru-RU">Русский (Russian)</option>
    <option value="zh-CN">中文 (Chinese)</option>
    <option value="ja-JP">日本語 (Japanese)</option>
  `;

  // Attach selector before voice search input if available
  const voiceSearchInput = document.querySelector('input[type="search"], #voiceSearchInput, #searchInput');
  if (voiceSearchInput && voiceSearchInput.parentNode) {
    voiceSearchInput.parentNode.insertBefore(selector, voiceSearchInput);
  }
}
document.addEventListener('DOMContentLoaded', ensureLanguageSelectorUI);

// Global Voice Input Handler via Speech Recognition
function toggleVoiceInput(inputElementId, callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
    return;
  }

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    return;
  }

  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;

  // Set Language: manual selection from dropdown or device default
  const langDropdown = document.getElementById('docuCraftLangSelect');
  if (langDropdown && langDropdown.value !== 'auto') {
    globalRecognition.lang = langDropdown.value;
  } else {
    globalRecognition.lang = navigator.language || navigator.userLanguage || 'en-US';
  }

  globalRecognition.onstart = function() {
    isListening = true;
    console.log(`Listening for voice in language: ${globalRecognition.lang}`);
  };

  globalRecognition.onresult = async function(event) {
    const spokenTranscript = event.results[0][0].transcript;
    
    const inputField = document.getElementById(inputElementId);
    if (inputField) {
      inputField.value = spokenTranscript;
    }

    // Process spoken input across all world languages
    await processSmartAssistantMessage(spokenTranscript);

    if (typeof callback === 'function') {
      callback(spokenTranscript);
    }
  };

  globalRecognition.onerror = function(event) {
    console.error("Speech Recognition Error:", event.error);
    isListening = false;
  };

  globalRecognition.onend = function() {
    isListening = false;
  };

  globalRecognition.start();
}
