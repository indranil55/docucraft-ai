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

// 3. Initial Dynamic Welcome Greeting (Date, Time, Day)
// স্ক্রিনে প্রথমবার স্পর্শ বা ক্লিক করা মাত্রই সবার ফোনে এটি বেজে উঠবে
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

  // আপনার ভিডিওতে থাকা মূল ডায়লগ
  const greetingText = `Welcome to DocuCraft AI. Today is ${dayName}, ${monthName} ${date}, ${year}, and the current time is ${hours}:${minutesFormatted} ${ampm}. Have a productive day.`;

  speakText(greetingText, 'en-US');
}

// প্রথম ইউজার ইন্টারেকশন শনাক্তকরণ
document.addEventListener('click', () => playSiteInitialGreeting(), { once: true });
document.addEventListener('touchstart', () => playSiteInitialGreeting(), { once: true });

// 4. Microphone Assistant Welcome (I am Indranil)
function playIndranilGreeting(userLangCode = 'en-US') {
  const lang = (userLangCode || 'en').toLowerCase().split('-')[0];
  let greeting = "I am Indranil. How can I help you?";

  if (lang === 'bn') {
    greeting = "আমি ইন্দ্রনীল। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
  } else if (lang === 'hi') {
    greeting = "मैं इंद्रनील हूँ। मैं आपकी क्या मदद कर सकता हूँ?";
  }

  speakText(greeting, userLangCode);
}

// 5. Tool Knowledge Base (English, Hindi, Bengali)
const siteKnowledgeBase = [
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
  { name: "Photo & Sign KB / MB Resizer", keywords: ["resizer", "resize", "photo resizer", "sign resizer", "kb resizer", "mb resizer", "jb resizer", "फोटो रिसाइजर", "রিসাইজার"], url: "photo-resizer.html" },
  { name: "Exam Photo & Signature Resizer", keywords: ["exam photo", "exam signature", "ssc", "upsc", "neet", "exam form"], url: "exam-resizer.html" },
  { name: "Passport Photo Sheet Maker", keywords: ["passport photo", "passport", "पासपोर्ट फोटो", "পাসপোর্ট ছবি"], url: "passport-photo.html" },
  { name: "Digital Signature Maker (Sign Pad)", keywords: ["digital signature", "sign pad", "draw sign", "ডিজিটাল সিগনেচার"], url: "signature-maker.html" },
  { name: "QR Code & UPI Generator", keywords: ["qr code", "qr", "upi qr", "কিউআর কোড"], url: "qr-generator.html" },
  { name: "Color Picker & HEX Extractor", keywords: ["color picker", "hex extractor", "color code", "কালার পিকার"], url: "color-picker.html" },
  { name: "YouTube Thumbnail Downloader", keywords: ["thumbnail", "youtube thumbnail", "yt thumbnail", "থাম্বনেইল"], url: "youtube-thumbnail.html" },
  { name: "Scientific Calculator", keywords: ["scientific calculator", "calculator", "math", "हिसाब", "ক্যালকুলেটর"], url: "calculator.html" },
  { name: "Loan EMI Calculator", keywords: ["loan emi", "emi calculator", "loan", "किस्त", "লোন", "ইএমআই"], url: "loan-emi.html" },
  { name: "Loan Prepayment & Interest Saver", keywords: ["prepayment", "interest saver", "loan prepayment"], url: "loan-prepayment.html" },
  { name: "GST Calculator", keywords: ["gst calculator", "gst", "जीएसटी", "জিএসটি"], url: "gst-calculator.html" },
  { name: "SIP Calculator", keywords: ["sip calculator", "sip", "mutual fund", "এসআইপি"], url: "sip-calculator.html" },
  { name: "Simple & Compound Interest", keywords: ["simple interest", "compound interest", "interest calculator", "ब्याज", "সুদ"], url: "interest-calculator.html" },
  { name: "FD & RD Maturity Calculator", keywords: ["fd calculator", "rd calculator", "fixed deposit", "এফডি"], url: "fd-rd-calculator.html" },
  { name: "Gold & Jewellery Price Calculator", keywords: ["gold calculator", "gold price", "jewellery", "सोना", "সোনার দাম"], url: "gold-calculator.html" },
  { name: "Inflation Calculator", keywords: ["inflation calculator", "inflation", "মুদ্রাস্ফীতি"], url: "inflation-calculator.html" },
  { name: "PPF Calculator", keywords: ["ppf calculator", "ppf", "পিপিএফ"], url: "ppf-calculator.html" },
  { name: "Electricity Bill & Power Calculator", keywords: ["electricity bill", "power calculator", "electric bill", "बिजली बिल", "বিদ্যুৎ বিল"], url: "electricity-calculator.html" },
  { name: "Fuel Cost & Trip Mileage Calculator", keywords: ["fuel cost", "mileage calculator", "petrol", "diesel", "তেল খরচ"], url: "fuel-calculator.html" },
  { name: "Take-Home Salary & CTC Calculator", keywords: ["salary calculator", "ctc calculator", "in hand salary", "বেতন"], url: "salary-calculator.html" },
  { name: "Friend Bill Split & Tip Calculator", keywords: ["bill split", "split bill", "tip calculator", "বিল ভাগ"], url: "bill-split.html" },
  { name: "Discount & Sale Calculator", keywords: ["discount calculator", "sale calculator", "ছাড়"], url: "discount-calculator.html" },
  { name: "Percentage Calculator", keywords: ["percentage calculator", "percentage", "শতকরা", "শতাংশ"], url: "percentage-calculator.html" },
  { name: "Number to Words (Cheque Amount)", keywords: ["number to words", "cheque amount", "কথায় রূপান্তর"], url: "number-to-words.html" },
  { name: "Land Area Converter", keywords: ["land area converter", "land converter", "bigha", "katha", "জমির মাপ", "বিঘা", "কাঠা"], url: "land-converter.html" },
  { name: "DocuCraft AI Translator", keywords: ["translator", "translate", "translation", "অনুবাদ", "अनुवाद"], url: "translator.html" },
  { name: "Pitch to Text (Voice Typing)", keywords: ["pitch to text", "voice typing", "speech to text", "बोलकर लिखना", "ভয়েস টাইপিং"], url: "voice-typing.html" },
  { name: "Text-to-Speech Converter", keywords: ["text to speech", "tts", "speak text", "টেক্সট টু স্পিচ"], url: "text-to-speech.html" },
  { name: "Unlimited Text Notepad", keywords: ["notepad", "notebook", "text notepad", "unlimited notepad", "नोटपैड", "নোটপ্যাড", "নোটবুক"], url: "notepad.html" },
  { name: "Govt Job Alerts & Results", keywords: ["govt job", "job alert", "sarkari result", "सरकारी नौकरी", "চাকরি"], url: "job-alerts.html" },
  { name: "Age Calculator (Exam DOB)", keywords: ["age calculator", "calculate age", "বয়স ক্যালকুলেটর"], url: "age-calculator.html" },
  { name: "1-Minute Typing Speed Test", keywords: ["typing speed test", "typing test", "speed test", "টাইপিং টেস্ট"], url: "typing-test.html" },
  { name: "Resume / CV Maker to PDF", keywords: ["resume maker", "cv maker", "biodata", "बायोडाटा", "রিজিউমে"], url: "resume-maker.html" }
];

// 6. Accurate Tool Matching & Direct Navigation
function scrollToMatchedTool(query) {
  if (!query) return;

  const raw = query.toLowerCase().trim();
  const cleanQuery = raw
    .replace(/^(open|show|find|go to|launch|cholo|dekhao|kholo|please|tool|khol|kholo ji|chalu karo|চালু করো|খুলুন|খোল|দেখাও)\s+/i, '')
    .trim();

  if (cleanQuery.length < 2) return;

  // 1. Check in Knowledge Base
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

  // 4. Highlight, Scroll & Open
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
    }, 600);
  } else if (bestMatchedItem && maxScore >= 50) {
    window.location.href = bestMatchedItem.url;
  }
}

// 7. Voice Input (Speech Recognition)
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
    console.warn("Speech Recognition error:", event.error);
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
} full file ta baniye dao ar word ar sob bhasai jate add hoi je  bhasai bolbe sy moto uttor debe
