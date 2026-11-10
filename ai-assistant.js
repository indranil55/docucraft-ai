/* =========================================================
   DocuCraft AI - Complete 100% Tools Multilingual Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let currentUtterance = null;
let autoRedirectTimer = null;

// URL Validator to resolve CodeQL Security Incomplete URL scheme check
function isSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (trimmed === '' || trimmed === '#' || trimmed.toLowerCase().startsWith('javascript:')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// 1. System Voices Loader
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// 2. Center Floating AI Card UI (Mobile & Laptop)
function showCenterAICard(userQuery, aiReply, toolName = '', targetUrl = '') {
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
    modal.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    modal.innerHTML = `
      <div style="display: flex; justify-content: center; margin-bottom: 12px;">
        <div id="aiOrb" style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); animation: aiPulse 1.8s infinite ease-in-out;"></div>
      </div>
      <div id="aiUserText" style="font-size: 13px; color: #94a3b8; margin-bottom: 6px; font-style: italic;"></div>
      <div id="aiToolHeader" style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;"></div>
      <div id="aiReplyText" style="font-size: 14.5px; line-height: 1.5; color: #f1f5f9; margin-bottom: 14px;"></div>
      <div id="aiActionBtnContainer"></div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(236, 72, 153, 0.8); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  const userElem = document.getElementById('aiUserText');
  const toolElem = document.getElementById('aiToolHeader');
  const replyElem = document.getElementById('aiReplyText');
  const btnContainer = document.getElementById('aiActionBtnContainer');

  if (userQuery) userElem.innerText = `“${userQuery}”`;
  toolElem.innerText = toolName || "DocuCraft AI";
  replyElem.innerText = aiReply;

  if (isSafeUrl(targetUrl)) {
    btnContainer.innerHTML = `
      <a href="${targetUrl}" style="display: inline-block; padding: 8px 18px; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; text-decoration: none; border-radius: 20px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">
        Open Tool →
      </a>
    `;
  } else {
    btnContainer.innerHTML = '';
  }

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

// 3. Multi-Device Speech Function
function speakAndDisplay(userQuery, text, langCode = 'en-US', toolName = '', targetUrl = '') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (isSafeUrl(targetUrl)) window.location.href = targetUrl;
    return;
  }
  
  window.speechSynthesis.cancel();
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);

  showCenterAICard(userQuery, text, toolName, targetUrl);

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.95;
  currentUtterance.pitch = 1.0;
  currentUtterance.lang = langCode;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const target = (langCode || 'en').toLowerCase().split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(target)
    );
    if (matchedVoice) {
      currentUtterance.voice = matchedVoice;
    }
  }

  currentUtterance.onend = function() {
    autoRedirectTimer = setTimeout(() => {
      hideCenterAICard();
      if (isSafeUrl(targetUrl)) {
        window.location.href = targetUrl;
      }
    }, 600);
  };

  currentUtterance.onerror = function() {
    hideCenterAICard();
    if (isSafeUrl(targetUrl)) {
      window.location.href = targetUrl;
    }
  };

  window.speechSynthesis.speak(currentUtterance);
}

// 4. Language Detection
function detectLanguage(text) {
  if (!text) return 'en-US';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 5. Complete Tool Catalog
const siteKnowledgeBase = [
  { 
    name: "Merge PDF", 
    desc_bn: "এটি পিডিএফ মার্জার। এখানে একাধিক পিডিএফ ফাইল জোড়া দিয়ে একটি ফাইল করতে পারবেন।",
    desc_hi: "यह पीडीएफ मर्ज टूल है। यहाँ कई पीडीएफ फाइलों को एक साथ जोड़ सकते हैं।",
    desc_en: "This is Merge PDF. Combine multiple PDF documents into a single file.",
    keywords: ["merge", "scanner", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত", "jodo", "combine files"], 
    url: "merge-pdf.html" 
  },
  { 
    name: "Split PDF", 
    desc_bn: "এটি পিডিএফ স্প্লিট টুল। বড় পিডিএফ থেকে নির্দিষ্ট পেজ কেটে আলাদা করে নিতে পারেন।",
    desc_hi: "यह पीडीएफ स्प्लिट टूल है। आप पीडीएफ फाइलों के पेजों को अलग कर सकते हैं।",
    desc_en: "This is Split PDF. Extract and separate specific pages easily.",
    keywords: ["split", "separate", "tukde", "katna", "ভাগ", "কাটা", "splitter"], 
    url: "split-pdf.html" 
  },
  { 
    name: "Compress PDF", 
    desc_bn: "এটি পিডিএফ কম্প্রেসার। ফাইল কোয়ালিটি ঠিক রেখে সাইজ খুব সহজেই কমিয়ে নিতে পারবেন।",
    desc_hi: "यह पीडीएफ कंप्रेस टूल है। क्वालिटी ठीक रखकर फाइल साइज छोटा करें।",
    desc_en: "This is Compress PDF. Reduce file size while keeping visual quality intact.",
    keywords: ["compress", "reduce size", "chota karna", "সাইজ কমানো", "কম্প্রেস", "reduce file size"], 
    url: "compress-pdf.html" 
  },
  { 
    name: "PDF Scanner & Enhancer", 
    desc_bn: "এটি পিডিএফ স্ক্যানার। ডকুমেন্টের ছবি তুলে পরিষ্কার ও স্পষ্ট পিডিএফে রূপান্তর করুন।",
    desc_hi: "यह पीडीएफ स्कैनर है। दस्तावेज़ साफ़ और स्पष्ट स्कैन करें।",
    desc_en: "This is PDF Scanner & Enhancer to scan and sharpen documents.",
    keywords: ["scanner", "scan", "enhance", "स्कैनर", "স্ক্যানার", "scan documents"], 
    url: "pdf-scanner.html" 
  },
  { 
    name: "ZIP to PDF Converter", 
    desc_bn: "এটি জিপ টু পিডিএফ কনভার্টার। জিপ ফাইলে থাকা সব ডকুমেন্ট পিডিএফে পরিণত হবে।",
    desc_hi: "यह ज़िप टू पीडीएफ कनवर्टर है।",
    desc_en: "Convert ZIP archives into consolidated PDF documents.",
    keywords: ["zip to pdf", "zip converter", "জিপ"], 
    url: "zip-to-pdf.html" 
  },
  { 
    name: "Repair PDF", 
    desc_bn: "এটি পিডিএফ রিপেয়ার টুল। নষ্ট বা ওপেন না হওয়া ড্যামেজ পিডিএফ ঠিক করতে সাহায্য করে।",
    desc_hi: "यह पीडीएफ रिपेयर टूल है। खराब पीडीएफ फाइल को ठीक करें।",
    desc_en: "Repair and restore damaged or corrupted PDF documents.",
    keywords: ["repair", "fix", "theek karna", "মেরামত", "corrupt"], 
    url: "repair-pdf.html" 
  },
  { 
    name: "Organize / Reorder Pages", 
    desc_bn: "এটি পেজ অর্গানাইজার। পিডিএফের পেজগুলোর সিরিয়াল বা সাজানো নিজের ইচ্ছামতো বদলাতে পারেন।",
    desc_hi: "यह पेज रीऑर्डर टूल है। पीडीएफ पेजों का क्रम बदलें।",
    desc_en: "Rearrange, reorder, or sort PDF pages easily.",
    keywords: ["organize", "reorder", "pages sequence", "সাজানো"], 
    url: "organize-pdf.html" 
  },
  { 
    name: "Rotate PDF", 
    desc_bn: "এটি রোটেট পিডিএফ। উল্টো থাকা যেকোনো পিডিএফ পেজ ঘুরিয়ে সোজা করতে পারবেন।",
    desc_hi: "यह पीडीएफ रोटेट टूल है। उल्टे पेजों को घुमाकर सीधा करें।",
    desc_en: "Rotate PDF pages clockwise or counterclockwise.",
    keywords: ["rotate", "ghumaana", "ঘোরানো"], 
    url: "rotate-pdf.html" 
  },
  { 
    name: "Delete PDF Pages", 
    desc_bn: "এটি ডিলিট পেজেস টুল। পিডিএফ থেকে অপ্রয়োজনীয় যেকোনো পেজ বাদ দিতে পারবেন।",
    desc_hi: "यह पीडीएफ पेज रिमूवर है। गैर-जरूरी पेज हटाएं।",
    desc_en: "Permanently delete unwanted pages from PDF files.",
    keywords: ["delete", "remove pages", "hatao", "বাদ দেওয়া", "মুছে ফেলা"], 
    url: "delete-pdf.html" 
  },
  { 
    name: "JPG / PNG to PDF", 
    desc_bn: "এটি ছবি থেকে পিডিএফ কনভার্টার। যেকোনো ছবি বা ফটো এক ক্লিকে পিডিএফে বদলে নিতে পারবেন।",
    desc_hi: "यह फोटो से पीडीएफ कनवर्टर है। तस्वीरों को आसानी से पीडीएफ में बदलें।",
    desc_en: "Convert JPG and PNG images into high quality PDFs.",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "फोटो से पीडीएफ", "ছবি থেকে পিডিএফ"], 
    url: "jpg-to-pdf.html" 
  },
  { 
    name: "Word to PDF", 
    desc_bn: "এটি ওয়ার্ড টু পিডিএফ কনভার্টার। ডক ফাইল সরাসরি পিডিএফে কনভার্ট করতে পারেন।",
    desc_hi: "यह वर्ड टू पीडीएफ कनवर्टर है। वर्ड फाइल को सीधे पीडीएफ में बदलें।",
    desc_en: "Convert Word DOCX files directly into PDFs.",
    keywords: ["word to pdf", "docx to pdf", "word converter"], 
    url: "word-to-pdf.html" 
  },
  { 
    name: "Excel to PDF", 
    desc_bn: "এটি এক্সেল টু পিডিএফ। এক্সেল শিটকে সুরক্ষিত প্রিন্টেবল পিডিএফে পরিণত করুন।",
    desc_hi: "यह एक्सेल टू पीडीएफ कनवर्टर है।",
    desc_en: "Convert XLS and XLSX spreadsheet sheets to PDF.",
    keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], 
    url: "excel-to-pdf.html" 
  },
  { 
    name: "PowerPoint to PDF", 
    desc_bn: "এটি পাওয়ারপয়েন্ট টু পিডিএফ। প্রেজেন্টেশন স্লাইড পিডিএফে সেভ করতে ব্যবহার করুন।",
    desc_hi: "पावरपॉइंट स्लाइड्स को पीडीएफ में बदलें।",
    desc_en: "Convert PPT and PPTX presentation slides to PDF.",
    keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], 
    url: "powerpoint-to-pdf.html" 
  },
  { 
    name: "HTML to PDF Converter", 
    desc_bn: "এটি এইচটিএমএল টু পিডিএফ। যেকোনো ওয়েব পেজ বা কোড পিডিএফে ডাউনলোড করুন।",
    desc_hi: "वेबपेज को सीधे पीडीएफ में सेव करें।",
    desc_en: "Convert HTML codes and web pages directly to PDF.",
    keywords: ["html to pdf", "web to pdf"], 
    url: "html-to-pdf.html" 
  },
  { 
    name: "PDF to JPG / PNG", 
    desc_bn: "এটি পিডিএফ টু ফটো কনভার্টার। পিডিএফের পেজগুলোকে হাই রেজোলিউশন ছবিতে রূপান্তর করুন।",
    desc_hi: "पीडीएफ पेजों को हाई क्वालिटी फोटो में बदलें।",
    desc_en: "Extract and convert PDF pages into JPG or PNG pictures.",
    keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], 
    url: "pdf-to-jpg.html" 
  },
  { 
    name: "PDF to Word", 
    desc_bn: "এটি পিডিএফ টু ওয়ার্ড। পিডিএফ ফাইল এডিট করার জন্য ডকে রূপান্তর করতে পারবেন।",
    desc_hi: "पीडीएफ को एडिटेबल वर्ड फाइल में बदलें।",
    desc_en: "Convert PDF documents into editable Microsoft Word format.",
    keywords: ["pdf to word", "pdf to docx"], 
    url: "pdf-to-word.html" 
  },
  { 
    name: "PDF to Excel", 
    desc_bn: "এটি পিডিএফ টু এক্সেল। পিডিএফ টেবিল সরাসরি স্প্রেডশিটে কনভার্ট করুন।",
    desc_hi: "पीडीएफ टेबल को एक्सेल शीट में बदलें।",
    desc_en: "Extract PDF tables into editable Excel spreadsheets.",
    keywords: ["pdf to excel", "pdf to xlsx"], 
    url: "pdf-to-excel.html" 
  },
  { 
    name: "PDF to Text (OCR Extractor)", 
    desc_bn: "এটি ওসিআর টেক্সট এক্সট্রাক্টর। যেকোনো ডকুমেন্টের ছবি বা পিডিএফ থেকে ভেতরের লেখা কপি করুন।",
    desc_hi: "पीडीएफ या फोटो से सीधे लिखावट टेक्स्ट निकालें।",
    desc_en: "Extract plain editable text from scanned PDFs and photos.",
    keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], 
    url: "pdf-to-text.html" 
  },
  { 
    name: "Edit PDF", 
    desc_bn: "এটি পিডিএফ এডিটর। ফাইলে নতুন লেখা যোগ করতে বা কোনো পরিবর্তন করতে এটি কাজে লাগবে।",
    desc_hi: "पीडीएफ में नया टेक्स्ट लिखें और बदलाव करें।",
    desc_en: "Edit, annotate, and write text on your PDF documents.",
    keywords: ["edit pdf", "write on pdf", "এডিট"], 
    url: "edit-pdf.html" 
  },
  { 
    name: "Sign PDF", 
    desc_bn: "এটি সাইন পিডিএফ টুল। ডকুমেন্টের ওপর ডিজিটাল সই বসিয়ে নেওয়ার জন্য এটি ব্যবহার করুন।",
    desc_hi: "दस्तावेज़ों पर डिजिटल हस्ताक्षर लगाने के लिए।",
    desc_en: "Add your personal electronic and digital signatures to PDFs.",
    keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই"], 
    url: "sign-pdf.html" 
  },
  { 
    name: "Watermark PDF", 
    desc_bn: "এটি ওয়াটারমার্ক টুল। ডকুমেন্টে আপনার নাম বা লোগোর জলছাপ যুক্ত করে সুরক্ষিত করুন।",
    desc_hi: "पीडीएफ में अपना नाम या वॉटरमार्क जोड़ें।",
    desc_en: "Add custom text or image watermarks to protect your files.",
    keywords: ["watermark", "জলছাপ"], 
    url: "watermark-pdf.html" 
  },
  { 
    name: "Protect / Lock PDF", 
    desc_bn: "এটি পিডিএফ লক টুল। ফাইলে পাসওয়ার্ড দিয়ে সুরক্ষিত রাখতে এটি ব্যবহার করুন।",
    desc_hi: "पीडीएफ फाइल पर पासवर्ड लगाकर सुरक्षित करें।",
    desc_en: "Encrypt and set strong passwords on your PDF documents.",
    keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], 
    url: "protect-pdf.html" 
  },
  { 
    name: "Unlock PDF", 
    desc_bn: "এটি আনলক পিডিএফ। জানা পাসওয়ার্ড স্থায়ীভাবে সরিয়ে দিয়ে ফাইল মুক্ত করুন।",
    desc_hi: "पीडीएफ से पासवर्ड हटाएं।",
    desc_en: "Remove passwords and security restrictions from PDFs.",
    keywords: ["unlock", "remove password", "আনলক"], 
    url: "unlock-pdf.html" 
  },
  { 
    name: "Add Page Numbers", 
    desc_bn: "এটি পেজ নম্বর টুল। পিডিএফের প্রতিটি পেজে স্বয়ংক্রিয়ভাবে নম্বর যুক্ত করুন।",
    desc_hi: "पीडीएफ पेजों पर क्रम से पेज नंबर जोड़ें।",
    desc_en: "Add customized page numbering headers or footers to PDFs.",
    keywords: ["page numbers", "page number", "पेज नंबर", "পেজ নম্বর"], 
    url: "add-page-numbers.html" 
  },
  { 
    name: "Photo & Sign KB / MB Resizer", 
    desc_bn: "এটি ফটো ও সাইন রিসাইজার। সরকারি চাকরির ফর্মের জন্য নির্দিষ্ট কেবি বা এমবি সাইজ করতে পারেন।",
    desc_hi: "तय केबी साइज के अनुसार फोटो और साइन रीसाइज करें।",
    desc_en: "Compress and resize photo and signatures to exact KB file limits.",
    keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার", "ছবি রিসাইজ"], 
    url: "photo-resizer.html" 
  },
  { 
    name: "Exam Photo & Signature Resizer", 
    desc_bn: "এটি এক্সাম ফর্ম রিসাইজার। এসএসসি, রেল, টেট ও চাকরির পরীক্ষার সাইজ অনুযায়ী ফটো বানান।",
    desc_hi: "सरकारी परीक्षाओं के फॉर्म के लिए फोटो व साइन तैयार करें।",
    desc_en: "Pre-set dimensions and KB limits for SSC, UPSC, and exam forms.",
    keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], 
    url: "exam-resizer.html" 
  },
  { 
    name: "Passport Photo Sheet Maker", 
    desc_bn: "এটি পাসপোর্ট ফটো মেকার। সাধারণ ছবি দিয়ে এক ক্লিকে প্রিন্ট করার পাসপোর্ট সাইজ শিট তৈরি হবে।",
    desc_hi: "प्रिंट करने योग्य पासपोर्ट साइज फोटो शीट बनाएं।",
    desc_en: "Generate printable multi-grid passport photos in standard dimensions.",
    keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি"], 
    url: "passport-photo.html" 
  },
  { 
    name: "Digital Signature Maker (Sign Pad)", 
    desc_bn: "এটি ডিজিটাল সিগনেচার প্যাড। স্ক্রিনে সই করে স্বচ্ছ ব্যাকগ্রাউন্ডে পিএনজি ডাউনলোড করুন।",
    desc_hi: "स्क्रीन पर साइन बनाएं और पारदर्शी बैकग्राउंड में डाउनलोड करें।",
    desc_en: "Draw and generate transparent background signature PNGs.",
    keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], 
    url: "signature-maker.html" 
  },
  { 
    name: "QR Code & UPI Generator", 
    desc_bn: "এটি কিউআর কোড জেনারেটর। পেমেন্টের জন্য বা যেকোনো ওয়েবসাইট লিঙ্কের কিউআর কোড বানাতে পারেন।",
    desc_hi: "यूपीआई पेमेंट और वेबसाइट के लिए तुरंत क्यूआर कोड बनाएं।",
    desc_en: "Generate custom QR codes for UPI payments, Wi-Fi, and URLs.",
    keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], 
    url: "qr-generator.html" 
  },
  { 
    name: "Color Picker & HEX Extractor", 
    desc_bn: "এটি কালার পিকার। যেকোনো ডিজাইনের হেক্স কালার কোড সহজে বের করে নিন।",
    desc_hi: "किसी भी रंग का हेक्स कोड और आरजीबी कोड प्राप्त करें।",
    desc_en: "Pick colors and extract precise HEX and RGB color values.",
    keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], 
    url: "color-picker.html" 
  },
  { 
    name: "YouTube Thumbnail Downloader", 
    desc_bn: "এটি থাম্বনেইল ডাউনলোডার। যেকোনো ইউটিউব ভিডিওর এইচডি থাম্বনেইল ডাউনলোড করতে পারেন।",
    desc_hi: "यूट्यूब वीडियो से एचडी थंबनेल डाउनलोड करें।",
    desc_en: "Download high definition thumbnails from YouTube video links.",
    keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], 
    url: "youtube-thumbnail.html" 
  },
  { 
    name: "DocuCraft AI Scientific Calculator", 
    desc_bn: "এটি সায়েন্টিফিক ক্যালকুলেটর। জটিল গাণিতিক ও বৈজ্ঞানিক হিসাব-নিকাশ করার জন্য এটি ব্যবহার করুন।",
    desc_hi: "जटिल वैज्ञानिक और गणितीय गणनाओं के लिए।",
    desc_en: "Full featured scientific calculator for advanced mathematics.",
    keywords: ["scientific calculator", "calculator", "math", "calculator open", "হিচাব", "হিসাব", "ক্যালকুলেটর", "সায়েন্টিফিক ক্যালকুলেটর", "calculate"], 
    url: "calculator.html" 
  },
  { 
    name: "Loan EMI Calculator", 
    desc_bn: "এটি লোন ইএমআই ক্যালকুলেটর। যেকোনো লোনের মাসিক কিস্তি ও মোট সুদের হিসাব জানতে পারবেন।",
    desc_hi: "अपनी मासिक किस्त और कुल ब्याज का हिसाब लगाएं।",
    desc_en: "Compute monthly EMI, total interest, and loan amortization.",
    keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], 
    url: "loan-emi.html" 
  },
  { 
    name: "Loan Prepayment & Interest Saver", 
    desc_bn: "এটি লোন প্রিপেমেন্ট ক্যালকুলেটর। আগাম কিস্তি দিলে কত টাকা সুদ বাঁচবে তা হিসাব করুন।",
    desc_hi: "लोन प्रीपेमेंट करके ब्याज बचाने की गणना करें।",
    desc_en: "Calculate how much interest you save with loan prepayments.",
    keywords: ["prepayment", "interest saver", "loan prepayment"], 
    url: "loan-prepayment.html" 
  },
  { 
    name: "GST Calculator", 
    desc_bn: "এটি জিএসটি ক্যালকুলেটর। মূল্যের ওপর জিএসটি ট্যাক্স যোগ বা বাদ দিয়ে দাম বের করতে পারবেন।",
    desc_hi: "मूल्य पर जीएसटी टैक्स जोड़ने या हटाने की गणना करें।",
    desc_en: "Calculate inclusive and exclusive GST tax amounts instantly.",
    keywords: ["gst calculator", "gst", "जीएसटी", "জিএসটি"], 
    url: "gst-calculator.html" 
  },
  { 
    name: "SIP Calculator", 
    desc_bn: "এটি এসআইপি ক্যালকুলেটর। প্রতি মাসে মিউচুয়াল ফান্ডে বিনিয়োগ করলে ভবিষ্যতে কত রিটার্ন পাবেন তা দেখুন।",
    desc_hi: "म्यूचुअल फंड एसआईपी निवेश पर मिलने वाले रिटर्न का हिसाब लगाएं।",
    desc_en: "Calculate expected returns on monthly SIP mutual fund investments.",
    keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], 
    url: "sip-calculator.html" 
  },
  { 
    name: "Simple & Compound Interest", 
    desc_bn: "এটি সরল ও চক্রবৃদ্ধি সুদ ক্যালকুলেটর। সুদের নিখুঁত লাভ জানতে এটি কাজে লাগবে।",
    desc_hi: "साधारण और चक्रवृद्धि ब्याज की सही गणना करें।",
    desc_en: "Calculate simple and compound interest over specific periods.",
    keywords: ["simple interest", "compound interest", "interest calculator", "ब्याज", "সুদ"], 
    url: "interest-calculator.html" 
  },
  { 
    name: "FD & RD Maturity Calculator", 
    desc_bn: "এটি এফডি ও আরডি ক্যালকুলেটর। ফিক্সড ডিপোজিটের ম্যাচিউরিটি ভ্যালু জানতে পারবেন।",
    desc_hi: "फिक्स्ड डिपॉजिट और आरडी मैच्योरिटी राशि की गणना करें।",
    desc_en: "Calculate maturity amount and interest earned on FD and RD.",
    keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], 
    url: "fd-rd-calculator.html" 
  },
  { 
    name: "Gold & Jewellery Price Calculator", 
    desc_bn: "এটি সোনার গহনা ক্যালকুলেটর। মেকিং চার্জ ও জিএসটি সহ সোনার গহনার সঠিক দাম হিসাব করুন।",
    desc_hi: "मेकिंग चार्ज और जीएसटी सहित सोने के आभूषणों का सही मूल्य निकालें।",
    desc_en: "Calculate gold jewelry final price with making charges and taxes.",
    keywords: ["gold calculator", "gold price", "jewellery", "সোনা", "সোনার দাম"], 
    url: "gold-calculator.html" 
  },
  { 
    name: "Inflation Calculator", 
    desc_bn: "এটি মুদ্রাস্ফীতি ক্যালকুলেটর। ভবিষ্যৎ বা অতীতের টাকার ক্রয়ক্ষমতা যাচাই করুন।",
    desc_hi: "महंगाई और पैसे की भविष्य की कीमत की गणना करें।",
    desc_en: "Estimate purchasing power changes and future inflation values.",
    keywords: ["inflation calculator", "inflation", "महंगाई", "মুদ্রাস্ফীতি"], 
    url: "inflation-calculator.html" 
  },
  { 
    name: "PPF Calculator", 
    desc_bn: "এটি পিপিএফ ক্যালকুলেটর। পাবলিক প্রভিডেন্ট ফান্ডের ১৫ বছরের সঞ্চয় হিসাব করুন।",
    desc_hi: "पीपीएफ निवेश पर 15 वर्षों का रिटर्न और ब्याज निकालें।",
    desc_en: "Calculate Public Provident Fund maturity returns and yearly interest.",
    keywords: ["ppf calculator", "ppf", "পিপিএফ"], 
    url: "ppf-calculator.html" 
  },
  { 
    name: "Electricity Bill & Power Calculator", 
    desc_bn: "এটি বিদ্যুৎ বিল ক্যালকুলেটর। বৈদ্যুতিক সরঞ্জামগুলোর বিদ্যুৎ খরচ হিসাব করুন।",
    desc_hi: "घर के बिजली बिल और यूनिट खपत की गणना करें।",
    desc_en: "Calculate power consumption units and estimated electric bills.",
    keywords: ["electricity bill", "power calculator", "electric bill", "बिजली बिल", "বিদ্যুৎ বিল"], 
    url: "electricity-calculator.html" 
  },
  { 
    name: "Fuel Cost & Trip Mileage Calculator", 
    desc_bn: "এটি ফুয়েল ও ট্রিপ ক্যালকুলেটর। ভ্রমণের দূরত্ব অনুযায়ী পেট্রোল বা ডিজেল খরচ বের করুন।",
    desc_hi: "यात्रा की दूरी के अनुसार पेट्रोल या डीजल खर्च का हिसाब निकालें।",
    desc_en: "Calculate fuel trip cost and vehicle mileage per kilometer.",
    keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], 
    url: "fuel-calculator.html" 
  },
  { 
    name: "Take-Home Salary & CTC Calculator", 
    desc_bn: "এটি স্যালারি ক্যালকুলেটর। পিএফ ও ট্যাক্স কাটার পর হাতে কত টাকা বেতন পাবেন তা হিসাব করুন।",
    desc_hi: "सीटीसी से इन-हैंड नेट सैलरी की गणना करें।",
    desc_en: "Compute in-hand monthly take-home salary after deductions.",
    keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], 
    url: "salary-calculator.html" 
  },
  { 
    name: "Friend Bill Split & Tip Calculator", 
    desc_bn: "এটি ফ্রেন্ড বিল স্প্লিটার। বন্ধুদের সাথে রেস্তোরাঁর বিল সমান ভাগে ভাগ করুন।",
    desc_hi: "दोस्तों के बीच होटल या रेस्टोरेंट बिल को आसानी से बांटें।",
    desc_en: "Split dinner and trip bills evenly among friends with tip.",
    keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], 
    url: "bill-split.html" 
  },
  { 
    name: "Discount & Sale Calculator", 
    desc_bn: "এটি ডিসকাউন্ট ক্যালকুলেটর। কেনাকাটায় ছাড়ের পর আসল দাম কত হবে তা হিসাব করুন।",
    desc_hi: "छूट के बाद सामान की अंतिम कीमत जानें।",
    desc_en: "Find final sale price and savings after percentage discounts.",
    keywords: ["discount calculator", "sale calculator", "छूट", "ছাড়"], 
    url: "discount-calculator.html" 
  },
  { 
    name: "Percentage Calculator", 
    desc_bn: "এটি শতকরা ক্যালকুলেটর। যেকোনো সংখ্যার শতাংশ খুব সহজে হিসাব করতে পারবেন।",
    desc_hi: "किसी भी संख्या का प्रतिशत तुरंत निकालें।",
    desc_en: "Quick percentage, increase, decrease, and difference calculator.",
    keywords: ["percentage calculator", "percentage", "प्रतिशत", "শতকরা", "শতাংশ"], 
    url: "percentage-calculator.html" 
  },
  { 
    name: "Number to Words (Cheque Amount)", 
    desc_bn: "এটি নম্বর থেকে কথায় রূপান্তরকারী। ব্যাংকের চেক লেখার জন্য সংখ্যাকে কথায় বদলান।",
    desc_hi: "बैंक चेक भरने के लिए संख्याओं को शब्दों में बदलें।",
    desc_en: "Convert numbers and currency figures into written words.",
    keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], 
    url: "number-to-words.html" 
  },
  { 
    name: "Land Area Converter", 
    desc_bn: "এটি জমির পরিমাপ কনভার্টার। বিঘা, কাঠা, একর, শতক ও স্কয়ার ফিটের নিখুঁত হিসাব পাবেন।",
    desc_hi: "बीघा, कट्ठा, एकड़ और डिसमिल का सही क्षेत्रफल निकालें।",
    desc_en: "Convert land units like bigha, katha, acre, and sqft.",
    keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], 
    url: "land-converter.html" 
  },
  { 
    name: "DocuCraft AI Translator", 
    desc_bn: "এটি এআই ট্রান্সলেটর। যেকোনো ভাষার লেখাকে অন্য ভাষায় অনুবাদ করার জন্য এটি ব্যবহার করুন।",
    desc_hi: "किसी भी भाषा का अन्य भाषाओं में सटीक अनुवाद करें।",
    desc_en: "Translate paragraphs and phrases across multiple global languages.",
    keywords: ["translator", "translate", "translation", "অনুবাদ", "अनुवाद", "dokocraft translator", "docucraft translator", "translator open"], 
    url: "translator.html" 
  },
  { 
    name: "Pitch to Text (Voice Typing)", 
    desc_bn: "এটি ভয়েস টাইপিং টুল। মুখে যা বলবেন তা স্বয়ংক্রিয়ভাবে স্ক্রিনে টাইপ হয়ে যাবে।",
    desc_hi: "बोलकर आसानी से स्क्रीन पर टाइप करें।",
    desc_en: "Convert spoken speech into accurate real-time text.",
    keywords: ["pitch to text", "voice typing", "speech to text", "बोलकर लिखना", "ভয়েস টাইপিং"], 
    url: "voice-typing.html" 
  },
  { 
    name: "Text-to-Speech Converter", 
    desc_bn: "এটি টেক্সট টু স্পিচ টুল। যেকোনো লেখাকে স্পষ্ট অডিও ভয়েসে রূপান্তর করুন।",
    desc_hi: "लिखे हुए टेक्स्ट को ऑडियो आवाज में बदलें।",
    desc_en: "Synthesize written text into clear spoken voice audio.",
    keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], 
    url: "text-to-speech.html" 
  },
  { 
    name: "Unlimited Text Notepad", 
    desc_bn: "এটি আনলিমিটেড নোটপ্যাড। যেকোনো গুরুত্বপূর্ণ তথ্য লিখে সেভ করে রাখার জন্য ব্যবহার করুন।",
    desc_hi: "अपने जरूरी नोट्स लिखने और कॉपी करने के लिए नोटपैड।",
    desc_en: "Simple, fast, and unlimited browser notepad for your notes.",
    keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "नोटपैड", "নোটপ্যাড", "নোটবুক"], 
    url: "notepad.html" 
  },
  { 
    name: "Govt Job Alerts & Results", 
    desc_bn: "এটি চাকরির খবর পোর্টাল। সরকারি চাকরি ও পরীক্ষার রেজাল্টের আপডেট পান।",
    desc_hi: "सरकारी नौकरियों और परीक्षाओं के ताज़ा परिणाम देखें।",
    desc_en: "Find latest government recruitment alerts, exams, and results.",
    keywords: ["govt job", "job alert", "sarkari result", "सरकारी नौकरी", "চাকরি"], 
    url: "job-alerts.html" 
  },
  { 
    name: "Age Calculator (Exam DOB)", 
    desc_bn: "এটি বয়স ক্যালকুলেটর। জন্মতারিখ দিলে আজকের দিনে কত বছর, মাস ও দিন বয়স হলো তা দেখতে পারবেন।",
    desc_hi: "जन्म तिथि से अपनी सटीक उम्र, महीने और दिन जानें।",
    desc_en: "Calculate exact age in years, months, and days from date of birth.",
    keywords: ["age calculator", "calculate age", "उम्र", "বয়স ক্যালকুলেটর", "বয়স"], 
    url: "age-calculator.html" 
  },
  { 
    name: "Exam Age Eligibility Checker", 
    desc_bn: "এটি বয়স যোগ্যতা যাচাইকারী। সরকারি চাকরির পরীক্ষায় বসার বয়স আছে কিনা তা মিলিয়ে নিন।",
    desc_hi: "सरकारी परीक्षाओं के लिए अपनी आयु सीमा पात्रता जांचें।",
    desc_en: "Check if you satisfy official age eligibility criteria for jobs.",
    keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], 
    url: "exam-eligibility.html" 
  },
  { 
    name: "1-Minute Typing Speed Test", 
    desc_bn: "এটি টাইপিং স্পিড টেস্ট। ১ মিনিটে কতগুলো শব্দ নির্ভুল টাইপ করতে পারেন তা পরীক্ষা করুন।",
    desc_hi: "1 मिनट में अपनी टाइपिंग स्पीड और सटीकता की जांच करें।",
    desc_en: "Test words per minute speed and accuracy in a 60-second test.",
    keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট", "typing text", "typing test open", "typing text open"], 
    url: "typing-test.html" 
  },
  { 
    name: "Daily Calorie & BMR Calculator", 
    desc_bn: "এটি ক্যালোরি ক্যালকুলেটর। ফিট থাকার জন্য প্রতিদিন কত ক্যালোরি খাবার প্রয়োজন তা জানুন।",
    desc_hi: "दैनिक कैलोरी की जरूरत और बीएमआर का हिसाब लगाएं।",
    desc_en: "Compute daily caloric needs and Basal Metabolic Rate.",
    keywords: ["calorie calculator", "bmr calculator", "daily calorie", "ক্যালোরি"], 
    url: "calorie-calculator.html" 
  },
  { 
    name: "Daily Water Intake Goal", 
    desc_bn: "এটি জল ট্র্যাকার। স্বাস্থ্য ভালো রাখতে সারাদিনে কত লিটার জল খাওয়া উচিত তা নির্ধারণ করুন।",
    desc_hi: "वजन के अनुसार प्रतिदिन पानी पीने का सही लक्ष्य जानें।",
    desc_en: "Determine your optimal daily water hydration requirements.",
    keywords: ["water intake", "water goal", "पानी খাওয়ার लक्ष्य", "জল"], 
    url: "water-intake.html" 
  },
  { 
    name: "Sleep Calculator", 
    desc_bn: "এটি ঘুমের হিসাব ক্যালকুলেটর। সতেজ ঘুম থেকে ওঠার জন্য কখন ঘুমাতে যাওয়া উচিত তা হিসাব করুন।",
    desc_hi: "सही समय पर जागने और सोने के चक्र की गणना करें।",
    desc_en: "Optimize your sleep cycles and wake up refreshed.",
    keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব", "ঘুম"], 
    url: "sleep-calculator.html" 
  },
  { 
    name: "Barcode Generator (Code 128)", 
    desc_bn: "এটি বারকোড জেনারেটর। পণ্যের জন্য যেকোনো কোডের বারকোড বানিয়ে ডাউনলোড করুন।",
    desc_hi: "उत्पादों और बिलिंग के लिए कस्टम बारकोड बनाएं।",
    desc_en: "Generate standard Code 128 barcodes for inventory and products.",
    keywords: ["barcode generator", "barcode", "বারকোড"], 
    url: "barcode-generator.html" 
  },
  { 
    name: "Base64 Encoder & Decoder", 
    desc_bn: "এটি বেস৬৪ এনকোডার ও ডিকোডার। যেকোনো টেক্সট বা ছবিকে বেস৬৪ কোডে রূপান্তর করুন।",
    desc_hi: "টেক্সট এবং ফাইलों को बेस64 में एनकोड और डिकोड करें।",
    desc_en: "Encode and decode raw strings and binary assets into Base64.",
    keywords: ["base64", "base64 encoder", "base64 decoder"], 
    url: "base64.html" 
  },
  { 
    name: "Random Password & PIN Generator", 
    desc_bn: "এটি পাসওয়ার্ড ও পিন জেনারেটর। সুরক্ষিত ও শক্তিশালী পাসওয়ার্ড স্বয়ংক্রিয়ভাবে তৈরি করুন।",
    desc_hi: "सुरक्षित और मजबूत पासवर्ड व पिन बनाएं।",
    desc_en: "Generate secure, random, cryptographically strong passwords.",
    keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], 
    url: "password-generator.html" 
  },
  { 
    name: "Universal Unit Converter", 
    desc_bn: "এটি ইউনিট কনভার্টার। দৈর্ঘ্য, ওজন, তাপমাত্রা ও পরিমাপের একক রূপান্তর করুন।",
    desc_hi: "लंबाई, वजन, तापमान और विभिन्न इकाइयों का रूपांतरण करें।",
    desc_en: "Convert measurement units across length, weight, area, and volume.",
    keywords: ["unit converter", "universal converter", "একক রূপান্তর"], 
    url: "unit-converter.html" 
  },
  { 
    name: "Duplicate Line Remover", 
    desc_bn: "এটি ডুপ্লিকেট লাইন রিমুভার। টেক্সটের তালিকা থেকে একই রকম ডুপ্লিকেট লাইনগুলো মুছে দিন।",
    desc_hi: "টেক্সট লিস্ট থেকে ডুপ্লিকেট पंक्तियाँ हटाएं।",
    desc_en: "Remove repeated and duplicate lines from raw text blocks.",
    keywords: ["duplicate line remover", "remove duplicates"], 
    url: "duplicate-remover.html" 
  },
  { 
    name: "Text Reverse & Flip Tool", 
    desc_bn: "এটি টেক্সট রিভার্সার। যেকোনো লেখাকে উল্টো বা মিরর টেক্সটে রূপান্তর করুন।",
    desc_hi: "लिखे हुए शब्दों को उल्टा और मिरर टेक्स्ट में बदलें।",
    desc_en: "Reverse characters, words, and flip text upside down.",
    keywords: ["text reverse", "flip text", "লেখা উল্টানো"], 
    url: "text-reverse.html" 
  },
  { 
    name: "Marks to Percentage & CGPA", 
    desc_bn: "এটি নম্বর থেকে শতাংশ ও সিজিপিএ ক্যালকুলেটর। পরীক্ষার গ্রেড ও পার্সেন্টেজ হিসাব করুন।",
    desc_hi: "परीक्षा अंकों से प्रतिशत और सीजीपीए निकालें।",
    desc_en: "Convert academic marks into exact percentages and CGPA grades.",
    keywords: ["marks to percentage", "cgpa calculator", "cgpa"], 
    url: "marks-calculator.html" 
  },
  { 
    name: "Average & Grade Calculator", 
    desc_bn: "এটি গড় ও গ্রেড ক্যালকুলেটর। নম্বরের গড় ও লেটার গ্রেড বের করুন।",
    desc_hi: "अंकों का औसत और ग्रेड तय करें।",
    desc_en: "Calculate statistical weighted averages and final letter grades.",
    keywords: ["average calculator", "grade calculator"], 
    url: "grade-calculator.html" 
  },
  { 
    name: "Invoice / Bill Generator", 
    desc_bn: "এটি ইনভয়েস ও বিল জেনারেটর। ব্যবসার জন্য প্রফেশনাল ক্যাশ মেমো বা জিএসটি বিল তৈরি করুন।",
    desc_hi: "দुकान और व्यापार के लिए पेशेवर बिल या इनवॉइस बनाएं।",
    desc_en: "Generate printable invoices and billing receipts with auto tax.",
    keywords: ["invoice generator", "bill generator", "বিল জনरेटर", "বিল মেকার"], 
    url: "invoice-generator.html" 
  },
  { 
    name: "Resume / CV Maker to PDF", 
    desc_bn: "এটি রিজিউমে মেকার। চাকরির জন্য প্রফেশনাল বায়োডাটা তৈরি করে পিডিএফে ডাউনলোড করুন।",
    desc_hi: "नौकरी के लिए शानदार रिज्यूमे और बायोडाटा तैयार करें।",
    desc_en: "Build modern professional resumes and download directly in PDF.",
    keywords: ["resume maker", "cv maker", "biodata", "बायोडाटा", "রিজিউমে", "সিভি"], 
    url: "resume-maker.html" 
  },
  { 
    name: "Prescription / Memo Maker", 
    desc_bn: "এটি প্রেসক্রিপশন ও মেমো মেকার। ডাক্তার ও ফার্মেসির জন্য প্রেসক্রিপশন স্লিপ বানান।",
    desc_hi: "क्लिनिक और डॉक्टर के लिए डिजिटल प्रिस्क्रिप्शन पर्ची बनाएं।",
    desc_en: "Create clinical doctor prescriptions and medical memos cleanly.",
    keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], 
    url: "prescription-maker.html" 
  },
  { 
    name: "Contact & Support Desk", 
    desc_bn: "এটি কন্ট্যাক্ট ও সাপোর্ট ডেস্ক। যেকোনো সাহায্য বা যোগাযোগের জন্য এখানে যেতে পারেন।",
    desc_hi: "सहायता और संपर्क करने के लिए सपोर्ट डेस्क पर जाएं।",
    desc_en: "Reach our official support desk for inquiries and help.",
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

// 6. Matching & Responding when User Speaks
function handleUserQuery(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  // Cleans stop words and command prefixes/suffixes
  const cleanQuery = raw
    .replace(/(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও|খুলবে|খোলো|দাও|আমাকে|হিসাব)/gi, '')
    .trim();

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    if (raw.includes(nameLower) || (cleanQuery && nameLower.includes(cleanQuery))) score += 80;

    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (raw.includes(kwLower) || (cleanQuery && cleanQuery.includes(kwLower))) {
        score += 60;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  if (bestMatchedItem && maxScore >= 40) {
    let message = bestMatchedItem.desc_en;
    if (lang === 'bn-IN' && bestMatchedItem.desc_bn) {
      message = bestMatchedItem.desc_bn;
    } else if (lang === 'hi-IN' && bestMatchedItem.desc_hi) {
      message = bestMatchedItem.desc_hi;
    }
    const finalUrl = resolveTargetUrl(bestMatchedItem.url, bestMatchedItem);
    speakAndDisplay(raw, message, lang, bestMatchedItem.name, finalUrl);
  } else {
    let notFoundMsg = "Sorry, I couldn't find that specific tool. Please tell me what you need.";
    if (lang === 'bn-IN') {
      notFoundMsg = "দুঃখিত, এই টুলটি বুঝতে পারিনি। আপনার কী ধরনের কাজ দরকার তা আরেকবার বলুন।";
    } else if (lang === 'hi-IN') {
      notFoundMsg = "माफ़ कीजिए, यह टूल नहीं मिला। आपको किस काम के लिए टूल चाहिए कृपया दोबारा बोलें।";
    }
    speakAndDisplay(raw, notFoundMsg, lang, "DocuCraft AI", "");
  }
}

// 7. Microphone Input Handler
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const micBtn = document.getElementById('voiceSearchBtn');
  const statusElem = document.getElementById('voice-status');

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    hideCenterAICard();
    return;
  }

  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  hideCenterAICard();

  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;

  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

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
      handleUserQuery(cleanTranscript);
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

  try {
    globalRecognition.start();
  } catch (err) {
    console.error("Start error:", err);
  }
}

// 8. Direct Seamless Card Navigation
function handleCardClick(element) {
  if (!element) return;
  
  let url = element.getAttribute('href') || element.querySelector('a')?.getAttribute('href') || '';
  
  if (!isSafeUrl(url)) {
    const titleElem = element.querySelector('h3, h4, .tool-title');
    const title = (titleElem ? titleElem.innerText : element.innerText.split('\n')[0] || '').trim();
    const match = siteKnowledgeBase.find(item => item.name.toLowerCase() === title.toLowerCase());
    if (match && match.url) {
      url = match.url;
    }
  }

  if (isSafeUrl(url)) {
    window.location.href = url;
  }
}

function startVoice() {
  toggleVoiceInput('toolSearchInput');
}

// 9. Delegated Click Listener
document.addEventListener('click', (e) => {
  const card = e.target.closest('.popular-card, .tool-card');
  if (card) {
    handleCardClick(card);
  }
});
