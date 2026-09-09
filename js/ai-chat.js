// DocuCraft AI - Real AI Powered Assistant (Google Gemini AI Integration + Voice & Multi-language)

// আপনার জেমিনি এআই এপিআই কী (Gemini API Key) এখানে বসাবেন। 
// ফ্রি এপিআই কী পেতে Google AI Studio (aistudio.google.com) থেকে জেনারেট করে নিতে পারেন।
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI. Ask me anything about our tools, sizing, PDFs, or any general questions.",
    default: "I am DocuCraft AI, your smart assistant! I can help you with KB Resizer, Passport Photos, Digital Signatures, QR codes, PDF tools, or answer any general questions."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ। आप मुझसे हमारे टूल्स, साइज़, PDF या किसी भी विषय के बारे में पूछ सकते हैं।",
    default: "मैं DocuCraft AI हूँ, आपका स्मार्ट सहायक! मैं KB Resizer, Passport Photos, Digital Signatures और सभी PDF टूल्स में आपकी मदद कर सकता हूँ।"
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI। আমাদের টুলস, সাইজ, পিডিএফ বা যেকোনো বিষয়ে আমাকে প্রশ্ন করতে পারেন।",
    default: "আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট! KB/MB Photo Resizer, Passport Photo Sheet, Digital Signature, PDF Tools কিংবা যেকোনো সাধারণ প্রশ্ন বা তথ্যের উত্তর আমি দিতে পারি।"
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

// পেজ লোড হওয়ার সাথে সাথে চ্যাট উইন্ডো তৈরি করা
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft AI';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 80px; right: 20px; width: 360px; max-width: 90vw; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: #1e293b; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600; font-size: 13px;">🤖 DocuCraft AI</span>
      
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
          নমস্কার! আমি DocuCraft AI। আমাদের টুলস বা যেকোনো বিষয় নিয়ে আমার সাথে কথা বলতে পারেন।
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center;">
      <input type="text" id="aiChatInput" placeholder="এখানে আপনার প্রশ্ন লিখুন..." style="flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" onkeypress="if(event.key==='Enter') sendUserMessage()">
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

// ভয়েস আউটপুট (কথা শেষ হওয়া পর্যন্ত ওয়েট করার সুবিধা সহ)
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
    window.speechSynthesis.speak(utterance);
  }, 250);
}

// ইউজার মেসেজ পাঠানোর প্রধান ফাংশন
async function sendUserMessage(customText = '') {
  const input = document.getElementById('aiChatInput');
  const query = customText || (input ? input.value.trim() : '');
  if (!query) return;

  appendUserMessage(query);
  if (input) input.value = '';

  // লোডিং ইন্ডিকেটর দেখানো
  const loadingId = 'loading_' + Date.now();
  appendAiMessage("...", loadingId);

  try {
    const reply = await fetchGeminiAiResponse(query);
    removeAiMessage(loadingId);
    appendAiMessage(reply);
    speakText(reply);
  } catch (error) {
    removeAiMessage(loadingId);
    const fallbackReply = generateLocalAiResponse(query);
    appendAiMessage(fallbackReply);
    speakText(fallbackReply);
  }
}

// আসল রিয়েল জেমিনি এআই এপিআই কল করার ফাংশন
async function fetchGeminiAiResponse(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    return generateLocalAiResponse(prompt);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = `You are DocuCraft AI, an advanced smart assistant for a web-based document platform (DocuCraft AI) featuring KB/MB Photo Resizers, Passport Photo Grids, Digital Signatures, QR/UPI generators, and PDF tools (Merge, Split, Compress, etc.). Respond in the user's language (Bengali, Hindi, or English) naturally and accurately.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] }
      ]
    })
  });

  const data = await response.json();
  if (data && data.candidates && data.candidates[0].content.parts[0].text) {
    return data.candidates[0].content.parts[0].text.trim();
  } else {
    throw new Error('Invalid API response');
  }
}

// লোকাল ফলব্যাক রেসপন্স (যদি এপিআই কী সেট করা না থাকে)
function generateLocalAiResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('কেমন আছেন') || q.includes('how are you') || q.includes('कैसी हो')) {
    if (currentLang === 'hi') return 'मैं बिल्कुल ठीक हूँ! बताइए, DocuCraft AI में आज मैं आपकी क्या सहायता कर सकता हूँ?';
    if (currentLang === 'en') return 'I am doing great! How can DocuCraft AI assist you today?';
    return 'আমি একদম ভালো আছি, ধন্যবাদ! DocuCraft AI-তে আজ আপনাকে কীভাবে সাহায্য করতে পারি বলুন?';
  }

  if (q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('রিসাইজ') || q.includes('সাইজ')) {
    return 'Photo & Sign KB/MB Resizer: এটি ব্যবহার করে আপনি যেকোনো ছবি বা সিগনেচারকে ১০KB থেকে শুরু করে ৫০০MB পর্যন্ত একদম নিখুঁত মাপে রিসাইজ বা কম্প্রেস করতে পারবেন।';
  } else if (q.includes('passport') || q.includes('grid') || q.includes('পাসপোর্ট')) {
    return 'Passport Photo Sheet: একটি মাত্র A4 পেজে স্ট্যান্ডার্ড ৩৫x৪৫ মিমি মাপের একাধিক পাসপোর্ট ছবি প্রিন্ট করার উপযোগী শিট তৈরি করে দেয়।';
  } else if (q.includes('sign') || q.includes('signature') || q.includes('স্বাক্ষর')) {
    return 'Digital Signature Maker: স্ক্রিনে আপনার আঙুল দিয়ে স্বাক্ষর এঁকে ফর্ম আপলোডের জন্য ক্লিয়ার পিএনজি ফাইল ডাউনলোড করতে পারেন।';
  } else if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress')) {
    return 'PDF Tools: একাধিক পিডিএফ একসাথে যুক্ত করা (Merge), পেজ আলাদা করা (Split), ফাইলের সাইজ ছোট করা (Compress) বা রিঅর্ডার করার সমস্ত টুল এখানে পেয়ে যাবেন।';
  }

  const dict = aiKnowledge[currentLang] || aiKnowledge.bn;
  return dict.default;
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 8px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 12px 12px 0 12px; display: inline-block; font-size: 13px; max-width: 80%;">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text, id = '') {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div id="${id}" style="margin: 8px 0; text-align: left;"><span style="background: #f1f5f9; color: #1e293b; padding: 8px 12px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 13px; max-width: 80%; border: 1px solid #e2e8f0;">🤖 ${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeAiMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
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
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
