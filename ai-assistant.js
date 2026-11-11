/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;
let hasPlayedInitialGreeting = false;

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

// 2. Reliable Multi-Device Speech Function
function speakText(text, langCode = 'en-US') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
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

  window.speechSynthesis.speak(utterance);
}

// 3. Initial Dynamic Welcome Greeting in English (Date, Time, Day)
// স্ক্রিনে প্রথমবার স্পর্শ বা ক্লিক করা মাত্রই সবার ফোনে এটি ইংরেজিতে বাজবে
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

// প্রথম ইউজার ইন্টারেকশন শনাক্তকরণ
document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 4. Microphone Assistant Welcome strictly in English
function playIndranilGreeting() {
  const greeting = "I am Indranil. How can I help you?";
  speakText(greeting, 'en-US');
}

// ব্যবহারকারীর বলা ভাষা বুঝে সেই ভাষায় উত্তর দেওয়া
function speakToolConfirmation(toolName, userLang) {
  const lang = (userLang || 'en').toLowerCase().split('-')[0];

  if (lang === 'bn') {
    speakText(`${toolName} খোলা হচ্ছে`, 'bn-IN');
  } else if (lang === 'hi') {
    speakText(`${toolName} खोला जा रहा है`, 'hi-IN');
  } else {
    speakText(`Opening ${toolName}`, 'en-US');
  }
}

// 5. Tool Knowledge Base (English, Hindi, Bengali)
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", keywords: ["merge", "scanner", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত", "जोड़ना"], url: "merge-pdf.html" },
  { name: "Split PDF", keywords: ["split", "separate", "tukde", "katna", "ভাগ", "কাটা", "splitter", "अलग"], url: "split-pdf.html" },
  { name: "Compress PDF", keywords: ["compress", "reduce size", "chota karna", "সাইজ কমানো", "কম্প্রেস", "छोटा"], url: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", keywords: ["scanner", "scan", "enhance", "स्कैनर", "স্ক্যানার"], url: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", keywords: ["zip to pdf", "zip converter", "জিপ"], url: "zip-to-pdf.html" },
  { name: "Repair PDF", keywords: ["repair", "fix", "theek karna", "মেরামত", "corrupt", "ঠিক করা"], url: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", keywords: ["organize", "reorder", "pages sequence", "সাজানো"], url: "organize-pdf.html" },
  { name: "Rotate PDF", keywords: ["rotate", "ghumaana", "ঘোরানো", "घुमाना"], url: "rotate-pdf.html" },
  { name: "Delete PDF Pages", keywords: ["delete", "remove pages", "hatao", "বাদ দেওয়া", "মুছে ফেলা", "हटाएं"], url: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "फोटो से पीडीएफ", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf.html" },
  { name: "Word to PDF", keywords: ["word to pdf", "docx to pdf", "word converter"], url: "word-to-pdf.html" },
  { name: "Excel to PDF", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], url: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], url: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", keywords: ["html to pdf", "web to pdf"], url: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], url: "pdf-to-jpg.html" },
  { name: "PDF to Word", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html" },
  { name: "PDF to Excel", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা", "टेक्स्ट"], url: "pdf-to-text.html" },
  { name: "Edit PDF", keywords: ["edit pdf", "write on pdf", "এডিট", "एडिट"], url: "edit-pdf.html" },
  { name: "Sign PDF", keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই", "हस्ताक्षर"], url: "sign-pdf.html" },
  { name: "Watermark PDF", keywords: ["watermark", "জলছাপ", "वाটারমার্ক"], url: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক", "ताला"], url: "protect-pdf.html" },
  { name: "Unlock PDF", keywords: ["unlock", "remove password", "আনলক", "खोलो"], url: "unlock-pdf.html" },
  { name: "Add Page Numbers", keywords: ["page numbers", "page number", "पेज नंबर", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার", "ছবি রিসাইজ"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড", "क्यूआर"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার", "রঙ"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "हिसाब", "ক্যালকুলেটর", "গণনা"], url: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment.html" },
  আপনার রিকোয়েস্ট অনুযায়ী সম্পূর্ণ ফাইলটি নিচে তৈরি করে দেওয়া হলো।

এখানে আপনার চাওয়া প্রতিটি বিষয় সুনির্দিষ্টভাবে কনফিগার করা হয়েছে:
**প্রথম ওয়েলকাম বার্তা:** ওয়েবসাইটে ঢুকে স্ক্রিনে প্রথম টাচ বা ক্লিক করলে দিন, তারিখ ও সময় সহ ওয়েলকাম স্পিচটি সম্পূর্ণ খাঁটি **ইংরেজিতে** বলবে (ভিডিওর মতো কর2. **অ্যাসিস্ট্যান্ট ওয়েলকাম:** মাইক বাটনে ক্লিক করলে বলবে: *"I am Indranil. How can I help you?"* (সম্পূর্ণ **ইংরেজিতে**)।
3. **বহুভাষিক রিয়েল-টাইম উত্তর ও নেভিগেশন (বাংলা, হিন্দি, ইংরেজি):** ইউজার যে ভাষায় কথা বলবে বা টুল খুঁজবে, অ্যাসিস্ট্যান্ট ঠিক **সেই ভাষাতেই মুখে উত্তর দেবে** এবং সঠিক টুলে সরাসরি রিডাইরেক্ট করে নিয়ে যাবে[cite: 1, 2]:
   - বাংলায় বললে বাংলায় উত্তর দেবে (যেমন: *"পাসপোর্ট ছবি মেকার খোলা হচ্ছে..."*)।
   - হিন্দিতে বললে হিন্দিতে উত্তর দেবে (যেমন: *"पासपोर्ट फोटो मेकर खोला जा रहा है..."*)।
   - ইংরেজিতে বললে ইংরেজিতে উত্তর দেবে (যেমন: *"Opening Passport Photo Sheet Maker..."*)।
4. **৪০৪ এবং রিলেটিভ লিঙ্ক সমাধান:** ডোমেনের যেকোনো লিঙ্ক সরাসরি ব্রাউজারের আসল `href` থেকে নিরাপদভাবে রিডাইরেক্ট করবে।

---

### সম্পূর্ণ `ai-assistant.js` ফাইল:

```javascript
/* =========================================================
   DocuCraft AI - Global Multi-Language Voice AI Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;
let hasPlayedInitialGreeting = false;

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

// 2. Reliable Multi-Device Speech Function
function speakText(text, langCode = 'en-US') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = langCode;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const target = langCode.toLowerCase().split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(target)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

// 3. Initial Dynamic Welcome Greeting strictly in English (Date, Time, Day)
// স্ক্রিনে প্রথমবার স্পর্শ বা ক্লিক করা মাত্রই সবার ফোনে এটি ইংরেজিতে বেজে উঠবে
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

// প্রথম ইউজার ইন্টারেকশন শনাক্তকরণ
document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 4. Microphone Assistant Welcome strictly in English
function playIndranilGreeting() {
  const greeting = "I am Indranil. How can I help you?";
  speakText(greeting, 'en-US');
}

// Detect language of spoken query (Bengali, Hindi, or English)
function detectLanguage(text) {
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 5. Comprehensive Tool Knowledge Base (English, Hindi, Bengali)
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", bn: "পিডিএফ জোড়া লাগানোর টুল", hi: "पीडीएफ मर्ज टूल", keywords: ["merge", "scanner", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত", "jodo"], url: "merge-pdf.html" },
  { name: "Split PDF", bn: "পিডিএফ স্প্লিট টুল", hi: "पीडीएफ स्प्लिट टूल", keywords: ["split", "separate", "tukde", "katna", "ভাগ", "কাটা", "splitter"], url: "split-pdf.html" },
  { name: "Compress PDF", bn: "পিডিএফ কম্প্রেস টুল", hi: "पीडीएफ कंप्रेस टूल", keywords: ["compress", "reduce size", "chota karna", "সাইজ কমানো", "কম্প্রেস"], url: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", bn: "পিডিএফ স্ক্যানার", hi: "पीडीएफ स्कैनर", keywords: ["scanner", "scan", "enhance", "स्कैनर", "স্ক্যানার"], url: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", bn: "জিপ টু পিডিএফ কনভার্টার", hi: "ज़िप टू पीडीएफ", keywords: ["zip to pdf", "zip converter", "জিপ"], url: "zip-to-pdf.html" },
  { name: "Repair PDF", bn: "পিডিএফ রিপেয়ার টুল", hi: "पीडीएफ रिपेयर", keywords: ["repair", "fix", "theek karna", "মেরামত", "corrupt"], url: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", bn: "পিডিএফ পেজ সাজানোর টুল", hi: "पेज रीऑर्डर टूल", keywords: ["organize", "reorder", "pages sequence", "সাজানো"], url: "organize-pdf.html" },
  { name: "Rotate PDF", bn: "পিডিএফ ঘোরানোর টুল", hi: "पीडीएफ रोटेट टूल", keywords: ["rotate", "ghumaana", "ঘোরানো"], url: "rotate-pdf.html" },
  { name: "Delete PDF Pages", bn: "পিডিএফ পেজ মুছে ফেলার টুল", hi: "पीडीएफ पेज हटाएं", keywords: ["delete", "remove pages", "hatao", "বাদ দেওয়া", "মুছে ফেলা"], url: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", bn: "ছবি থেকে পিডিএফ কনভার্টার", hi: "फोटो से पीडीएफ कनवर्टर", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "फोटो से पीडीएफ", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf.html" },
  { name: "Word to PDF", bn: "ওয়ার্ড টু পিডিএফ কনভার্টার", hi: "वर्ड टू पीडीएफ", keywords: ["word to pdf", "docx to pdf", "word converter"], url: "word-to-pdf.html" },
  { name: "Excel to PDF", bn: "এক্সেল টু পিডিএফ কনভার্টার", hi: "एक्सेल टू पीडीएफ", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], url: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", bn: "পাওয়ারপয়েন্ট টু পিডিএফ", hi: "पावरपॉइंट टू पीडीएफ", keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], url: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", bn: "এইচটিএমএল টু পিডিএফ", hi: "एचटीएमएल टू पीडीएफ", keywords: ["html to pdf", "web to pdf"], url: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", bn: "পিডিএফ থেকে ছবি কনভার্টার", hi: "पीडीएफ टू फोटो", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], url: "pdf-to-jpg.html" },
  { name: "PDF to Word", bn: "পিডিএফ থেকে ওয়ার্ড কনভার্টার", hi: "पीडीएफ टू वर्ड", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html" },
  { name: "PDF to Excel", bn: "পিডিএফ থেকে এক্সেল কনভার্টার", hi: "पीडीएफ टू एक्सेल", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", bn: "পিডিএফ টেক্সট ও লেখার টুল", hi: "पीडीएफ टेक्स्ट एक्सट्रैक्टर", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], url: "pdf-to-text.html" },
  { name: "Edit PDF", bn: "পিডিএফ এডিটর", hi: "पीडीएफ एडिटर", keywords: ["edit pdf", "write on pdf", "এডিট"], url: "edit-pdf.html" },
  { name: "Sign PDF", bn: "পিডিএফ সিগনেচার টুল", hi: "पीडीएफ साइन टूल", keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই"], url: "sign-pdf.html" },
  { name: "Watermark PDF", bn: "পিডিএফ ওয়াটারমার্ক টুল", hi: "पीडीएफ वॉटरमार्क", keywords: ["watermark", "জলছাপ"], url: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", bn: "পিডিএফ লক টুল", hi: "पीडीएफ लॉक टूल", keywords: ["protect", "lock", "password", "পাসওয়ার্ড", "লক"], url: "protect-pdf.html" },
  { name: "Unlock PDF", bn: "পিডিএফ আনলক টুল", hi: "पीडीएफ अनलॉक टूल", keywords: ["unlock", "remove password", "আনলক"], url: "unlock-pdf.html" },
  { name: "Add Page Numbers", bn: "পিডিএফ পেজ নম্বর টুল", hi: "पेज नंबर टूल", keywords: ["page numbers", "page number", "पेज नंबर", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", bn: "ফটো এবং সিগনেচার রিসাইজার", hi: "फोटो और साइन रिसाइजर", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার", "ছবি রিসাইজ"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", bn: "পরীক্ষার ফর্মের ফটো রিসাইজার", hi: "एग्जाम फोटो रिसाइजर", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", bn: "পাসপোর্ট ফটো শিট মেকার", hi: "पासपोर्ट फोटो शीट मेकर", keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি", "passport size photo"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", bn: "ডিজিটাল সিগনেচার মেকার", hi: "डिजिटल सिग्नेचर मेकर", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", bn: "কিউআর কোড এবং ইউপিআই জেনারেটর", hi: "क्यूआर कोड जनरेटर", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", bn: "কালার পিকার টুল", hi: "कलर पिकर टूल", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", bn: "ইউটিউব থাম্বনেইল ডাউনলোডার", hi: "यूट्यूब थंबनेल डाउनलोडर", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", bn: "সায়েন্টিফিক ক্যালকুলেটর", hi: "वैज्ञानिक कैलकुलेटर", keywords: ["scientific calculator", "calculator", "math", "हिसाब", "ক্যালকুলেটর", "hisab"], url: "calculator.html" },
  { name: "Loan EMI Calculator", bn: "লোন ইএমআই ক্যালকুলেটর", hi: "लोन ईएमआई कैलकुलेटर", keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", bn: "লোন প্রিপেমেন্ট ক্যালকুলেটর", hi: "लोन प्रीपेमेंट टूल", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment.html" },
  { name: "GST Calculator", bn: "জিএসটি ক্যালকুলেটর", hi: "जीएसटी कैलकुलेटर", keywords: ["gst calculator", "gst", "जीएसटी", "জিএসটি"], url: "gst-calculator.html" },
  { name: "SIP Calculator", bn: "এসআইপি ক্যালকুলেটর", hi: "एसआईपी कैलकुलेटर", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], url: "sip-calculator.html" },
  { name: "Simple & Compound Interest", bn: "সুদ ও ইন্টারেস্ট ক্যালকুলেটর", hi: "ब्याज कैलकुलेटर", keywords: ["simple interest", "compound interest", "interest calculator", "ब्याज", "সুদ"], url: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", bn: "এফডি এবং আরডি ক্যালকুলেটর", hi: "एफडी आरडी कैलकुलेटर", keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], url: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", bn: "সোনার দাম ও গহনা ক্যালকুলেটর", hi: "सोने का कैलकुलेटर", keywords: ["gold calculator", "gold price", "jewellery", "सोना", "সোনার দাম"], url: "gold-calculator.html" },
  { name: "Inflation Calculator", bn: "মুদ্রাস্ফীতি ক্যালকুলেটর", hi: "मुद्रास्फीति कैलकुलेटर", keywords: ["inflation calculator", "inflation", "মহঙ্গাই", "মুদ্রাস্ফীতি"], url: "inflation-calculator.html" },
  { name: "PPF Calculator", bn: "পিপিএফ ক্যালকুলেটর", hi: "पीपीएफ कैलकुलेटर", keywords: ["ppf calculator", "ppf", "পিপিএফ"], url: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", bn: "বিদ্যুৎ বিল ক্যালকুলেটর", hi: "बिजली बिल कैलकुलेटर", keywords: ["electricity bill", "power calculator", "electric bill", "बिजली बिल", "বিদ্যুৎ বিল"], url: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", bn: "তেল খরচ ও মাইলেজ ক্যালকুলেটর", hi: "ईंधन लागत कैलकुलेटर", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], url: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", bn: "বেতন ও স্যালারি ক্যালকুলেটর", hi: "वेतन कैलकुलेटर", keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], url: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", bn: "বিল ভাগ ও স্প্লিট ক্যালকুলেটর", hi: "बिल स्प्लिट कैलकुलेटर", keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], url: "bill-split.html" },
  { name: "Discount & Sale Calculator", bn: "ছাড় ও ডিসকাউন্ট ক্যালকুলেটর", hi: "छूट कैलकुलेटर", keywords: ["discount calculator", "sale calculator", "छूट", "ছাড়"], url: "discount-calculator.html" },
  { name: "Percentage Calculator", bn: "শতকরা ক্যালকুলেটর", hi: "प्रतिशत कैलकुलेटर", keywords: ["percentage calculator", "percentage", "प्रतिशत", "শতকরা", "শতাংশ"], url: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", bn: "কথায় রূপান্তর করার টুল", hi: "नंबर से शब्द कनवर्टर", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], url: "number-to-words.html" },
  { name: "Land Area Converter", bn: "জমির পরিমাপ ও কাঠা ক্যালকুলেটর", hi: "जमीन मापक कैलकुलेटर", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], url: "land-converter.html" },

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", bn: "ডকুক্ল্যাফট অনুবাদক", hi: "अनुवादक टूल", keywords: ["translator", "translate", "translation", "অনুবাদ", "अनुवाद", "dokocraft translator", "docucraft translator"], url: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", bn: "ভয়েস টাইপিং টুল", hi: "बोलकर लिखने का टूल", keywords: ["pitch to text", "voice typing", "speech to text", "बोलकर लिखना", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", bn: "টেক্সট টু স্পিচ অডিও টুল", hi: "टेक्स्ट टू स्पीच टूल", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", bn: "আনলিমিটেড নোটপ্যাড", hi: "टेक्स्ट नोटपैड", keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "नोटपैड", "নোটপ্যাড", "নোটবুক"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", bn: "সরকারি চাকরির খবর", hi: "सरकारी नौकरी अलर्ट", keywords: ["govt job", "job alert", "sarkari result", "सरकारी नौकरी", "চাকরি"], url: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", bn: "বয়স ক্যালকুলেটর", hi: "उम्र कैलकुलेटर", keywords: ["age calculator", "calculate age", "उम्र", "বয়স ক্যালকুলেটর", "বয়স"], url: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", bn: "পরীক্ষার বয়স যোগ্যতা যাচাই", hi: "एग्जाम आयु पात्रता", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], url: "exam-eligibility.html" },
  { name: "1-Minute Typing Speed Test", bn: "টাইপিং স্পিড টেস্ট", hi: "टाइपिंग स्पीड टेस्ट", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test.html" },
  { name: "Daily Calorie & BMR Calculator", bn: "ক্যালোরি ক্যালকুলেটর", hi: "कैलोरी कैलकुलेटर", keywords: ["calorie calculator", "bmr calculator", "daily calorie", "ক্যালোরি"], url: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", bn: "জল খাওয়ার লক্ষ্য ট্র্যাকার", hi: "पानी का लक्ष्य ट्रैकर", keywords: ["water intake", "water goal", "পানি খাওয়ার লক্ষ্য", "জল"], url: "water-intake.html" },
  { name: "Sleep Calculator", bn: "ঘুমের হিসাব ক্যালকুলেটর", hi: "नींद कैलकुलेटर", keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব", "ঘুম"], url: "sleep-calculator.html" },
  { name: "Barcode Generator (Code 128)", bn: "বারকোড জেনারেটর", hi: "बारकोड जनरेटर", keywords: ["barcode generator", "barcode", "বারকোড"], url: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", bn: "বেস৬৪ এনকোডার", hi: "बेस 64 एनकोडर", keywords: ["base64", "base64 encoder", "base64 decoder"], url: "base64.html" },
  { name: "Random Password & PIN Generator", bn: "পাসওয়ার্ড ও পিন জেনারেটর", hi: "पासवर्ड जनरेटर", keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator.html" },
  { name: "Universal Unit Converter", bn: "ইউনিট কনভার্টার", hi: "यूनिट कनवर्टर", keywords: ["unit converter", "universal converter", "একক রূপান্তর"], url: "unit-converter.html" },
  { name: "Duplicate Line Remover", bn: "ডুপ্লিকেট লাইন রিমুভার", hi: "डुप्लिकेट लाइन रिमूवर", keywords: ["duplicate line remover", "remove duplicates"], url: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", bn: "টেক্সট উল্টানোর টুল", hi: "टेक्स्ट रिवर्स टूल", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], url: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", bn: "নম্বর থেকে শতাংশ ও সিজিপিএ", hi: "मार्क्स टू प्रतिशत", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], url: "marks-calculator.html" },
  { name: "Average & Grade Calculator", bn: "গ্রেড ক্যালকুলেটর", hi: "ग्रेड कैलकुलेटर", keywords: ["average calculator", "grade calculator"], url: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", bn: "বিল ও ইনভয়েস জেনারেটর", hi: "बिल जनरेटर", keywords: ["invoice generator", "bill generator", "बिल जनरेटर", "বিল মেকার"], url: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", bn: "রিজিউমে ও সিভি মেকার", hi: "बायोडाटा मेकर", keywords: ["resume maker", "cv maker", "biodata", "बायोडाटा", "রিজিউমে", "সিভি"], url: "resume-maker.html" },
  { name: "Prescription / Memo Maker", bn: "প্রেসক্রিপশন মেকার", hi: "प्रिस्क्रिप्शन मेकर", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], url: "prescription-maker.html" },
  { name: "Contact & Support Desk", bn: "যোগাযোগ ও হেল্প ডেস্ক", hi: "संपर्क और सहायता", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], url: "contact.html" }
];

// 6. Voice Matching with Feedback in the Spoken Language
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও|খুলবে|खोलो|दिखाओ|चालू करो)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

  // 1. Identify in siteKnowledgeBase
  let bestMatchedItem = null;
  let maxScore = 0;

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

  // 2. Identify Target on DOM
  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  let matchedCard = null;

  if (bestMatchedItem && maxScore >= 40) {
    const targetUrlPart = bestMatchedItem.url.toLowerCase().replace('.html', '');
    matchedCard = cards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      return href.includes(targetUrlPart);
    });
  }

  // 3. Fallback: Search visible card titles
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

  // 4. Voice Feedback in the Same Spoken Language before Navigating
  if (bestMatchedItem || matchedCard) {
    let toolName = bestMatchedItem ? bestMatchedItem.name : "Tool";
    let speakMessage = `Opening ${toolName}`;

    if (lang === 'bn-IN') {
      const bnName = bestMatchedItem?.bn || toolName;
      speakMessage = `${bnName} খোলা হচ্ছে...`;
    } else if (lang === 'hi-IN') {
      const hiName = bestMatchedItem?.hi || toolName;
      speakMessage = `${hiName} खोला जा रहा है...`;
    }

    speakText(speakMessage, lang);
  }

  // 5. Highlight, Scroll & Open
  if (matchedCard) {
    matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    matchedCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    matchedCard.style.boxShadow = '0 0 25px rgba(0, 150, 255, 0.9)';
    matchedCard.style.transform = 'scale(1.05)';

    setTimeout(() => {
      const linkElem = matchedCard.tagName === 'A' ? matchedCard : matchedCard.querySelector('a');
      const realUrl = linkElem?.getAttribute('href') || matchedCard.getAttribute('href');

      if (realUrl && realUrl !== '#' && !realUrl.startsWith('javascript:')) {
        window.location.href = realUrl;
      } else if (bestMatchedItem && bestMatchedItem.url) {
        window.location.href = bestMatchedItem.url;
      } else {
        matchedCard.click();
      }
    }, 700);
  } else if (bestMatchedItem && maxScore >= 50) {
    setTimeout(() => {
      window.location.href = bestMatchedItem.url;
    }, 700);
  }
}

// 7. Voice Input (Microphone / Speech Recognition)
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

  // Supports user's default input language
  const userPreferredLang = navigator.language || 'en-US';
  globalRecognition.lang = userPreferredLang;

  let hasGreeted = false;

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";

    if (!hasGreeted) {
      hasGreeted = true;
      playIndranilGreeting(); // Always in English
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

// 8. Strict Safe URL Resolver (CodeQL Compliant)
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

// 9. Track Tool Usage (Recent Tools)
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
});ে)[
cite: 3]।
