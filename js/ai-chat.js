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
  } else {
    btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Voice OFF';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

function speakText(cleanText) {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  window.speechSynthesis.speak(utterance);
}

function changeChatLanguage(lang) {
  currentLang = lang;
  const welcome = document.getElementById('welcomeMsg');
  if (lang === 'bn') {
    welcome.textContent = "নমস্কার! আমি আপনার DocuCraft AI অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি?";
  } else if (lang === 'hi') {
    welcome.textContent = "नमस्ते! मैं आपका DocuCraft AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
  } else {
    welcome.textContent = "Hello! I am your DocuCraft AI Assistant. How can I help you today?";
  }
}

function openSmartAiChat() {
  document.getElementById('smartAiChatModal').style.display = 'flex';
  setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

function closeSmartAiChat() {
  document.getElementById('smartAiChatModal').style.display = 'none';
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function handleEnter(e) {
  if (e.key === 'Enter') sendUserMessage();
}

function sendUserMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const replyText = getDocuCraftSmartAnswer(text);
    appendChatMessage(replyText, 'bot');
    speakText(replyText);
  }, 200);
}

// CodeQL সিকিউরিটি ঠিক করতে innerHTML এর বদলে textContent ব্যবহার করা হয়েছে
function appendChatMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  msgDiv.textContent = text; 
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function getDocuCraftSmartAnswer(query) {
  const q = query.toLowerCase();
  if (currentLang === 'bn') {
    return "নমস্কার! আপনি ফটো রিসাইজার, পাসপোর্ট গ্রিড বা পিডিএফ টুলস সম্পর্কে প্রশ্ন করতে পারেন।";
  }
  if (currentLang === 'hi') {
    return "नमस्ते! आप फोटो रिसाइज़र, पासपोर्ट ग्रिड या पीडीएफ टूल के बारे में पूछ सकते हैं।";
  }
  return "I am here to guide you through all our tools including Photo KB Resizer, Passport Sheet, and PDF Utilities.";
}
