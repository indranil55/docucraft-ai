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
    const replyData = getDocuCraftSmartAnswer(text);
    appendChatMessage(replyData, 'bot');

    const tempDiv = document.createElement('div');
    tempDiv.textContent = replyData.text;
    speakText(tempDiv.innerText.trim());
  }, 200);
}

// CodeQL সিকিউরিটি অ্যালার্ট চিরতরে দূর করার জন্য সম্পূর্ণ নিরাপদ DOM এলিমেন্ট বিল্ডিং
function appendChatMessage(content, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;

  if (sender === 'user') {
    msgDiv.textContent = content;
  } else {
    // এখানে সরাসরি innerHTML বা DOMParser ব্যবহার না করে নিরাপদ স্ট্রাকচার তৈরি করা হয়েছে
    const p = document.createElement('p');
    p.textContent = content.text;
    msgDiv.appendChild(p);

    if (content.toolKey && content.toolName) {
      const actionBtn = document.createElement('a');
      actionBtn.href = "javascript:void(0)";
      actionBtn.className = "action-link-btn";
      actionBtn.style.marginTop = "8px";
      actionBtn.style.display = "inline-block";
      actionBtn.textContent = `👉 Open ${content.toolName}`;
      actionBtn.onclick = () => {
        closeSmartAiChat();
        launchTool(content.toolKey);
      };
      msgDiv.appendChild(actionBtn);
    }
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function getDocuCraftSmartAnswer(query) {
  const q = query.toLowerCase();

  if (currentLang === 'bn' || q.includes('বাংলা') || q.includes('কিভাবে') || q.includes('সাইজ') || q.includes('ছবি') || q.includes('কেমন') || q.includes('কোথায়') || q.includes('কতো') || q.includes('পাসপোর্ট')) {
    if (q.includes('kb') || q.includes('resizer') || q.includes('সাইজ') || q.includes('photo')) {
      return {
        text: "Photo & Sign KB / MB Resizer ব্যবহারের নিয়ম:\nসাধারণত ভারতীয় অনলাইন ফর্মে ছবি 20–50 KB এবং সিগনেচার 10–20 KB চাওয়া হয়।\n1. Photo & Sign KB / MB Resizer টুলটি ওপেন করুন।\n2. ছবি সিলেক্ট করে পছন্দমতো KB বা MB সিলেক্ট করুন এবং প্রসেস করুন।",
        toolKey: "kbResizer",
        toolName: "Resizer Tool"
      };
    }
    if (q.includes('passport') || q.includes('পাসপোর্ট')) {
      return {
        text: "Passport Photo Sheet নির্দেশিকা:\nস্ট্যান্ডার্ড মাপ: 35 × 45 mm (1.38 × 1.77 inch, প্রায় 413 × 531 pixels @ 300 DPI)।\n1. Passport Photo Sheet টুল ওপেন করুন।\n2. ছবি আপলোড করে কপির সংখ্যা দিয়ে ডাউনলোড করুন।",
        toolKey: "passportGrid",
        toolName: "Passport Grid"
      };
    }
    return { text: "নমস্কার! আমি আপনার ডকুক্রাফট এআই অ্যাসিস্ট্যান্ট। আপনি KB Resizer, Passport Sheet (35x45 mm), Signature Pad কিংবা যেকোনো PDF টুল সম্পর্কে সরাসরি প্রশ্ন করতে পারেন।" };
  }

  if (currentLang === 'hi' || q.includes('फोटो') || q.includes('साइज') || q.includes('पासपोर्ट') || q.includes('कैसी')) {
    if (q.includes('kb') || q.includes('resizer') || q.includes('photo')) {
      return {
        text: "Photo & Sign KB / MB Resizer:\nफॉर्म के अनुसार फोटो 20-50 KB और हस्ताक्षर 10-20 KB में सेट करें।",
        toolKey: "kbResizer",
        toolName: "Resizer Tool"
      };
    }
    return { text: "नमस्ते! पासपोर्ट साइज फोटो का मानक आकार आमतौर पर 35×45 mm होता है। आप हमारे Passport Grid टूल से इसे आसानी से बना सकते हैं।" };
  }

  if (q.includes('kb') || q.includes('resizer') || q.includes('resize')) {
    return {
      text: "Photo & Sign KB / MB Resizer Guide:\n1. Open the Photo & Sign KB / MB Resizer card.\n2. Upload your image, select exact target KB/MB and download.",
      toolKey: "kbResizer",
      toolName: "Resizer Tool"
    };
  }
  if (q.includes('passport') || q.includes('grid')) {
    return {
      text: "Passport Photo Sheet Guide (35 x 45 mm):\n1. Open the Passport Photo Sheet tool.\n2. Upload your photo, enter copy count, and generate print-ready A4 sheet.",
      toolKey: "passportGrid",
      toolName: "Passport Grid"
    };
  }
  if (q.includes('signature') || q.includes('sign')) {
    return {
      text: "Digital Signature Maker Guide:\n1. Open the Digital Signature Maker tool.\n2. Draw your signature cleanly on the canvas and download transparent PNG.",
      toolKey: "sigPad",
      toolName: "Signature Pad"
    };
  }

  return { text: "DocuCraft AI Smart Assistant:\nI am here to guide you through all our tools including Photo KB Resizer, Passport Sheet (35x45 mm), Signature Pad, and PDF Utilities." };
}
