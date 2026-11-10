/* =========================================================
   DocuCraft AI - Advanced Multi-Language Voice AI Engine
   Developer: Indranil Ruidas
   Features: Male/Female Voice Switcher, CV Bio, Smart Calculator,
             Storyteller/Time-Pass Mode, and 75+ Tool Navigation.
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;
let shouldRestart = false;
let hasPlayedInitialGreeting = false;

// Voice Gender State: 'female' (default) or 'male'
let selectedVoiceGender = localStorage.getItem('docucraft_voice_gender') || 'female';

// 1. System Voices Loader & Initializer
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// 2. Multi-Device Voice Synthesis with Male/Female Pitch & Voice Selector
function speakText(text, langCode = 'en-US') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  const targetLang = (langCode || 'en').toLowerCase().split('-')[0];

  // Filter voices matching the language
  const matchedVoices = voices.filter(v => 
    v.lang.toLowerCase() === langCode.toLowerCase() || 
    v.lang.toLowerCase().startsWith(targetLang)
  );

  let selectedVoice = null;

  if (matchedVoices.length > 0) {
    if (selectedVoiceGender === 'female') {
      // Look for natural female voice markers
      selectedVoice = matchedVoices.find(v => 
        /female|zira|samantha|victoria|karen|veena|lekha|priya|google.*female/i.test(v.name)
      ) || matchedVoices[0];
      utterance.pitch = 1.15;
      utterance.rate = 0.96;
    } else {
      // Look for natural male voice markers
      selectedVoice = matchedVoices.find(v => 
        /male|david|george|rishi|neel|google.*male|guy/i.test(v.name)
      ) || (matchedVoices.length > 1 ? matchedVoices[1] : matchedVoices[0]);
      utterance.pitch = 0.88;
      utterance.rate = 0.94;
    }
    utterance.voice = selectedVoice;
  } else {
    // Fallback pitch modulation if exact voice isn't returned by OS
    utterance.pitch = selectedVoiceGender === 'female' ? 1.2 : 0.85;
    utterance.rate = 0.95;
  }

  utterance.lang = langCode;
  window.speechSynthesis.speak(utterance);
}

// 3. Compact & Smart Welcome Greeting (One-time per visit, No Boring Fluff)
function playSiteInitialGreeting() {
  // Checks if the user already heard the greeting in this session
  if (sessionStorage.getItem('docucraft_greeted')) return;
  sessionStorage.setItem('docucraft_greeted', 'true');

  // Short, crisp and modern welcome
  const greetingText = "Hi, welcome to DocuCraft AI! How can I help you today?";
  speakText(greetingText, 'en-US');
}

// First User Interaction Detection
document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 4. Proactive Mobile Welcome: Greets and directly invites users to talk
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

  // Proactive problem-solving prompt
  const greetingText = `Welcome to DocuCraft AI. Today is ${dayName}, ${monthName} ${date}, ${year}, and the current time is ${hours}:${minutesFormatted} ${ampm}. Tell me, what problem are you facing with your documents or tools? Tap the microphone and talk with me. I am right here to help you.`;

  speakText(greetingText, 'en-US');
}

// Ensure trigger on mobile touch/tap or desktop click
document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 5. Microphone Activation Prompt
function playIndranilGreeting() {
  const greeting = "I am Indranil. How can I help you today?";
  speakText(greeting, 'en-US');
}

// Detect language of spoken query
function detectLanguage(text) {
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  return 'en-US';
}

// 6. Creator Biography & Interactive Storytelling Knowledge Base
const creatorBio = {
  name: "Indranil Ruidas",
  fullStory: "DocuCraft AI was developed and architected by Indranil Ruidas, a tech professional and frontend developer from Ajhapur, Purba Bardhaman, West Bengal. Indranil holds a Diploma in Computer Science and Technology from Sylvan Polytechnic College with 80% marks, an ITI qualification from Sathish Chandra ITI, and a Certificate in Communication and IT from Anudip Foundation. He has over 3 years of hands-on experience working across digital services, CCTV operations, customer assistance, and marketing with organizations like Jus Jumpin, Ezeepay Digital Services, Bharti AXA, and Bajaj Allianz. He created DocuCraft AI as a free, powerful client-side utility hub for everyone."
};

const entertainingStories = [
  "Here is an inspiring thought: In 1995, the creator of JavaScript built the foundation of the modern web in just 10 days. Always remember, small consistent steps lead to incredible creations. What would you like to build or solve today?",
  "Did you know? The first computer bug was an actual real-life moth stuck inside a Harvard Mark Two computer relay in 1947. Engineers literally had to debug the machine by removing the insect! Quite fascinating, isn't it?",
  "Take a deep breath and relax. Technology is here to make your life effortless. DocuCraft AI handles all your heavy PDF and calculation chores in seconds so you have more time to enjoy your coffee.",
  "Here is a quick brain teaser: What has keys but can't open locks, has space but no room, and allows you to enter but never leave? The answer is your keyboard! Let me know if you need to test your typing speed."
];

// 7. Comprehensive Knowledge Base for 75+ Tools
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
  { name: "Add Page Numbers", bn: "পিডিএফ পেজ নম্বর টুল", hi: "पेज नंबर टूल", keywords: ["page numbers", "page number", "পেজ নম্বর"], url: "add-page-numbers.html" },

  // Cyber & Photo Tools
  { name: "Photo & Sign KB / MB Resizer", bn: "ফটো এবং সিগনেচার রিসাইজার", hi: "फोटो और साइन रिसाइजर", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার", "ছবি রিসাইজ"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", bn: "পরীক্ষার ফর্মের ফটো রিসাইজার", hi: "एग्जाम फोटो रिसाइजर", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", bn: "পাসপোর্ট ফটো শিট মেকার", hi: "पासपोर्ट फोटो शीट मेकर", keywords: ["passport photo", "passport", "পাসপোর্ট ছবি", "passport size photo"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", bn: "ডিজিটাল সিগনেচার মেকার", hi: "डिजिटल सिग्नेचर मेकर", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", bn: "কিউআর কোড এবং ইউপিআই জেনারেটর", hi: "क्यूआर कोड जनरेटर", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", bn: "কালার পিকার টুল", hi: "कलर पिकर टूल", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", bn: "ইউটিউব থাম্বনেইল ডাউনলোডার", hi: "यूट्यूब थंबनेल डाउनलोडर", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },

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

  // Utilities & Productivity
  { name: "DocuCraft AI Translator", bn: "ডকুক্ল্যাফট অনুবাদক", hi: "अनुवादक टूल", keywords: ["translator", "translate", "translation", "অনুবাদ", "dokocraft translator"], url: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", bn: "ভয়েস টাইপিং টুল", hi: "बोलकर लिखने का टूल", keywords: ["pitch to text", "voice typing", "speech to text", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", bn: "টেক্সট টু স্পিচ অডিও টুল", hi: "टेक्स्ट टू स्पीच टूल", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", bn: "আনলিমিটেড নোটপ্যাড", hi: "टेक्स्ट नोटपैড", keywords: ["notepad", "notebook", "text notepad", "নোটপ্যাড"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", bn: "সরকারি চাকরির খবর", hi: "सरकारी नौकरी अलर्ट", keywords: ["govt job", "job alert", "sarkari result", "চাকরি"], url: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", bn: "বয়স ক্যালকুলেটর", hi: "उम्र कैलकुलेटर", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর", "বয়স"], url: "age-calculator.html" },
  { name: "Exam Age Eligibility Checker", bn: "পরীক্ষার বয়স যোগ্যতা যাচাই", hi: "एग्जाम आयु पात्रता", keywords: ["age eligibility", "eligibility checker", "যোগ্যতা"], url: "exam-eligibility.html" },
  { name: "1-Minute Typing Speed Test", bn: "টাইপিং স্পিড টেস্ট", hi: "टाइपिंग स्पीड टेस्ट", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test.html" },
  { name: "Daily Calorie & BMR Calculator", bn: "ক্যালোরি ক্যালকুলেটর", hi: "कैलोरी कैलकुलेटर", keywords: ["calorie calculator", "bmr calculator", "ক্যালোরি"], url: "calorie-calculator.html" },
  { name: "Daily Water Intake Goal", bn: "জল খাওয়ার লক্ষ্য ট্র্যাকার", hi: "पानी का लक्ष्य ट्रैकर", keywords: ["water intake", "water goal", "জল"], url: "water-intake.html" },
  { name: "Sleep Calculator", bn: "ঘুমের হিসাব ক্যালকুলেটর", hi: "नींद कैलकुलेटर", keywords: ["sleep calculator", "sleep cycle", "ঘুমের হিসাব", "ঘুম"], url: "sleep-calculator.html" },
  { name: "Barcode Generator (Code 128)", bn: "বারকোড জেনারেটর", hi: "बारकोड जनरेटर", keywords: ["barcode generator", "barcode", "বারকোড"], url: "barcode-generator.html" },
  { name: "Base64 Encoder & Decoder", bn: "বেস৬৪ এনকোডার", hi: "बेस 64 एनकोडर", keywords: ["base64", "base64 encoder", "base64 decoder"], url: "base64.html" },
  { name: "Random Password & PIN Generator", bn: "পাসওয়ার্ড ও পিন জেনারেটর", hi: "पासवर्ड जनरेटर", keywords: ["password generator", "pin generator", "random password", "পাসওয়ার্ড জেনারেটর"], url: "password-generator.html" },
  { name: "Universal Unit Converter", bn: "ইউনিট কনভার্টার", hi: "यूनिट कनवर्टर", keywords: ["unit converter", "universal converter", "একক রূপান্তর"], url: "unit-converter.html" },
  { name: "Duplicate Line Remover", bn: "ডুপ্লিকেট লাইন রিমুভার", hi: "डुप्लिकेट लाइन रिमूवर", keywords: ["duplicate line remover", "remove duplicates"], url: "duplicate-remover.html" },
  { name: "Text Reverse & Flip Tool", bn: "টেক্সট উল্টানোর টুল", hi: "टेक्स्ट रिवर्स टूल", keywords: ["text reverse", "flip text", "লেখা উল্টানো"], url: "text-reverse.html" },
  { name: "Marks to Percentage & CGPA", bn: "নম্বর থেকে শতাংশ ও সিজিপিএ", hi: "मार्क्स टू प्रतिशत", keywords: ["marks to percentage", "cgpa calculator", "cgpa"], url: "marks-calculator.html" },
  { name: "Average & Grade Calculator", bn: "গ্রেড ক্যালকুলেটর", hi: "ग्रेड कैलकुलेटर", keywords: ["average calculator", "grade calculator"], url: "grade-calculator.html" },
  { name: "Invoice / Bill Generator", bn: "বিল ও ইনভয়েস জেনারেটর", hi: "बिल जनरेटर", keywords: ["invoice generator", "bill generator", "বিল মেকার"], url: "invoice-generator.html" },
  { name: "Resume / CV Maker to PDF", bn: "রিজিউমে ও সিভি মেকার", hi: "बायोडाटा मेकर", keywords: ["resume maker", "cv maker", "biodata", "রিজিউমে", "সিভি"], url: "resume-maker.html" },
  { name: "Prescription / Memo Maker", bn: "প্রেসক্রিপশন মেকার", hi: "प्रिस्क्रिप्शन मेकर", keywords: ["prescription maker", "memo maker", "প্রেসক্রিপশন"], url: "prescription-maker.html" },
  { name: "Contact & Support Desk", bn: "যোগাযোগ ও হেল্প ডেস্ক", hi: "संपर्क और सहायता", keywords: ["contact", "support", "help", "সাহায্য", "যোগাযোগ"], url: "contact.html" }
];

// 8. Conversational AI Handler (Bio, Stories, Calculators, Extra Knowledge)
function handleSpecialAIQueries(query) {
  const q = query.toLowerCase().trim();

  // A. Creator Resume & Bio
  if (q.includes("who made") || q.includes("developer") || q.includes("creator") || q.includes("owner") || q.includes("who is indranil") || q.includes("indranil ruidas") || q.includes("ইন্দ্রনীল") || q.includes("bio") || q.includes("cv")) {
    speakText(creatorBio.fullStory, 'en-US');
    return true;
  }

  // B. Time-Pass, Entertainment & Stories
  if (q.includes("story") || q.includes("bored") || q.includes("time pass") || q.includes("tell me something") || q.includes("joke") || q.includes("কথা বলো") || q.includes("গল্প বলো")) {
    const randomIndex = Math.floor(Math.random() * entertainingStories.length);
    speakText(entertainingStories[randomIndex], 'en-US');
    return true;
  }

  // C. 75+ Tools & Capabilities Overview
  if (q.includes("how many tools") || q.includes("75") || q.includes("features") || q.includes("all tools") || q.includes("what can you do") || q.includes("কাজ")) {
    const speech = "DocuCraft AI is powered by over 75 high-speed client-side tools. We provide comprehensive PDF utilities, photo and signature resizers for government exams, finance calculators, text tools, and QR code generators. All processing happens safely inside your browser without uploading files to any external server.";
    speakText(speech, 'en-US');
    return true;
  }

  // D. General Calculator & Math Answering
  const mathRegex = /^(what is|calculate|solve|হিসাব করো|কত)?\s*([0-9\.\s\+\-\*\/\(\)\^%]+)$/i;
  const match = q.match(mathRegex);
  if (match && match[2] && match[2].length > 1) {
    try {
      const sanitized = match[2].replace(/\^/g, '**');
      const result = Function('"use strict";return (' + sanitized + ')')();
      if (!isNaN(result)) {
        speakText(`The calculated result is ${result}`, 'en-US');
        return true;
      }
    } catch (e) {}
  }

  return false;
}

// 9. Voice Matching & Autonomous Navigation
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const lang = detectLanguage(raw);

  // Check if AI knowledge handler answers first
  if (handleSpecialAIQueries(raw)) return;

  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|chalu karo|চালু করো|খুলুন|খোল|দেখাও|খুলবে|खोलो|दिखाओ)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

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

  const cards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .grid-item, a[href*=".html"]'));
  let matchedCard = null;

  if (bestMatchedItem && maxScore >= 40) {
    const targetUrlPart = bestMatchedItem.url.toLowerCase().replace('.html', '');
    matchedCard = cards.find(c => {
      const href = (c.getAttribute('href') || c.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      return href.includes(targetUrlPart);
    });
  }

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

// 10. Speech Recognition Controller
function toggleVoiceInput(inputElementId = 'toolSearchInput', callback) {
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
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    return;
  }

  shouldRestart = true;
  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = true;
  globalRecognition.interimResults = true;
  globalRecognition.lang = navigator.language || 'en-US';

  let hasGreeted = false;

  globalRecognition.onstart = function() {
    isListening = true;
    if (micBtn) micBtn.classList.add('listening');
    if (statusElem) statusElem.innerText = "Listening...";

    if (!hasGreeted) {
      hasGreeted = true;
      playIndranilGreeting();
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
    console.warn("Speech Recognition notice:", event.error);
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

// 11. Floating Voice Switcher Control (Female / Male Switcher)
function injectVoiceGenderSwitcher() {
  const micElement = document.getElementById('voiceSearchBtn') || document.querySelector('.search-bar svg, .search-box svg');
  if (!micElement) return;

  const parent = micElement.parentElement;
  if (!parent) return;

  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  // Inject AI Label on Mic
  if (!parent.querySelector('.ai-voice-badge')) {
    const badge = document.createElement('span');
    badge.className = 'ai-voice-badge';
    badge.innerText = 'AI';
    badge.style.position = 'absolute';
    badge.style.bottom = '-4px';
    badge.style.right = '-2px';
    badge.style.fontSize = '9px';
    badge.style.fontWeight = 'bold';
    badge.style.color = '#38bdf8';
    badge.style.textShadow = '0 0 5px rgba(56, 189, 248, 0.8)';
    badge.style.pointerEvents = 'none';
    badge.style.lineHeight = '1';
    parent.appendChild(badge);
  }

  // Inject Compact Male / Female Switcher Button
  if (!parent.querySelector('.voice-switch-btn')) {
    const switcher = document.createElement('button');
    switcher.className = 'voice-switch-btn';
    switcher.type = 'button';
    switcher.title = 'Switch Voice (Female / Male)';
    switcher.innerText = selectedVoiceGender === 'female' ? '👩 Female' : '👨 Male';
    switcher.style.position = 'absolute';
    switcher.style.top = '-28px';
    switcher.style.right = '0';
    switcher.style.background = 'rgba(15, 23, 42, 0.85)';
    switcher.style.color = '#38bdf8';
    switcher.style.border = '1px solid rgba(56, 189, 248, 0.4)';
    switcher.style.borderRadius = '12px';
    switcher.style.padding = '2px 8px';
    switcher.style.fontSize = '10px';
    switcher.style.fontWeight = '600';
    switcher.style.cursor = 'pointer';
    switcher.style.backdropFilter = 'blur(4px)';
    switcher.style.zIndex = '10';
    switcher.style.transition = 'all 0.2s ease';

    switcher.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedVoiceGender = selectedVoiceGender === 'female' ? 'male' : 'female';
      localStorage.setItem('docucraft_voice_gender', selectedVoiceGender);
      switcher.innerText = selectedVoiceGender === 'female' ? '👩 Female' : '👨 Male';
      
      const confirmMsg = selectedVoiceGender === 'female' 
        ? "Switched to female assistant voice." 
        : "Switched to male assistant voice.";
      speakText(confirmMsg, 'en-US');
    });

    parent.appendChild(switcher);
  }

  micElement.style.cursor = 'pointer';
  micElement.addEventListener('click', () => {
    toggleVoiceInput('toolSearchInput');
  });
}

// 12. Strict Safe URL Resolver
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

// 13. Recent Tools Tracker
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

// 14. DOM Initializer
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
