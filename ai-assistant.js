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
  if (!btn) return;
  
  // innerHTML-এর বদলে নিরাপদ আইকন ও টেক্সট সেটিং
  btn.innerHTML = '';
  const icon = document.createElement('i');
  icon.className = isVoiceOutputEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  btn.appendChild(icon);
  
  const span = document.createElement('span');
  span.textContent = isVoiceOutputEnabled ? " Voice ON" : " Voice OFF";
  btn.appendChild(span);

  btn.style.color = isVoiceOutputEnabled ? '#60a5fa' : '#94a3b8';
  if (!isVoiceOutputEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
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
  
  // textContent ব্যবহার করা হয়েছে যাতে DOM XSS সিকিউরিটি অ্যালার্ট না আসে
  if (lang === 'bn') {
    welcome.textContent = "নমস্কার! আমি আপনার DocuCraft AI অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি?";
    speakText("নমস্কার! আমি আপনার ডকুক্রাফট এআই অ্যাসিস্ট্যান্ট।");
  } else if (lang === 'hi') {
    welcome.textContent = "नमस्ते! मैं आपका DocuCraft AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
    speakText("नमस्ते! मैं आपका DocuCraft AI सहायक हूँ।");
  } else {
    welcome.textContent = "Hello! I am your DocuCraft AI Assistant. How can I help you today?";
    speakText("Hello! I am your DocuCraft AI Assistant.");
  }
}

function openSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) modal.style.display = 'flex';
  setTimeout(() => {
    const input = document.getElementById('chatInput');
    if (input) input.focus();
  }, 300);
}

function closeSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) modal.style.display = 'none';
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

function appendChatMessage(content, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;

  // ইউজারের মেসেজ প্লেন টেক্সট এবং বটের মেসেজ টেমপ্লেট অনুযায়ী নিরাপদভাবে রেন্ডার হবে
  if (sender === 'user') {
    msgDiv.textContent = content;
  } else {
    msgDiv.innerHTML = content;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function getDocuCraftSmartAnswer(query) {
  const q = query.toLowerCase();

  if (currentLang === 'bn' || q.includes('বাংলা') || q.includes('কিভাবে') || q.includes('সাইজ') || q.includes('ছবি') || q.includes('পাসপোর্ট')) {
    if (q.includes('kb') || q.includes('resizer') || q.includes('সাইজ') || q.includes('photo')) {
      return `<b>Photo & Sign KB / MB Resizer:</b><br>
      1. <b>Photo & Sign KB / MB Resizer</b> টুলটি ওপেন করুন。<br>
      2. ছবি সিলেক্ট করে পছন্দমতো KB বা MB সিলেক্ট করুন এবং প্রসেস করুন。<br>
      <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('kbResizer');" class="action-link-btn">👉 Open Resizer Tool</a>`;
    }
    if (q.includes('passport') || q.includes('পাসপোর্ট')) {
      return `<b>Passport Photo Sheet (35 × 45 mm):</b><br>
      1. <b>Passport Photo Sheet</b> টুল ওপেন করুন。<br>
      2. ছবি আপলোড করে কপির সংখ্যা দিয়ে ডাউনলোড করুন。<br>
      <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('passportGrid');" class="action-link-btn">👉 Open Passport Grid</a>`;
    }
    return `নমস্কার! আমি আপনার ডকুক্রাফট এআই অ্যাসিস্ট্যান্ট। KB Resizer, Passport Sheet (35x45 mm), Signature Pad কিংবা যেকোনো PDF টুল সম্পর্কে সরাসরি প্রশ্ন করতে পারেন।`;
  }

  if (q.includes('kb') || q.includes('resizer') || q.includes('resize')) {
    return `<b>Photo & Sign KB / MB Resizer Guide:</b><br>
    1. Open the <b>Photo & Sign KB / MB Resizer</b> card.<br>
    2. Upload your image, select exact target KB/MB and download.<br>
    <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('kbResizer');" class="action-link-btn">👉 Open Resizer Tool</a>`;
  }
  if (q.includes('passport') || q.includes('grid')) {
    return `<b>Passport Photo Sheet Guide (35 x 45 mm):</b><br>
    1. Open the <b>Passport Photo Sheet</b> tool.<br>
    2. Upload photo and generate print-ready A4 sheet.<br>
    <a href="javascript:void(0)" onclick="closeSmartAiChat(); launchTool('passportGrid');" class="action-link-btn">👉 Open Passport Grid</a>`;
  }

  return `<b>DocuCraft AI Smart Assistant:</b><br>
  I am here to guide you through all our tools including Photo KB Resizer, Passport Sheet (35x45 mm), Signature Pad, and PDF Utilities.`;
}
