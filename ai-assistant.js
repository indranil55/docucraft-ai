/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;

// সাইটের সমস্ত টুলের নলেজবেস
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

// ব্রাউজারের ভয়েস লোড করা
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// ভয়েস অন/অফ টগল
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

// বিশ্বব্যাপী যেকোনো টেক্সটের ভাষা স্বয়ংক্রিয়ভাবে শনাক্ত ও অনুবাদ
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
    console.error("Translation Error:", err);
    return { text: text, detected: 'en' };
  }
}

// যে ভাষায় কথা বলা হয়েছে, ঠিক সেই ভাষার কণ্ঠে উত্তর শোনানো
function speakResponseInNativeLanguage(text, langCode) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  if (availableVoices.length > 0) {
    // সঠিক ল্যাঙ্গুয়েজ কোডের ভয়েস নির্বাচন (যেমন: bn, hi, en, es, ar, fr ইত্যাদি)
    const matchedVoice = availableVoices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(langCode.toLowerCase().split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

// ব্যবহারকারীর প্রশ্নের মূল উত্তর তৈরি
function generateCoreResponse(englishQuery) {
  const q = englishQuery.toLowerCase().trim();

  if (/^(hi|hello|hey|greetings|namaste)/i.test(q)) {
    return "Hello! I am DocuCraft AI Smart Assistant. We have over 50 free web tools including PDF editors, image resizers, and financial calculators. Which tool do you need help with?";
  }

  if (q.includes('all tools') || q.includes('how many') || q.includes('list') || q.includes('total')) {
    return `DocuCraft AI provides ${siteKnowledgeBase.length} browser-based tools across PDF editing, exam photo/sign resizing, financial calculators, and utility converters.`;
  }

  const matched = siteKnowledgeBase.find(tool => 
    q.includes(tool.name.toLowerCase()) || 
    tool.desc.toLowerCase().includes(q)
  );

  if (matched) {
    return `${matched.name}: ${matched.desc}. You can find and open this tool directly from our homepage.`;
  }

  if (q.includes('pdf')) {
    return "DocuCraft AI offers Merge PDF, Compress PDF, Split, Repair corrupted PDF, Word to PDF, Excel to PDF, OCR Extractor, Sign, and Protect PDF.";
  }
  if (q.includes('photo') || q.includes('image') || q.includes('sign') || q.includes('kb')) {
    return "For images, we have Photo & Sign KB Resizer, Exam Resizer (SSC/UPSC), Passport Photo Sheet Maker, and Digital Signature Pad.";
  }
  if (q.includes('calculator') || q.includes('loan') || q.includes('money') || q.includes('tax')) {
    return "For finance, you can use our Scientific Calculator, Loan EMI, Prepayment Saver, GST, SIP, PPF, and Salary Calculators.";
  }

  return "I can guide you to any tool on DocuCraft AI. Let me know what you want to do (such as PDF editing, photo resizing, or calculating loan EMI).";
}

// চ্যাটে পাঠানো যেকোনো ভাষার মেসেজ প্রসেস করা
async function processSmartAssistantMessage(userMessage) {
  if (!userMessage || !userMessage.trim()) return "";

  // ১. ব্যবহারকারীর ভাষা শনাক্ত এবং তা ইংরেজিতে রূপান্তর
  const translatedInput = await translateUniversal(userMessage, 'en', 'auto');
  const userLang = translatedInput.detected || 'en';
  const englishQuery = translatedInput.text;

  // ২. মূল উত্তর তৈরি
  const englishReply = generateCoreResponse(englishQuery);

  // ৩. ব্যবহারকারীর নিজস্ব ভাষায় উত্তরটি অনুবাদ
  let finalReply = englishReply;
  if (userLang !== 'en') {
    const translatedOutput = await translateUniversal(englishReply, userLang, 'en');
    finalReply = translatedOutput.text;
  }

  // ৪. সেই নির্দিষ্ট ভাষার ভয়েসে পড়ে শোনানো
  speakResponseInNativeLanguage(finalReply, userLang);

  return finalReply;
}

// বিশ্বব্যাপী যেকোনো ভাষার জন্য ভয়েস ইনপুট (Microphone / Speech Recognition)
function toggleVoiceInput(inputElementId, callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
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
  // ব্যবহারকারীর ডিভাইসের বর্তমান লোকাল ভাষা স্বয়ংক্রিয়ভাবে নির্ধারণ করবে
  globalRecognition.lang = navigator.language || 'en-US';

  globalRecognition.onstart = function() {
    isListening = true;
    console.log("Listening in native tongue...");
  };

  globalRecognition.onresult = function(event) {
    const spokenTranscript = event.results[0][0].transcript;
    const inputField = document.getElementById(inputElementId);
    if (inputField) {
      inputField.value = spokenTranscript;
    }
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
