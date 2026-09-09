// DocuCraft AI Helpdesk - Multi-Language Selector Box & Voice Support

const aiKnowledge = {
  en: {
    welcome: "Hello! I am your DocuCraft AI Assistant. Ask me anything about our tools, sizing, or formatting.",
    kbResizer: "Photo & Sign KB/MB Resizer: Compress images precisely from 10KB up to 500MB. Perfect for online forms.",
    passportGrid: "Passport Photo Sheet: Generate print-ready sheets of standard 35x45 mm passport photos on a single A4 page.",
    sigPad: "Digital Signature Maker: Draw your signature on the screen and download it as a clear PNG file with a transparent background.",
    qrGen: "QR Code & UPI Generator: Instantly create custom QR codes for payment links, UPI IDs, or website URLs.",
    pdfTools: "PDF Tools (Merge, Split, Compress, Rotate): Combine multiple PDFs, extract pages, or reduce file sizes securely.",
    default: "I can help you with KB/MB Resizing, Passport Photos, Digital Signatures, QR Codes, and PDF utilities. What would you like to know?"
  },
  hi: {
    welcome: "नमस्ते! मैं आपका DocuCraft AI सहायक हूँ। आप मुझसे किसी भी टूल, साइज़ या फॉर्मेट के बारे में पूछ सकते हैं।",
    kbResizer: "फोटो और साइन KB/MB Resizer: फोटो या सिग्नेचर को 10KB से 500MB तक सटीक रूप से कंप्रेस करने के लिए उपयोग करें।",
    passportGrid: "पासपोर्ट फोटो शीट: एक ही A4 पेज पर कई सारे 35x45 mm पासपोर्ट साइज फोटो की शीट तैयार करता है।",
    sigPad: "डिजिटल सिग्नेचर मेकर: स्क्रीन पर अपना साइन ड्रा करें और फॉर्म अपलोड के लिए साफ-सुथरा PNG डाउनलोड करें।",
    qrGen: "QR कोड और UPI जेनरेटर: UPI पेमेंट आईडी या लिंक के लिए तुरंत QR कोड बनाएं।",
    pdfTools: "PDF टूल (मर्ज, स्प्लिट, कंप्रेस): पीडीएफ फाइलों को जोड़ना, काटना या उनका साइज छोटा करना बेहद आसान है।",
    default: "मैं KB/MB Resizer, पासपोर्ट फोटो, डिजिटल सिग्नेचर और PDF टूल्स के बारे में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?"
  },
  bn: {
    welcome: "নমস্কার! আমি আপনার DocuCraft AI অ্যাসিস্ট্যান্ট। যেকোনো টুল, সাইজ বা ফরম্যাট সম্পর্কে আমাকে জিজ্ঞেস করতে পারেন।",
    kbResizer: "Photo & Sign KB/MB Resizer: এটি দিয়ে ছবি বা সিগনেচারকে ১০KB থেকে শুরু করে ৫০০MB পর্যন্ত নিখুঁত মাপে রিসাইজ করতে পারবেন।",
    passportGrid: "Passport Photo Sheet: একটি মাত্র A4 পেজে স্ট্যান্ডার্ড ৩৫x৪৫ মিমি মাপের একাধিক পাসপোর্ট ছবি প্রিন্ট করার উপযোগী শিট তৈরি করে।",
    sigPad: "Digital Signature Maker: স্ক্রিনে আপনার আঙুল দিয়ে স্বাক্ষর এঁকে ফর্ম আপলোডের জন্য ক্লিয়ার পিএনজি ফাইল ডাউনলোড করুন।",
    qrGen: "QR Code & UPI Generator: ইউপিআই আইডি বা ওয়েবসাইটের লিঙ্কের জন্য তাৎক্ষণিকভাবে কিউআর কোড তৈরি করুন।",
    pdfTools: "PDF Tools (Merge, Split, Compress): একাধিক পিডিএফ একসাথে যুক্ত করা, পেজ আলাদা করা বা ফাইলের সাইজ ছোট করার জন্য এগুলো ব্যবহার করুন।",
    default: "আমি আপনাকে KB/MB Resizer, Passport Photo, Digital Signature, QR Code এবং PDF টুলস সম্পর্কে গাইড করতে পারি। আপনি কী জানতে চান?"
  }
};

let isVoiceActive = true;
let currentLang = 'bn'; // ডিফল্ট ভাষা বাংলা

// পেজ লোড হওয়ার সাথে সাথে এআই উইন্ডো তৈরি করা (ডান কোণায় ভাষা পরিবর্তনের বক্স সহ)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 AI Helpdesk';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 80px; right: 20px; width: 340px; max-width: 90vw; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: #1e293b; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600; font-size: 13px;">🤖 AI Helpdesk</span>
      
      <div style="display: flex; align-items: center; gap: 6px;">
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 3px 6px; border-radius: 4px; font-size: 11px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1;">&times;</button>
      </div>
    </div>

    <div id="aiChatBody" style="padding: 12px; height: 250px; overflow-y: auto; background: #f8fafc; font-size: 13px;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #f1f5f9; color: #1e293b; padding: 8px 12px; border-radius: 12px 12px 12px 0; display: inline-block; border: 1px solid #e2e8f0;">
          নমস্কার! আমি আপনার DocuCraft AI অ্যাসিস্ট্যান্ট। যেকোনো টুল বা সাইজ সম্পর্কে আমাকে জিজ্ঞেস করতে পারেন।
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center;">
      <input type="text" id="aiChatInput" placeholder="এখানে লিখুন / Type here..." style="flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" onkeypress="if(event.key==='Enter') sendUserMessage()">
      <button onclick="startVoiceInput()" style="background: #0284c7; color: #fff; border: none; padding: 8px 10px; border-radius: 6px; cursor: pointer;" title="Voice Input">🎤</button>
      <button onclick="sendUserMessage()" style="background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">➤</button>
    </div>
  `;
  document.body.appendChild(modal);
});

function toggleAiHelpdesk() {
  const modal = document.getElementById('autoAiModal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
}

// ভাষা পরিবর্তনের ফাংশন (ডান কোণার ড্রপডাউন থেকে সিলেক্ট করলে কাজ করবে)
function changeAiLanguage(lang) {
  currentLang = lang;
  const welcomeText = aiKnowledge[lang].welcome;
  const welcomeEl = document.getElementById('aiWelcomeMsg');
  if (welcomeEl) {
    welcomeEl.innerText = welcomeText;
  }
  speakText(welcomeText);
}

function speakText(text) {
  if (!isVoiceActive || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (currentLang === 'bn') utterance.lang = 'bn-IN';
  else if (currentLang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-US';

  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

function sendUserMessage(customText = '') {
  const input = document.getElementById('aiChatInput');
  const query = customText || (input ? input.value.trim() : '');
  if (!query) return;

  appendUserMessage(query);
  if (input) input.value = '';

  const reply = generateAiResponse(query);
  setTimeout(() => {
    appendAiMessage(reply);
    speakText(reply);
  }, 400);
}

function generateAiResponse(query) {
  const q = query.toLowerCase();
  const dict = aiKnowledge[currentLang] || aiKnowledge.bn;

  if (q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('রিসাইজ') || q.includes('साइज') || q.includes('ছবি')) {
    return dict.kbResizer;
  } else if (q.includes('passport') || q.includes('grid') || q.includes('পাসপোর্ট') || q.includes('फोटो')) {
    return dict.passportGrid;
  } else if (q.includes('sign') || q.includes('signature') || q.includes('স্বাক্ষর') || q.includes('साइन')) {
    return dict.sigPad;
  } else if (q.includes('qr') || q.includes('upi') || q.includes('payment') || q.includes('पেমেন্ট')) {
    return dict.qrGen;
  } else if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress') || q.includes('কম্প্রেস')) {
    return dict.pdfTools;
  } else {
    return dict.default;
  }
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 8px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 12px 12px 0 12px; display: inline-block; font-size: 13px; max-width: 80%;">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 8px 0; text-align: left;"><span style="background: #f1f5f9; color: #1e293b; padding: 8px 12px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 13px; max-width: 80%; border: 1px solid #e2e8f0;">🤖 ${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice recognition is not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = currentLang === 'bn' ? 'bn-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
  recognition.start();

  recognition.onresult = function(event) {
    const speechText = event.results[0][0].transcript;
    const input = document.getElementById('aiChatInput');
    if (input) input.value = speechText;
    sendUserMessage(speechText);
  };
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
