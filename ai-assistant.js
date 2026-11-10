/* =========================================================
   DocuCraft AI - Advanced Multi-Language Voice AI Engine
   Developer: Indranil Ruidas
   Full 75+ Tools Knowledge Base & Autonomous Voice Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;
let isAssistantSpeaking = false;

// Selected Gender State ('female' by default)
let selectedVoiceGender = localStorage.getItem('docucraft_voice_gender') || 'female';

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

// 2. Multi-Device Voice Synthesis with Callback
function speakText(text, langCode = 'en-US', onComplete = null) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  const targetLang = (langCode || 'en').toLowerCase().split('-')[0];

  const matchedVoices = voices.filter(v => 
    v.lang.toLowerCase() === langCode.toLowerCase() || 
    v.lang.toLowerCase().startsWith(targetLang)
  );

  if (matchedVoices.length > 0) {
    if (selectedVoiceGender === 'female') {
      utterance.voice = matchedVoices.find(v => 
        /female|zira|samantha|victoria|karen|veena|lekha|priya|google.*female/i.test(v.name)
      ) || matchedVoices[0];
      utterance.pitch = 1.15;
      utterance.rate = 0.96;
    } else {
      utterance.voice = matchedVoices.find(v => 
        /male|david|george|rishi|neel|google.*male|guy/i.test(v.name)
      ) || (matchedVoices.length > 1 ? matchedVoices[1] : matchedVoices[0]);
      utterance.pitch = 0.88;
      utterance.rate = 0.94;
    }
  } else {
    utterance.pitch = selectedVoiceGender === 'female' ? 1.2 : 0.85;
    utterance.rate = 0.95;
  }

  utterance.lang = langCode;

  utterance.onstart = () => {
    isAssistantSpeaking = true;
  };

  utterance.onend = () => {
    isAssistantSpeaking = false;
    if (typeof onComplete === 'function') onComplete();
  };

  utterance.onerror = () => {
    isAssistantSpeaking = false;
    if (typeof onComplete === 'function') onComplete();
  };

  window.speechSynthesis.speak(utterance);
}

// 3. Compact & Smart Welcome Greeting (One-time per session)
function playSiteInitialGreeting() {
  if (sessionStorage.getItem('docucraft_greeted')) return;
  sessionStorage.setItem('docucraft_greeted', 'true');

  const greetingText = "Hi, welcome to DocuCraft AI! How can I help you today?";
  speakText(greetingText, 'en-US');
}

document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 4. Microphone Assistant Welcome
function playIndranilGreeting(onFinished) {
  const greeting = "I am Indranil. How can I help you today?";
  speakText(greeting, 'en-US', onFinished);
}

function detectLanguage(text) {
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 5. Creator Biography & Interactive Knowledge Base
const creatorBio = {
  name: "Indranil Ruidas",
  fullStory: "DocuCraft AI was developed and architected by Indranil Ruidas, a tech professional and frontend developer from Ajhapur, Purba Bardhaman, West Bengal[cite: 2]. Indranil holds a Diploma in Computer Science and Technology from Sylvan Polytechnic College with 80% marks, an ITI in Computer Science from Sathish Chandra ITI, and a Certificate in Communication and IT from Anudip Foundation[cite: 2]. He has over 3 years of hands-on experience working across digital services, CCTV operations, customer assistance, and marketing with organizations like Jus Jumpin, Ezeepay Digital Services, Bharti AXA, and Bajaj Allianz[cite: 2]. He created DocuCraft AI as a free, powerful client-side utility hub for everyone."
};

const entertainingStories = [
  "Did you know? The first computer bug was an actual moth stuck inside a Harvard Mark Two computer relay in 1947. Engineers had to literally debug the machine by removing the insect!",
  "Technology makes everyday work effortless. DocuCraft AI handles all PDF manipulations and calculations securely inside your browser without uploading your files.",
  "Here is an inspiring thought: In 1995, JavaScript was created in just 10 days! Small consistent efforts create great web solutions.",
  "Here is a quick riddle: What has keys but cannot open locks? The answer is your keyboard!"
];

// 6. Complete 75+ Tool Knowledge Base
const siteKnowledgeBase = [
  // Document & PDF Tools
  { name: "Merge PDF", bn: "পিডিএফ জোড়া লাগানোর টুল", hi: "पीडीएफ मर्ज टूल", keywords: ["merge", "merger", "pdf jodo", "পিডিএফ জোড়া", "যুক্ত", "jodo"], url: "merge-pdf.html" },
  { name: "Split PDF", bn: "পিডিএফ স্প্লিট টুল", hi: "पीडीएफ स्प्लिट टूल", keywords: ["split", "separate", "tukde", "ভাগ", "কাটা", "splitter"], url: "split-pdf.html" },
  { name: "Compress PDF", bn: "পিডিএফ কম্প্রেস টুল", hi: "पीडीएफ कंप्रेस टूल", keywords: ["compress", "reduce size", "সাইজ কমানো", "কম্প্রেস", "chota karna"], url: "compress-pdf.html" },
  { name: "PDF Scanner & Enhancer", bn: "পিডিএফ স্ক্যানার", hi: "पीडीएफ स्कैनर", keywords: ["scanner", "scan", "enhance", "স্ক্যানার"], url: "pdf-scanner.html" },
  { name: "ZIP to PDF Converter", bn: "জিপ টু পিডিএফ কনভার্টার", hi: "ज़िप टू पीडीएफ", keywords: ["zip to pdf", "zip converter", "জিপ"], url: "zip-to-pdf.html" },
  { name: "Repair PDF", bn: "পিডিএফ রিপেয়ার টুল", hi: "पीडीएफ रिपेयर", keywords: ["repair", "fix pdf", "repair pdf", "মেরামত", "corrupt"], url: "repair-pdf.html" },
  { name: "Organize / Reorder Pages", bn: "পিডিএফ পেজ সাজানোর টুল", hi: "पेज रीऑर्डर टूल", keywords: ["organize", "reorder", "pages sequence", "সাজানো"], url: "organize-pdf.html" },
  { name: "Rotate PDF", bn: "পিডিএফ ঘোরানোর টুল", hi: "पीडीएफ रोटेट टूल", keywords: ["rotate", "ghumaana", "ঘোরানো"], url: "rotate-pdf.html" },
  { name: "Delete PDF Pages", bn: "পিডিএফ পেজ মুছে ফেলার টুল", hi: "पीडीएफ पेज हटाएं", keywords: ["delete pages", "remove pages", "বাদ দেওয়া", "মুছে ফেলা"], url: "delete-pdf.html" },
  { name: "JPG / PNG to PDF", bn: "ছবি থেকে পিডিএফ কনভার্টার", hi: "फोटो से पीडीएफ", keywords: ["jpg to pdf", "png to pdf", "image to pdf", "photo to pdf", "ছবি থেকে পিডিএফ"], url: "jpg-to-pdf.html" },
  { name: "Word to PDF", bn: "ওয়ার্ড টু পিডিএফ কনভার্টার", hi: "वर्ड टू पीडीएफ", keywords: ["word to pdf", "docx to pdf", "word converter"], url: "word-to-pdf.html" },
  { name: "Excel to PDF", bn: "এক্সেল টু পিডিএফ কনভার্টার", hi: "एक्सेल टू पीडीएफ", keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf"], url: "excel-to-pdf.html" },
  { name: "PowerPoint to PDF", bn: "পাওয়ারপয়েন্ট টু পিডিএফ", hi: "पावरपॉइंट টু পিডিএফ", keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "slides"], url: "powerpoint-to-pdf.html" },
  { name: "HTML to PDF Converter", bn: "এইচটিএমএল টু পিডিএফ", hi: "एचटीएमएल टू पीडीएफ", keywords: ["html to pdf", "web to pdf"], url: "html-to-pdf.html" },
  { name: "PDF to JPG / PNG", bn: "পিডিএফ থেকে ছবি কনভার্টার", hi: "पीडीएफ টু फोटो", keywords: ["pdf to jpg", "pdf to image", "pdf to photo", "pdf to png"], url: "pdf-to-jpg.html" },
  { name: "PDF to Word", bn: "পিডিএফ থেকে ওয়ার্ড কনভার্টার", hi: "पीडीएफ টু वर्ड", keywords: ["pdf to word", "pdf to docx"], url: "pdf-to-word.html" },
  { name: "PDF to Excel", bn: "পিডিএফ থেকে এক্সেল কনভার্টার", hi: "पीडीएफ টু एक्सेल", keywords: ["pdf to excel", "pdf to xlsx"], url: "pdf-to-excel.html" },
  { name: "PDF to Text (OCR Extractor)", bn: "পিডিএফ টেক্সট ও লেখার টুল", hi: "पीडीएफ टेक्स्ट एक्सट्रैक्टर", keywords: ["ocr", "pdf to text", "extract text", "লেখা বের করা"], url: "pdf-to-text.html" },
  { name: "Edit PDF", bn: "পিডিএফ এডিটর", hi: "पीडीएफ एडिटर", keywords: ["edit pdf", "write on pdf", "এডিট"], url: "edit-pdf.html" },
  { name: "Sign PDF", bn: "পিডিএফ সিগনেচার টুল", hi: "पीडीएफ साइन टूल", keywords: ["sign pdf", "signature on pdf", "হস্তাক্ষর", "সই"], url: "sign-pdf.html" },
  { name: "Watermark PDF", bn: "পিডিএফ ওয়াটারমার্ক টুল", hi: "पीडीएफ वॉटरमार्क", keywords: ["watermark", "জলছাপ"], url: "watermark-pdf.html" },
  { name: "Protect / Lock PDF", bn: "পিডিএফ লক টুল", hi: "पीडीएफ लॉक टूल", keywords: ["protect pdf", "lock pdf", "password", "পাসওয়ার্ড", "লক"], url: "protect-pdf.html" },
  { name: "Unlock PDF", bn: "পিডিএফ আনলক টুল", hi: "पीडीएफ अनलॉक टूल", keywords: ["unlock pdf", "remove password", "আনলক"], url: "unlock-pdf.html" },
  { name: "Add Page Numbers", bn: "পিডিএফ পেজ নম্বর টুল", hi: "पेज नंबर टूल", keywords: ["page numbers", "page number", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber, Photo & Design Tools
  { name: "Photo & Sign KB / MB Resizer", bn: "ফটো এবং সিগনেচার রিসাইজার", hi: "फोटो और साइन रिसाइजर", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "ছবি রিসাইজ"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", bn: "পরীক্ষার ফর্মের ফটো রিসাইজার", hi: "एग्जाम फोटो रिसाइजर", keywords: ["exam photo", "exam signature", "ssc photo", "upsc photo", "neet photo"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", bn: "পাসপোর্ট ফটো শিট মেকার", hi: "पासपोर्ट फोटो शीट मेकर", keywords: ["passport photo", "passport sheet", "পাসপোর্ট ছবি"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", bn: "ডিজিটাল সিগনেচার মেকার", hi: "डिजिटल सिग्नेचर मेकर", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", bn: "কিউআর কোড এবং ইউপিআই জেনারেটর", hi: "क्यूआर कोड जनरेटर", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", bn: "কালার পিকার টুল", hi: "कलर पिकर टूल", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", bn: "ইউটিউব থাম্বনেইল ডাউনলোডার", hi: "यूट्यूब थंबनेल डाउनलोडर", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },
  { name: "Barcode Generator (Code 128)", bn: "বারকোড জেনারেটর", hi: "बारकोड जनरेटर", keywords: ["barcode generator", "barcode", "বারকোড"], url: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", bn: "বেস৬৪ এনকোডার", hi: "बेस 64 एनकोडर", keywords: ["base64", "base64 encoder", "base64 decoder"], url: "base64.html" },

  // Finance & Calculator Tools
  { name: "Scientific Calculator", bn: "সায়েন্টিফিক ক্যালকুলেটর", hi: "वैज्ञानिक कैलकुलेटर", keywords: ["scientific calculator", "calculator", "math", "ক্যালকুলেটর", "hisab"], url: "calculator.html" },
  { name: "Loan EMI Calculator", bn: "লোন ইএমআই ক্যালকুলেটর", hi: "लोन ईएमआई कैलकुलेटर", keywords: ["loan emi", "emi calculator", "loan", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", bn: "লোন প্রিপেমেন্ট ক্যালকুলেটর", hi: "लोन प्रीपेमेंट टूल", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment.html" },
  { name: "GST Calculator", bn: "জিএসটি ক্যালকুলেটর", hi: "जीएसटी कैलकुलेटर", keywords: ["gst calculator", "gst", "জিএসটি"], url: "gst-calculator.html" },
  { name: "SIP Calculator", bn: "এসআইপি ক্যালকুলেটর", hi: "एसआईपी कैलकुलेटर", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], url: "sip-calculator.html" },
  { name: "Simple & Compound Interest", bn: "সুদ ও ইন্টারেস্ট ক্যালকুলেটর", hi: "ब्याज कैलकुलेटर", keywords: ["simple interest", "compound interest", "interest calculator", "সুদ"], url: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", bn: "এফডি এবং আরডি ক্যালকুলেটর", hi: "एफडी आरडी कैलकुलेटर", keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], url: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", bn: "সোনার দাম ও গহনা ক্যালকুলেটর", hi: "सोने का कैलकुलेटर", keywords: ["gold calculator", "gold price", "jewellery", "সোনার দাম"], url: "gold-calculator.html" },
  { name: "Inflation Calculator", bn: "মুদ্রাস্ফীতি ক্যালকুলেটর", hi: "मुद्रास्फीति कैलकुलेटर", keywords: ["inflation calculator", "inflation", "মুদ্রাস্ফীতি"], url: "inflation-calculator.html" },
  { name: "PPF Calculator", bn: "পিপিএফ ক্যালকুলেটর", hi: "पीपीएफ कैलकुलेटर", keywords: ["ppf calculator", "ppf", "পিপিএফ"], url: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", bn: "বিদ্যুৎ বিল ক্যালকুলেটর", hi: "बिजली बिल कैलकुलेटर", keywords: ["electricity bill", "power calculator", "বিদ্যুৎ বিল"], url: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", bn: "তেল খরচ ও মাইলেজ ক্যালকুলেটর", hi: "ईंधन लागत कैलकुलेटर", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], url: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", bn: "বেতন ও স্যালারি ক্যালকুলেটর", hi: "वेतन कैलकुलेटर", keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], url: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", bn: "বিল ভাগ ও স্প্লিট ক্যালকুলেটর", hi: "बिल स्प्लिट कैलकुलेटर", keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], url: "bill-split.html" },
  { name: "Discount & Sale Calculator", bn: "ছাড় ও ডিসকাউন্ট ক্যালকুলেটর", hi: "छूट कैलकुलेटर", keywords: ["discount calculator", "sale calculator", "ছাড়"], url: "discount-calculator.html" },
  { name: "Percentage Calculator", bn: "শতকরা ক্যালকুলেটর", hi: "प्रतिशत कैलकुलेटर", keywords: ["percentage calculator", "percentage", "শতকরা", "শতাংশ"], url: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", bn: "কথায় রূপান্তর করার টুল", hi: "नंबर से शब्द कनवर्टर", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], url: "number-to-words.html" },
  { name: "Land Area Converter", bn: "জমির পরিমাপ ও কাঠা ক্যালকুলেটর", hi: "जमीन मापक कैलकुलेटर", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], url: "land-converter.html" },

  // Productivity & Utility Tools
  { name: "DocuCraft AI Translator", bn: "ডকুক্ল্যাফট অনুবাদক", hi: "अनुवादक टूल", keywords: ["translator", "translate", "translation", "অনুবাদ", "dokocraft translator"], url: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", bn: "ভয়েস টাইপিং টুল", hi: "बोलकर लिखने का टूल", keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", bn: "টেক্সট টু স্পিচ অডিও টুল", hi: "टेक्स्ट टू स्पीच टूल", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", bn: "আনলিমিটেড নোটপ্যাড", hi: "टेक्स्ट नोटपैड", keywords: ["notepad", "notebook", "text notepad", "নোটপ্যাড"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", bn: "সরকারি চাকরির খবর", hi: "सरकारी नौकरी अलर्ट", keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], url: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", bn: "বয়স ক্যালকুলেটর", hi: "उम्र कैलकुलेटर", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], url: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", bn: "পরীক্ষার বয়স যোগ্যতা যাচাই", hi: "एग्जाम आयु पात्रता", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], url: "exam-eligibility.html" },
  { name: "1-Minute Typing Speed Test", bn: "টাইপিং স্পিড টেস্ট", hi: "टाइपिंग स्पीड टेस्ट", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test.html" },
  { name: "Daily Calorie & BMR Calculator", bn: "ক্যালোরি ক্যালকুলেটর", hi: "कैलोरी कैलकुलेटर", keywords: ["calorie calculator", "bmr calculator", "ক্যালোরি"], url: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", bn: "জল খাওয়ার লক্ষ্য ট্র্যাকার", hi: "पानी का लक्ष्य ट्रैकर", keywords: ["water intake", "water goal", "জল"], url: "water-intake.html" },
  { name: "Sleep Calculator", bn: "ঘুমের হিসাব ক্যালকুলেটর", hi: "नींद कैलकुलेटर", keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব", "ঘুম"], url: "sleep-calculator.html" },
  { name: "Random Password & PIN Generator", bn: "পাসওয়ার্ড ও পিন জেনারেটর", hi: "पासवर्ड जनरेटर", keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator.html" },
  { name: "Universal Unit Converter", bn: "ইউনিট কনভার্টার", hi: "यूनिट कनवर्टर", keywords: ["unit converter", "universal converter", "একক রূপান্তর"], url: "unit-converter.html" },
  { name: "Duplicate Line Remover", bn: "ডুপ্লিকেট লাইন রিমুভার", hi: "डुप्लिकेट लाइन रिमूवर", keywords: ["duplicate line remover", "remove duplicates"], url: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", bn: "টেক্সট উল্টানোর টুল", hi: "टेक्स्ट रिवर्स टूल", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], url: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", bn: "নম্বর থেকে শতাংশ ও সিজিপিএ", hi: "मार्क्स टू प्रतिशत", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], url: "marks-calculator.html" },
  { name: "Average & Grade Calculator", bn: "গ্রেড ক্যালকুলেটর", hi: "ग्रेड कैलकुलेटर", keywords: ["average calculator", "grade calculator"], url: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", bn: "বিল ও ইনভয়েস জেনারেটর", hi: "बिल जनरेटर", keywords: ["invoice generator", "bill generator", "বিল মেকার"], url: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", bn: "রিজিউমে ও সিভি মেকার", hi: "बायोडाटा मेकर", keywords: ["resume maker", "cv maker", "biodata", "রিজিউমে", "সিভি"], url: "resume-maker.html" },
  { name: "Prescription / Memo Maker", bn: "প্রেসক্রিপশন মেকার", hi: "प्रिस्क्रिप्शन मेकर", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], url: "prescription-maker.html" },
  { name: "Contact & Support Desk", bn: "যোগাযোগ ও হেল্প ডেস্ক", hi: "संपर्क और सहायता", keywords: ["contact us", "support desk", "helpline", "যোগাযোগ করো"], url: "contact.html" }
];

// 7. Conversational AI Handler
function handleSpecialAIQueries(query) {
  const q = query.toLowerCase().trim();

  // Creator Resume & Info
  if (q.includes("who made") || q.includes("developer") || q.includes("creator") || q.includes("who is indranil") || q.includes("indranil ruidas") || q.includes("ইন্দ্রনীল")) {
    speakText(creatorBio.fullStory, 'en-US');
    return true;
  }

  // Story & Timepass
  if (q.includes("story") || q.includes("bored") || q.includes("time pass") || q.includes("joke") || q.includes("গল্প বলো")) {
    const randomIndex = Math.floor(Math.random() * entertainingStories.length);
    speakText(entertainingStories[randomIndex], 'en-US');
    return true;
  }

  // 75+ Tools Info
  if (q.includes("how many tools") || q.includes("75") || q.includes("what can you do") || q.includes("features") || q.includes("কাজ")) {
    speakText("DocuCraft AI provides over 75 tools for PDF operations, image compression, financial calculations, unit conversions, and everyday office utilities.", 'en-US');
    return true;
  }

  // Direct Math Evaluation
  const mathRegex = /^(what is|calculate|solve|হিসাব করো|কত)?\s*([0-9\.\s\+\-\*\/\(\)\^%]+)$/i;
  const match = q.match(mathRegex);
  if (match && match[2] && match[2].length > 1) {
    try {
      const sanitized = match[2].replace(/\^/g, '**');
      const result = Function('"use strict";return (' + sanitized + ')')();
      if (!isNaN(result)) {
        speakText(`The answer is ${result}`, 'en-US');
        return true;
      }
    } catch (e) {}
  }

  return false;
}

// 8. Voice Matching & Navigation (High Precision)
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  if (handleSpecialAIQueries(raw)) return;

  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|chalu karo|চালু করো|খুলুন|খোল|দেখাও|খোলো|দিখাও)\s+/i, '')
    .trim();

  if (cleanQuery.length < 3) return;

  let bestMatchedItem = null;
  let maxScore = 0;

  siteKnowledgeBase.forEach(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    if (cleanQuery === nameLower) score += 120;
    else if (nameLower.includes(cleanQuery)) score += 80;

    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (cleanQuery === kwLower) score += 100;
      else if (cleanQuery.includes(kwLower)) score += 70;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatchedItem = item;
    }
  });

  if (bestMatchedItem && maxScore >= 60) {
    let toolName = bestMatchedItem.name;
    let speakMessage = `Opening ${toolName}`;

    if (lang === 'bn-IN') {
      speakMessage = `${bestMatchedItem.bn || toolName} খোলা হচ্ছে...`;
    } else if (lang === 'hi-IN') {
      speakMessage = `${bestMatchedItem.hi || toolName} खोला जा रहा है...`;
    }

    speakText(speakMessage, lang);

    setTimeout(() => {
      window.location.href = bestMatchedItem.url;
    }, 900);
  }
}

// 9. Speech Recognition Controller
function toggleVoiceInput(inputElementId = 'toolSearchInput') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const micBtn = document.getElementById('voiceSearchBtn') || document.querySelector('.search-bar svg, .search-box svg');
  const statusElem = document.getElementById('voice-status');

  if (isListening && globalRecognition) {
    shouldRestart = false;
    globalRecognition.stop();
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (statusElem) statusElem.innerText = "";
    window.speechSynthesis.cancel();
    return;
  }

  shouldRestart = true;
  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;
  globalRecognition.lang = navigator.language || 'en-US';

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";
  };

  globalRecognition.onresult = function(event) {
    if (isAssistantSpeaking) return;

    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }

    const cleanTranscript = transcript.trim();
    if (cleanTranscript) {
      const inputField = document.getElementById(inputElementId);
      if (inputField) inputField.value = cleanTranscript;
      scrollToMatchedTool(cleanTranscript);
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

  // Speaks welcome prompt first, then mic activates
  playIndranilGreeting(() => {
    try {
      globalRecognition.start();
    } catch (err) {
      console.warn("Recognition delay:", err);
    }
  });
}

// 10. Voice Gender Switcher & UI Injection
function injectVoiceGenderSwitcher() {
  const micElement = document.getElementById('voiceSearchBtn') || document.querySelector('.search-bar svg, .search-box svg');
  if (!micElement) return;

  const parent = micElement.parentElement;
  if (!parent) return;

  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  const oldBadge = parent.querySelector('.ai-voice-badge');
  if (oldBadge) oldBadge.remove();

  const badge = document.createElement('span');
  badge.className = 'ai-voice-badge';
  badge.innerText = 'AI';
  badge.style.position = 'absolute';
  badge.style.bottom = '-4px';
  badge.style.right = '-2px';
  badge.style.fontSize = '9px';
  badge.style.fontWeight = 'bold';
  badge.style.color = '#38bdf8';
  badge.style.pointerEvents = 'none';
  parent.appendChild(badge);

  const oldSwitcher = parent.querySelector('.voice-switch-btn');
  if (oldSwitcher) oldSwitcher.remove();

  const switcher = document.createElement('button');
  switcher.className = 'voice-switch-btn';
  switcher.type = 'button';
  switcher.title = 'Switch Voice (Female / Male)';
  switcher.innerText = selectedVoiceGender === 'female' ? '👩 Female' : '👨 Male';
  switcher.style.position = 'absolute';
  switcher.style.top = '-28px';
  switcher.style.right = '0';
  switcher.style.background = 'rgba(15, 23, 42, 0.9)';
  switcher.style.color = '#38bdf8';
  switcher.style.border = '1px solid rgba(56, 189, 248, 0.4)';
  switcher.style.borderRadius = '12px';
  switcher.style.padding = '2px 8px';
  switcher.style.fontSize = '10px';
  switcher.style.fontWeight = '600';
  switcher.style.cursor = 'pointer';
  switcher.style.zIndex = '10';

  switcher.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedVoiceGender = selectedVoiceGender === 'female' ? 'male' : 'female';
    localStorage.setItem('docucraft_voice_gender', selectedVoiceGender);
    switcher.innerText = selectedVoiceGender === 'female' ? '👩 Female' : '👨 Male';
    speakText(selectedVoiceGender === 'female' ? "Female voice selected." : "Male voice selected.", 'en-US');
  });

  parent.appendChild(switcher);

  micElement.style.cursor = 'pointer';
  micElement.onclick = (e) => {
    e.preventDefault();
    toggleVoiceInput('toolSearchInput');
  };
}

// 11. Strict Safe URL Resolver
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

// 12. Recent Tools Tracker
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

// 13. DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  injectVoiceGenderSwitcher();
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
