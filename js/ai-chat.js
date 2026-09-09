// DocuCraft AI Smart Assistant - Natural Chat & Dynamic Responses

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI Smart Assistant. How can I help you today?",
    default: "I'm doing great, thank you for asking! I'm your DocuCraft AI Smart Assistant, ready to help you with our document tools, KB resizing, passport photos, PDFs, or any general questions you have."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI Smart Assistant हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
    default: "मैं एकदम ठीक हूँ, पूछने के लिए शुक्रिया! मैं आपका DocuCraft AI स्मार्ट असिस्टेंट हूँ। आप मुझसे टूल्स या किसी भी आम विषय पर बात कर सकते हैं।"
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI Smart Assistant। আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
    default: "আমি একদম ভালো আছি, জানতে চাওয়ার জন্য ধন্যবাদ! আমি আপনার DocuCraft AI Smart Assistant। আমাদের টুলস, ডকুমেন্টস বা যেকোনো সাধারণ বিষয় নিয়ে আপনি আমার সাথে কথা বলতে পারেন।"
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  // ফ্লোটিং AI Assistant বোতাম তৈরি
  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft AI Smart Assistant';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  // চ্যাট উইন্ডো মডাল তৈরি
  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 80px; right: 20px; width: 360px; max-width: 90vw; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: #1e293b; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600; font-size: 13px;">🤖 DocuCraft AI Smart Assistant</span>
      
      <div style="display: flex; align-items: center; gap: 6px;">
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 4px 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="handleUserAuth()" id="authActionBtn" style="background: #2563eb; color: #fff; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 600;">Sign Out</button>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1; margin-left: 2px;">&times;</button>
      </div>
    </div>

    <div id="aiChatBody" style="padding: 12px; height: 260px; overflow-y: auto; background: #f8fafc; font-size: 13px;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #f1f5f9; color: #1e293b; padding: 8px 12px; border-radius: 12px 12px 12px 0; display: inline-block; border: 1px solid #e2e8f0;">
          নমস্কার! আমি DocuCraft AI Smart Assistant। যেকোনো বিষয় বা টুল নিয়ে আমার সাথে কথা বলতে পারেন।
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center;">
      <input type="text" id="aiChatInput" placeholder="আপনার কথা এখানে লিখুন..." style="flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" onkeypress="if(event.key==='Enter') sendUserMessage()">
      <button onclick="startVoiceInput()" style="background: #0284c7; color: #fff; border: none; padding: 8px 10px; border-radius: 6px; cursor: pointer;" title="Voice Input">🎤</button>
      <button onclick="sendUserMessage()" style="background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">➤</button>
    </div>
  `;
  document.body.appendChild(modal);
});

function openSmartAiChat() {
  toggleAiHelpdesk();
}

function closeSmartAiChat() {
  const modal = document.getElementById('autoAiModal');
  if (modal) modal.style.display = 'none';
}

function toggleAiHelpdesk() {
  const modal = document.getElementById('autoAiModal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
}

function handleUserAuth() {
  if (typeof logoutUser === 'function') {
    logoutUser();
  } else {
    localStorage.removeItem('userLoggedIn');
    alert('Logged out successfully!');
    location.reload();
  }
}

function changeAiLanguage(lang) {
  currentLang = lang;
  const welcomeText = aiKnowledge[lang].welcome;
  const welcomeEl = document.getElementById('aiWelcomeMsg');
  if (welcomeEl) {
    welcomeEl.innerText = welcomeText;
  }
  speakText(welcomeText);
}

// ভয়েস আউটপুট এবং সম্পূর্ণ কথা শেষ হওয়া পর্যন্ত ওয়েট করার নিরাপদ ফাংশন
function speakText(text) {
  if (!isVoiceActive || !('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (currentLang === 'bn') utterance.lang = 'bn-IN';
    else if (currentLang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95; 
    utterance.pitch = 1.0;

    utterance.onend = function() {
      console.log('Voice speech completed successfully.');
    };

    window.speechSynthesis.speak(utterance);
  }, 250);
}

function sendUserMessage(customText = '') {
  const input = document.getElementById('aiChatInput');
  const query = customText || (input ? input.value.trim() : '');
  if (!query) return;

  appendUserMessage(query);
  if (input) input.value = '';

  const reply = generateSmartAiResponse(query);
  setTimeout(() => {
    appendAiMessage(reply);
    speakText(reply);
  }, 400);
}

// মানুষের মতো নরমাল কথা ও টুলস উভয় ক্যাটাগরি হ্যান্ডেল করার স্মার্ট লজিক
function generateSmartAiResponse(query) {
  const q = query.toLowerCase();

  // ১. সাধারণ নরমাল কথপোকথন (যেমন: কেমন আছেন, নাম কি, ইত্যাদি)
  if (q.includes('কেমন আছেন') || q.includes('how are you') || q.includes('कैसी हो') || q.includes('कैसा है')) {
    if (currentLang === 'hi') return 'मैं बिल्कुल ठीक हूँ! आप बताइए, आप कैसे हैं और मैं आपकी क्या मदद कर सकता हूँ?';
    if (currentLang === 'en') return 'I am doing wonderful, thank you! How are you doing today? How can I assist you?';
    return 'আমি একদম ভালো আছি, ধন্যবাদ! আপনি কেমন আছেন বলুন? আজ আপনাকে কীভাবে সাহায্য করতে পারি?';
  }

  if (q.includes('আপনার নাম') || q.includes('who are you') || q.includes('what is your name')) {
    if (currentLang === 'hi') return 'मेरा नाम DocuCraft AI Smart Assistant है।';
    if (currentLang === 'en') return 'My name is DocuCraft AI Smart Assistant.';
    return 'আমার নাম DocuCraft AI Smart Assistant।';
  }

  if (q.includes('ধন্যবাদ') || q.includes('thank') || q.includes('শুকরিয়া')) {
    if (currentLang === 'hi') return 'आपका स्वागत है! अगर कोई और मदद चाहिए तो जरूर बताएं।';
    if (currentLang === 'en') return 'You are very welcome! Let me know if you need anything else.';
    return 'আপনাকে অনেক ধন্যবাদ! আর কোনো সাহায্য লাগবে কি?';
  }

  // ২. নির্দিষ্ট টুল সম্পর্কিত প্রশ্ন
  if (q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('রিসাইজ') || q.includes('साइज') || q.includes('ছবি')) {
    if (currentLang === 'hi') return 'फोटो और साइन KB/MB Resizer: फोटो या सिग्नेचर को 10KB से 500MB तक सटीक रूप से कंप्रेस करने के लिए उपयोग करें।';
    if (currentLang === 'en') return 'Photo & Sign KB/MB Resizer: Compress images precisely from 10KB up to 500MB. Perfect for online forms.';
    return 'Photo & Sign KB/MB Resizer: এটি দিয়ে ছবি বা সিগনেচারকে ১০KB থেকে শুরু করে ৫০০MB পর্যন্ত নিখুঁত মাপে রিসাইজ করতে পারবেন।';
  }

  if (q.includes('passport') || q.includes('grid') || q.includes('পাসপোর্ট') || q.includes('फोटो')) {
    if (currentLang === 'hi') return 'पासपोर्ट फोटो शीट: एक ही A4 पेज पर कई सारे 35x45 mm पासपोर्ट साइज फोटो की शीट तैयार करता है।';
    if (currentLang === 'en') return 'Passport Photo Sheet: Generate print-ready sheets of standard 35x45 mm passport photos on a single A4 page.';
    return 'Passport Photo Sheet: একটি মাত্র A4 পেজে স্ট্যান্ডার্ড ৩৫x৪৫ মিমি মাপের একাধিক পাসপোর্ট ছবি প্রিন্ট করার উপযোগী শিট তৈরি করে।';
  }

  if (q.includes('sign') || q.includes('signature') || q.includes('স্বাক্ষর') || q.includes('साइन')) {
    if (currentLang === 'hi') return 'डिजिटल सिग्नेचर मेकर: स्क्रीन पर अपना साइन ड्रा करें और फॉर्म अपलोड के लिए साफ-सुथरा PNG डाउनलोड करें।';
    if (currentLang === 'en') return 'Digital Signature Maker: Draw your signature on the screen and download it as a clear PNG file with a transparent background.';
    return 'Digital Signature Maker: স্ক্রিনে আপনার আঙুল দিয়ে স্বাক্ষর এঁকে ফর্ম আপলোডের জন্য ক্লিয়ার পিএনজি ফাইল ডাউনলোড করুন।';
  }

  if (q.includes('qr') || q.includes('upi') || q.includes('payment') || q.includes('পেমেন্ট')) {
    if (currentLang === 'hi') return 'QR कोड और UPI जेनरेटर: UPI पेमेंट आईडी या लिंक के लिए तुरंत QR कोड बनाएं।';
    if (currentLang === 'en') return 'QR Code & UPI Generator: Instantly create custom QR codes for payment links, UPI IDs, or website URLs.';
    return 'QR Code & UPI Generator: ইউপিআই আইডি বা ওয়েবসাইটের লিঙ্কের জন্য তাৎক্ষণিকভাবে কিউআর কোড তৈরি করুন।';
  }

  if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress') || q.includes('কম্প্রেস')) {
    if (currentLang === 'hi') return 'PDF टूल (मर्ज, स्प्लिट, कंप्रेस): पीडीएफ फाइलों को जोड़ना, काटना या उनका साइज छोटा करना बेहद आसान है।';
    if (currentLang === 'en') return 'PDF Tools (Merge, Split, Compress, Rotate): Combine multiple PDFs, extract pages, or reduce file sizes securely.';
    return 'PDF Tools (Merge, Split, Compress): একাধিক পিডিএফ একসাথে যুক্ত করা, পেজ আলাদা করা বা ফাইলের সাইজ ছোট করার জন্য এগুলো ব্যবহার করুন।';
  }

  // ৩. অন্যান্য যেকোনো সাধারণ প্রশ্নের স্বাভাবিক ও সুন্দর উত্তর
  const dict = aiKnowledge[currentLang] || aiKnowledge.bn;
  return dict.default;
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
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onresult = function(event) {
    const speechText = event.results[0][0].transcript;
    const input = document.getElementById('aiChatInput');
    if (input) input.value = speechText;
    sendUserMessage(speechText);
  };

  recognition.onerror = function(event) {
    console.error('Voice input error:', event.error);
  };
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
