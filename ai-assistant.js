/* =========================================================
   DocuCraft AI - Ultra-Fast Universal Voice Assistant
   Developer: Indranil Ruidas
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;

function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

function speakVoiceResponse(text, lang = 'en-US') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = lang;

    if (availableVoices.length > 0) {
      const prefix = lang.slice(0, 2).toLowerCase();
      const matched = availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (matched) utterance.voice = matched;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error(e);
  }
}

// Element-ke center-e scroll kore highlight o direct open kora
function focusAndActivateElement(el) {
  if (!el) return;
  
  // Jodi kono category filter hidden kore rakhe, 'All' tab trigger kora
  const allTabBtn = document.querySelector('.filter-btn[onclick*="all"], button[onclick*="all"]');
  if (allTabBtn && !allTabBtn.classList.contains('active')) {
    allTabBtn.click();
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  
  el.style.transition = 'all 0.25s ease';
  el.style.outline = '4px solid #6366f1';
  el.style.transform = 'scale(1.03)';
  
  setTimeout(() => {
    // Card-er bhetore thaka actual link ba button click kora
    const actionTarget = el.querySelector('a, button, [onclick]') || el;
    if (actionTarget.tagName === 'A' && actionTarget.href) {
      actionTarget.click();
      if (!actionTarget.getAttribute('onclick')) {
        window.location.href = actionTarget.href;
      }
    } else {
      actionTarget.click();
    }
    
    setTimeout(() => {
      el.style.outline = '';
      el.style.transform = '';
    }, 1200);
  }, 200);
}

// Multilingual keywords normalizer (Bengali, Hindi, English)
function normalizeVoiceQuery(query) {
  let q = query.toLowerCase().trim();

  const translations = [
    { regex: /(typing|type|টাইপিং|টাইপ|স্পিড টেস্ট)/gi, val: 'typing test' },
    { regex: /(মার্জ|যুক্ত|একসাথে|জোড়া|জোড়া|merge)/gi, val: 'merge' },
    { regex: /(কম্প্রেস|ছোট|সাইজ কমা|সংকুচিত|compress)/gi, val: 'compress' },
    { regex: /(পিডিএফ|ডকুমেন্ট|pdf)/gi, val: 'pdf' },
    { regex: /(ছবি|ফটো|ইমেজ|photo|image|picture)/gi, val: 'photo image' },
    { regex: /(রিসাইজ|মাপ বদল|কেবি|এমবি|resize|kb|mb)/gi, val: 'resizer kb' },
    { regex: /(স্বাক্ষর|সাইন|সহি|signature|sign)/gi, val: 'signature sign' },
    { regex: /(কনভার্ট|রূপান্তর|convert)/gi, val: 'convert' },
    { regex: /(ক্যালকুলেটর|হিসাব|গণনা|calculator|calculate)/gi, val: 'calculator' },
    { regex: /(অনুবাদ|ট্রান্সলেটর|ভাষান্তর|translate|translator)/gi, val: 'translator translate' },
    { regex: /(বিদ্যুৎ|কারেন্ট|বিল|electricity|power|bill)/gi, val: 'electricity bill' },
    { regex: /(কিউআর|বারকোড|ইউপিআই|qr|barcode|upi)/gi, val: 'qr upi' },
    { regex: /(চাকরি|জব|সরকারি|job|jobs|alert|govt)/gi, val: 'govt job alert' },
    { regex: /(পাসওয়ার্ড|সিকিউরিটি|password|security)/gi, val: 'password' },
    { regex: /(ওয়াটারমার্ক|watermark)/gi, val: 'watermark' },
    { regex: /(resume|রেজিউমে|সিভি|cv)/gi, val: 'resume' },
    { regex: /(speed test|স্পিড|ইন্টারনেট)/gi, val: 'speed test' },
    { regex: /(age|বয়স|বয়স)/gi, val: 'age' }
  ];

  translations.forEach(t => {
    q = q.replace(t.regex, t.val);
  });

  return q;
}

function openSiteToolDirectly(toolQuery) {
  const rawQ = toolQuery.trim();
  const q = normalizeVoiceQuery(toolQuery);

  // Creator & Developer Information
  if (
    q.includes('who made you') || 
    q.includes('who created you') || 
    q.includes('developer') || 
    q.includes('creator') || 
    q.includes('indranil') ||
    rawQ.includes('কে বানিয়েছে') || 
    rawQ.includes('কে তৈরি করেছে') ||
    rawQ.includes('ইন্দ্রনীল')
  ) {
    speakVoiceResponse("I was created and developed by Indranil Ruidas as the smart voice assistant for DocuCraft AI.", 'en-US');
    return true;
  }

  // Modals check (Direct popup)
  if (q.includes('calculator') && !q.includes('gst') && !q.includes('emi') && !q.includes('sip') && !q.includes('bmr')) {
    if (typeof openCalculatorModal === 'function') openCalculatorModal();
    else {
      const el = document.querySelector('#calculatorModalBtn, [data-tool="calculator"], #calculator-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Calculator.", 'en-US');
    return true;
  }

  if (q.includes('translator') || q.includes('translate')) {
    if (typeof openTranslatorModal === 'function') openTranslatorModal();
    else {
      const el = document.querySelector('#translatorModalBtn, [data-tool="translator"], #translator-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Translator.", 'en-US');
    return true;
  }

  if (q.includes('qr') || q.includes('upi')) {
    if (typeof openQrModal === 'function') openQrModal();
    else {
      const el = document.querySelector('#qrModalBtn, [data-tool="qr-generator"], #qr-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening QR Code Generator.", 'en-US');
    return true;
  }

  if (q.includes('electricity') || (q.includes('power') && q.includes('bill'))) {
    if (typeof openElectricityModal === 'function') openElectricityModal();
    else {
      const el = document.querySelector('#electricityModalBtn, [data-tool="electricity"], #electricity-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Electricity Bill Calculator.", 'en-US');
    return true;
  }

  if (q.includes('govt') || q.includes('job alert')) {
    if (typeof openGovtJobModal === 'function') openGovtJobModal();
    else {
      const el = document.querySelector('#govtJobModalBtn, [data-tool="govt-jobs"]');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Government Job Alerts.", 'en-US');
    return true;
  }

  // 75-ti Tool Cards scan (Matching title, card, text, links)
  const allCards = Array.from(document.querySelectorAll('.tool-card, .popular-card, [data-tool], .card, div[class*="card"]'));
  const searchWords = q.split(/\s+/).filter(w => w.length > 2);
  let bestMatch = null;
  let highestScore = 0;

  allCards.forEach(card => {
    const cardText = (
      (card.getAttribute('data-tool') || '') + ' ' +
      (card.querySelector('h3, h4, h5, h2, a')?.innerText || '') + ' ' +
      (card.innerText || '')
    ).toLowerCase();

    let score = 0;
    if (cardText.includes(q)) score += 10;
    
    searchWords.forEach(word => {
      if (cardText.includes(word)) score += 3;
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = card;
    }
  });

  if (bestMatch && highestScore >= 3) {
    focusAndActivateElement(bestMatch);
    speakVoiceResponse("Opening tool for you.", 'en-US');
    return true;
  }

  // Fallback to Search Input
  const searchInput = document.querySelector('#toolSearch, #searchInput, input[type="search"]');
  if (searchInput) {
    searchInput.value = rawQ;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  speakVoiceResponse(`Searching for ${rawQ}.`, 'en-US');
  return false;
}

// Instant Voice Input (Zero Delay)
function toggleVoiceInput(inputElementId, callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
    return;
  }

  const inputField = document.getElementById(inputElementId);

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Typing Test)...";
    return;
  }

  try {
    globalRecognition = new SpeechRecognition();
    globalRecognition.continuous = false;
    globalRecognition.interimResults = false;
    globalRecognition.lang = navigator.language || 'en-US';

    globalRecognition.onstart = function() {
      isListening = true;
      if (inputField) inputField.placeholder = "Listening... Speak now";
    };

    globalRecognition.onresult = function(event) {
      const spokenTranscript = event.results[0][0].transcript;
      if (inputField) inputField.value = spokenTranscript;
      openSiteToolDirectly(spokenTranscript);
      if (typeof callback === 'function') callback(spokenTranscript);
    };

    globalRecognition.onerror = function(event) {
      console.error("Speech Recognition Error:", event.error);
      isListening = false;
      if (inputField) inputField.placeholder = "Search any tool...";
    };

    globalRecognition.onend = function() {
      isListening = false;
      if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Typing Test)...";
    };

    // Instant Start without any delay
    globalRecognition.start();

  } catch (e) {
    console.error("Recognition start error:", e);
    isListening = false;
  }
}
