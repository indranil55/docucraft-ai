/* =========================================================
   DocuCraft AI - English Headings with Native Voice Support
   Universal Mobile & Desktop Browser Compatibility
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let audioUnlocked = false;

// 1. Center Floating AI Card HUD (Heading Always in English)
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
  // হেডিং সবসময় ইংরেজিতে থাকবে
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

function speakText(text, langCode = 'bn-IN', onComplete) {
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
    const targetPrefix = (langCode || 'bn').toLowerCase().split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(targetPrefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  let hasExecuted = false;
  const finish = () => {
    if (!hasExecuted) {
      hasExecuted = true;
      if (typeof onComplete === 'function') onComplete();
    }
  };

  utterance.onend = finish;
  utterance.onerror = finish;
  setTimeout(finish, 1200);

  window.speechSynthesis.speak(utterance);
}

// 3. Complete Knowledge Base (Headings in English)
const siteKnowledgeBase = [
  { name: "Scientific Calculator", keywords: ["calculator", "scientific calculator", "math", "ক্যালকুলেটর", "হিসাব"], file: "calculator.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "typing speed", "টাইপিং টেস্ট", "type test"], file: "typing-test.html" },
  { name: "Internet Speed Test", keywords: ["internet speed", "speed test", "net speed", "wifi speed", "নেট স্পিড"], file: "speed-test.html" },
  { name: "Merge PDF", keywords: ["merge", "pdf merge", "merge pdf", "পিডিএফ জোড়া", "যুক্ত", "combine"], file: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "split pdf", "ভাগ", "কাটা", "স্প্লিট"], file: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "compress pdf", "কম্প্রেস", "সাইজ কমানো"], file: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "স্ক্যানার", "স্ক্যান"], file: "pdf-scanner.html" },
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
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "রিসাইজার"], file: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "চাকরির ছবি"], file: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "পাসপোর্ট ছবি"], file: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "ডিজিটাল সই"], file: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], file: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "কালার পিকার"], file: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "থাম্বনেইল"], file: "youtube-thumbnail.html" },
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
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ"], file: "land-converter.html" },
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ"], file: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], file: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "টেক্সট টু স্পিচ"], file: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "নোটপ্যাড"], file: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], file: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], file: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], file: "exam-eligibility.html" },
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

// 4. Safe Tool Opener (English Heading on Card, Natural Voice Feedback)
function openRequestedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const cleanQuery = raw
    .replace(/(open|show|find|go to|launch|please|tool|bring|give me|start|খুলুন|খোল|চালু করো|দেখাও|দাও)/gi, ' ')
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
      if (cleanQuery === kwLower) score += 150;
      else if (raw.includes(kwLower)) score += 80;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  if (bestMatchedItem && maxScore >= 80) {
    const replyVoice = `${bestMatchedItem.name} খোলা হচ্ছে...`;
    
    // হেডিং সবসময় খাঁটি ইংরেজিতে থাকবে (DocuCraft AI এর মূল নাম)
    showCenterAICard(raw, replyVoice, bestMatchedItem.name);

    const fileSlug = bestMatchedItem.file.toLowerCase().replace('.html', '');
    const pageLink = Array.from(document.querySelectorAll('a[href]')).find(el => {
      const h = el.getAttribute('href').toLowerCase();
      return h.includes(fileSlug);
    });

    const executeNavigation = () => {
      hideCenterAICard();
      if (pageLink) {
        pageLink.click();
      } else {
        const fullUrl = `${window.location.origin}/${bestMatchedItem.file}`;
        window.location.href = fullUrl;
      }
    };

    speakText(replyVoice, 'bn-IN', executeNavigation);
    setTimeout(executeNavigation, 1200);

  } else {
    const notFound = "দুঃখিত, এই টুলটি বুঝতে পারিনি। দয়া করে স্পষ্ট করে বলুন।";
    // হেডিং ইংরেজিতে
    showCenterAICard(raw, notFound, "DocuCraft AI");
    speakText(notFound, 'bn-IN', () => {
      setTimeout(hideCenterAICard, 2500);
    });
  }
}

// 5. Voice Recognition Handler
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported. Please use Google Chrome.");
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
  globalRecognition.lang = 'bn-IN'; // বাংলা ও ইংরেজি মিক্সড ভয়েস রিসিভ করবে

  const greeting = "বলুন, কোন টুলটি খুলতে চান?";
  // হেডিং ইংরেজিতে (Indranil AI)
  showCenterAICard('', greeting, 'Indranil AI');
  speakText(greeting, 'bn-IN', () => {
    try {
      globalRecognition.start();
    } catch (e) {
      console.warn("Speech recognition notice:", e);
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
