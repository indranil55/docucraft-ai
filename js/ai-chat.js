let currentLang = 'en';
let availableVoices = [];
let isVoiceOutputEnabled = true;

function loadVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function toggleVoiceOutput() {
  isVoiceOutputEnabled = !isVoiceOutputEnabled;
  const btn = document.getElementById('voiceMuteToggle');
  if (isVoiceOutputEnabled) {
    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Voice ON';
    btn.style.color = '#60a5fa';
  } else {
    btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Voice OFF';
    btn.style.color = '#94a3b8';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

function speakText(cleanText) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const isHindi = /[\u0900-\u097F]/.test(cleanText) || currentLang === 'hi';
  const isBengali = /[\u0980-\u09FF]/.test(cleanText) || currentLang === 'bn';
  let matchedVoice = null;

  if (isBengali) {
    utterance.lang = 'bn-IN';
    matchedVoice = availableVoices.find(v => v.lang.startsWith('bn'));
  } else if (isHindi) {
    utterance.lang = 'hi-IN';
    matchedVoice = availableVoices.find(v => v.lang.startsWith('hi'));
  } else {
    utterance.lang = 'en-US';
    matchedVoice = availableVoices.find(v => v.lang.startsWith('en'));
  }

  if (matchedVoice) utterance.voice = matchedVoice;
  window.speechSynthesis.speak(utterance);
}

function changeChatLanguage(lang) {
  currentLang = lang;
  const welcome = document.getElementById('welcomeMsg');
  if (!welcome) return;
  
  if (lang === 'bn') {
    welcome.textContent = "নমস্কার! আমি আপনার DocuCraft AI অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি? আপনি ফটো রিসাইজার, পাসপোর্ট গ্রিড (35x45 mm), সিগনেচার প্যাড কিংবা পিডিএফ টুলস সম্পর্কে বাংলায় যেকোনো প্রশ্ন করতে পারেন।";
    speakText("নমস্কার! আমি আপনার ডকুক্রাফট এআই অ্যাসিস্ট্যান্ট।");
  } else if (lang === 'hi') {
    welcome.textContent = "नमस्ते! मैं आपका DocuCraft AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
    speakText("नमस्ते! मैं आपका DocuCraft AI सहायक हूँ।");
  } else {
    welcome.textContent = "Hello! I am your DocuCraft AI Assistant. How can I help you today? You can ask me about any tool or formatting.";
    speakText("Hello! I am your DocuCraft AI Assistant.");
  }
}

function openSmartAiChat() {
  document.getElementById('smartAiChatModal').style.display = 'flex';
  setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
}

function closeSmartAiChat() {
  document.getElementById('smartAiChatModal').style.display = 'none';
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function handleEnter(e) {
  if (e.key === 'Enter') sendUserMessage();
}

function sendQuickQuery(text) {
  const input = document.getElementById('chatInput');
  if (input) input.value = text;
  sendUserMessage();
}

function sendUserMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const replyHtml = getDocuCraftSmartAnswer(text);
    appendChatMessage(replyHtml, 'bot');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = replyHtml;
    tempDiv.querySelectorAll('a').forEach(l => l.remove());
    speakText(tempDiv.innerText.trim());
  }, 200);
}

// CodeQL সিকিউরিটি অ্যালার্ট ফিক্স করার জন্য নিরাপদ DOM রেন্ডারিং পদ্ধতি
function appendChatMessage(content, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;

  if (sender === 'user') {
    // ইউজারের মেসেজ সবসময় প্লেন টেক্সট হিসেবে দেখাবে (সম্পূর্ণ নিরাপদ)
    msgDiv.textContent = content;
  } else {
    // বটের মেসেজে এইচটিএমএল ট্যাগ ও বাটন নিরাপদভাবে পার্স করার জন্য
    msgDiv.innerHTML = content;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function getDocuCraftSmartAnswer(query) {
  const q = query.toLowerCase();

  if (currentLang === 'bn' || q.includes('বাংলা') || q.includes('কিভাবে') || q.includes('সাইজ') || q.includes('ছবি') || q.includes('কেমন') || q.includes('কোথায়') || q.includes('কতো') || q.includes('পাসপোর্ট')) {
    if (q.includes('kb') || q.includes('resizer') || q.includes('সাইজ') || q.includes('photo')) {
      return `<b>Photo & Sign KB / MB Resizer ব্যবহারের নিয়ম:</b><br>
      সাধারণত ভারতীয় অনলাইন ফর্মে ছবি 20–50 KB এবং সিগনেচার 10–20 KB চাওয়া হয়。<br>
      1. <b>Photo & Sign KB / MB Resizer</b> টুলটি ওপেন করুন。<br>
      2. ছবি সিলেক্ট করে পছন্দমতো KB বা MB সিলেক্ট করুন এবং প্রসেস করুন。<br>
      <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('kbResizer');" class="action-link-btn">👉 Open Resizer Tool</a>`;
    }
    if (q.includes('passport') || q.includes('পাসপোর্ট')) {
      return `<b>Passport Photo Sheet নির্দেশিকা:</b><br>
      📏 স্ট্যান্ডার্ড মাপ: <b>35 × 45 mm</b> (1.38 × 1.77 inch, প্রায় 413 × 531 pixels @ 300 DPI)।<br>
      1. <b>Passport Photo Sheet</b> টুল ওপেন করুন。<br>
      2. ছবি আপলোড করে কপির সংখ্যা (যেমন 8) দিন ও ডাউনলোড করুন。<br>
      <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('passportGrid');" class="action-link-btn">👉 Open Passport Grid</a>`;
    }
    return `নমস্কার! আমি আপনার ডকুক্রাফট এআই অ্যাসিস্ট্যান্ট। আপনি KB Resizer, Passport Sheet (35x45 mm), Signature Pad কিংবা যেকোনো PDF টুল সম্পর্কে সরাসরি প্রশ্ন করতে পারেন।`;
  }

  if (currentLang === 'hi' || q.includes('फोटो') || q.includes('साइज') || q.includes('पासपोर्ट') || q.includes('कैसी')) {
    if (q.includes('kb') || q.includes('resizer') || q.includes('photo')) {
      return `<b>Photo & Sign KB / MB Resizer:</b><br>
      फॉर्म के अनुसार फोटो 20-50 KB और हस्ताक्षर 10-20 KB में सेट करें。<br>
      <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('kbResizer');" class="action-link-btn">👉 Open Resizer Tool</a>`;
    }
    return `नमस्ते! पासपोर्ट साइज फोटो का मानक आकार आमतौर पर 35×45 mm होता है। आप हमारे <b>Passport Grid</b> टूल से इसे आसानी से बना सकते हैं।`;
  }

  if (q.includes('kb') || q.includes('resizer') || q.includes('resize')) {
    return `<b>Photo & Sign KB / MB Resizer Guide:</b><br>
    1. Open the <b>Photo & Sign KB / MB Resizer</b> card.<br>
    2. Upload your image, select exact target KB/MB (e.g. 20KB, 50KB) and download.<br>
    <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('kbResizer');" class="action-link-btn">👉 Open Resizer Tool</a>`;
  }
  if (q.includes('passport') || q.includes('grid')) {
    return `<b>Passport Photo Sheet Guide (35 x 45 mm):</b><br>
    1. Open the <b>Passport Photo Sheet</b> tool.<br>
    2. Upload your photo, enter copy count, and generate print-ready A4 sheet.<br>
    <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('passportGrid');" class="action-link-btn">👉 Open Passport Grid</a>`;
  }
  if (q.includes('signature') || q.includes('sign')) {
    return `<b>Digital Signature Maker Guide:</b><br>
    1. Open the <b>Digital Signature Maker</b> tool.<br>
    2. Draw your signature cleanly on the canvas and download transparent PNG.<br>
    <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('sigPad');" class="action-link-btn">👉 Open Signature Pad</a>`;
  }

  return `<b>DocuCraft AI Smart Assistant:</b><br>
  I am here to guide you through all our tools including Photo KB Resizer, Passport Sheet (35x45 mm), Signature Pad, and PDF Utilities. Ask me how to use any tool!`;
}
