/* =========================================================
   DocuCraft AI - Universal Smart Voice Assistant
   Developer: Indranil Ruidas
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;

// Load system speech synthesis voices
function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

// Speak voice response in appropriate language
function speakVoiceResponse(text, lang = 'bn-IN', onEndCallback = null) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }
  window.speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = lang;

    if (availableVoices.length > 0) {
      const prefix = lang.slice(0, 2).toLowerCase();
      const matched = availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (matched) utterance.voice = matched;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
  }, 50);
}

// Scroll element to center and highlight
function focusAndActivateElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  
  const originalOutline = el.style.outline;
  const originalTransition = el.style.transition;
  const originalTransform = el.style.transform;
  
  el.style.transition = 'all 0.3s ease';
  el.style.outline = '4px solid #6366f1';
  el.style.transform = 'scale(1.05)';
  
  setTimeout(() => {
    el.click();
    setTimeout(() => {
      el.style.outline = originalOutline;
      el.style.transform = originalTransform;
      el.style.transition = originalTransition;
    }, 1500);
  }, 300);
}

// Normalize multilingual queries (Bengali, Hindi, English)
function normalizeVoiceQuery(query) {
  let q = query.toLowerCase().trim();

  const translations = [
    { regex: /(মার্জ|যুক্ত|একসাথে|জোড়া|জোড়া|jodo|merge)/gi, val: 'merge' },
    { regex: /(কম্প্রেস|ছোট|সাইজ কমা|সংকুচিত|chota|compress)/gi, val: 'compress' },
    { regex: /(পিডিএফ|ডকুমেন্ট|pdf)/gi, val: 'pdf' },
    { regex: /(ছবি|ফটো|ইমেজ|photo|image|picture)/gi, val: 'photo image' },
    { regex: /(রিসাইজ|মাপ বদল|কেবি|এমবি|resize|kb|mb)/gi, val: 'resizer kb' },
    { regex: /(স্বাক্ষর|সাইন|সহি|signature|sign)/gi, val: 'signature sign' },
    { regex: /(কনভার্ট|রূপান্তর|badlo|convert)/gi, val: 'convert' },
    { regex: /(ক্যালকুলেটর|হিসাব|গণনা|calculator|calculate)/gi, val: 'calculator' },
    { regex: /(অনুবাদ|ট্রান্সলেটর|ভাষান্তর|translate|translator)/gi, val: 'translator translate' },
    { regex: /(বিদ্যুৎ|কারেন্ট|বিল|electricity|power|bill)/gi, val: 'electricity bill' },
    { regex: /(কিউআর|বারকোড|ইউপিআই|qr|barcode|upi)/gi, val: 'qr upi' },
    { regex: /(টাইপিং|টাইপ টেস্ট|typing|type)/gi, val: 'typing' },
    { regex: /(চাকরি|জব|সরকারি|job|jobs|alert|govt)/gi, val: 'govt job alert' },
    { regex: /(পাসওয়ার্ড|সিকিউরিটি|password|security)/gi, val: 'password' },
    { regex: /(ওয়াটারমার্ক|watermark)/gi, val: 'watermark' }
  ];

  translations.forEach(t => {
    q = q.replace(t.regex, t.val);
  });

  return q;
}

// Main logic to open tools and answer questions
function openSiteToolDirectly(toolQuery) {
  const rawQ = toolQuery.trim();
  const q = normalizeVoiceQuery(toolQuery);

  // Developer & Creator Identification Check
  if (
    q.includes('who made you') || 
    q.includes('who created you') || 
    q.includes('developer') || 
    q.includes('creator') || 
    q.includes('indranil') ||
    rawQ.includes('কে বানিয়েছে') || 
    rawQ.includes('কে তৈরি করেছে') ||
    rawQ.includes('ইন্দ্রনীল কে') ||
    rawQ.includes('তোমার মালিক কে') ||
    rawQ.includes('কে বানিয়েছো')
  ) {
    const isBengali = /[\u0980-\u09FF]/.test(rawQ);
    if (isBengali) {
      speakVoiceResponse("আমাকে এবং DocuCraft AI এর সমস্ত আধুনিক ওয়েব টুলস তৈরি করেছেন ইন্দ্রনীল রুইদাস। তিনি একজন ওয়েব ডেভেলপার এবং সফটওয়্যার প্রফেশনাল।", 'bn-IN');
    } else {
      speakVoiceResponse("I was created and developed by Indranil Ruidas. He built DocuCraft AI with powerful client-side productivity and web utility tools.", 'en-US');
    }
    return true;
  }

  // Modals & dedicated tools
  if (q.includes('calculator')) {
    if (typeof openCalculatorModal === 'function') openCalculatorModal();
    else {
      const el = document.querySelector('#calculatorModalBtn, [data-tool="calculator"], #calculator-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Calculator for you.", 'en-US');
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

  if (q.includes('electricity') || q.includes('bill')) {
    if (typeof openElectricityModal === 'function') openElectricityModal();
    else {
      const el = document.querySelector('#electricityModalBtn, [data-tool="electricity"], #electricity-tool');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Electricity Bill Calculator.", 'en-US');
    return true;
  }

  if (q.includes('govt') || q.includes('job')) {
    if (typeof openGovtJobModal === 'function') openGovtJobModal();
    else {
      const el = document.querySelector('#govtJobModalBtn, [data-tool="govt-jobs"]');
      if (el) focusAndActivateElement(el);
    }
    speakVoiceResponse("Opening Government Job Alerts.", 'en-US');
    return true;
  }

  // Scan across all 75 tool cards on screen
  const allCards = document.querySelectorAll('.tool-card, .popular-card, [data-tool], .card');
  const tokens = q.split(/\s+/).filter(t => t.length > 2);
  let bestMatch = null;
  let maxScore = 0;

  allCards.forEach(card => {
    const cardText = (
      (card.getAttribute('data-tool') || '') + ' ' +
      (card.querySelector('h3, h4, h5')?.innerText || '') + ' ' +
      (card.innerText || '')
    ).toLowerCase();

    let score = 0;
    tokens.forEach(token => {
      if (cardText.includes(token)) score += 2;
    });

    if (cardText.includes(q)) score += 5;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = card;
    }
  });

  if (bestMatch && maxScore >= 2) {
    focusAndActivateElement(bestMatch);
    speakVoiceResponse("Opening tool for you.", 'en-US');
    return true;
  }

  // Fallback to search input
  const searchInput = document.querySelector('#toolSearch, #searchInput, input[type="search"]');
  if (searchInput) {
    searchInput.value = rawQ;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  speakVoiceResponse(`Searching for ${rawQ}.`, 'en-US');
  return false;
}

// Voice Toggle Function (Mobile & Desktop Compatible)
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
    if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Calculator)...";
    return;
  }

  // Welcome Greeting from Indranil before listening
  const userLang = navigator.language || 'bn-IN';
  const isBengali = userLang.toLowerCase().startsWith('bn');
  const welcomeMessage = isBengali 
    ? "আমি ইন্দ্রনীল, তোমার কি সাহায্য করতে পারি?" 
    : "I am Indranil, how can I help you today?";

  speakVoiceResponse(welcomeMessage, isBengali ? 'bn-IN' : 'en-US', () => {
    // Start listening after greeting completes
    try {
      globalRecognition = new SpeechRecognition();
      globalRecognition.continuous = false;
      globalRecognition.interimResults = false;
      globalRecognition.lang = navigator.language || 'bn-IN';

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
        if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Photo Resizer)...";
      };

      globalRecognition.start();
    } catch (e) {
      console.error(e);
      isListening = false;
    }
  });
}
