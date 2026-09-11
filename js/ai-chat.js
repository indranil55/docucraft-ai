// DocuCraft AI - Smart Local AI Assistant with Speaker Toggle (100% Free & No API Key Needed)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI. Ask me anything about our tools, sizing, PDFs, or any general questions.",
    default: "I am DocuCraft AI, your smart assistant! I can help you with KB Resizer, Passport Photos, Digital Signatures, QR codes, PDF tools, or answer any general questions.",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Type your question here..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ। आप मुझसे हमारे टूल्स, साइज़, PDF या किसी भी विषय के बारे में पूछ सकते हैं।",
    default: "मैं DocuCraft AI हूँ, आपका स्मार्ट सहायक! मैं KB Resizer, Passport Photos, Digital Signatures और सभी PDF टूल्स में आपकी मदद कर सकता हूँ।",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "यहाँ अपना प्रश्न लिखें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI। আমাদের টুলস, সাইজ, পিডিএফ বা যেকোনো বিষয়ে আমাকে প্রশ্ন করতে পারেন।",
    default: "আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট! KB/MB Photo Resizer, Passport Photo Sheet, Digital Signature, PDF Tools কিংবা যেকোনো সাধারণ প্রশ্ন বা তথ্যের উত্তর আমি দিতে পারি।",
    listening: "🎙️ শুনছি... কথা বলুন স্পষ্ট করে",
    placeholder: "এখানে আপনার প্রশ্ন লিখুন..."
  }
};

let isVoiceActive = true; // স্পিকার অন বা অফ রাখার ভ্যারিয়েবল
let currentLang = 'bn';

// পেজ লোড হওয়ার সাথে সাথে চ্যাট উইন্ডো তৈরি করা
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft AI';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 350px; max-width: calc(100vw - 20px); height: 450px; max-height: 80vh; background: #fff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: #1e293b; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <span style="font-weight: 600; font-size: 13px;">🤖 DocuCraft AI</span>
      
      <div style="display: flex; align-items: center; gap: 6px;">
        <!-- স্পিকার অন/অফ বাটন -->
        <button id="speakerToggleBtn" onclick="toggleVoiceOutput()" style="background: #0f172a; color: #60a5fa; border: 1px solid #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;" title="Toggle Speaker">🔊</button>
        
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 4px 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1; margin-left: 2px;">&times;</button>
      </div>
    </div>

    <!-- ডায়নামিক ভয়েস স্ট্যাটাস বার -->
    <div id="voiceStatusBar" style="display: none; background: #e0f2fe; color: #0369a1; padding: 6px 12px; font-size: 12px; font-weight: 600; text-align: center; border-bottom: 1px solid #bae6fd; flex-shrink: 0;">
      ${aiKnowledge.bn.listening}
    </div>

    <div id="aiChatBody" style="padding: 12px; flex: 1; overflow-y: auto; background: #f8fafc; font-size: 13px; -webkit-overflow-scrolling: touch;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #f1f5f9; color: #1e293b; padding: 8px 12px; border-radius: 12px 12px 12px 0; display: inline-block; border: 1px solid #e2e8f0;">
          ${aiKnowledge.bn.welcome}
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
      <input type="text" id="aiChatInput" placeholder="${aiKnowledge.bn.placeholder}" style="flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; outline: none;" onkeypress="if(event.key==='Enter') sendUserMessage()">
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

// স্পিকার অন/অফ করার ফাংশন
function toggleVoiceOutput() {
  isVoiceActive = !isVoiceActive;
  const speakerBtn = document.getElementById('speakerToggleBtn');
  if (speakerBtn) {
    if (isVoiceActive) {
      speakerBtn.innerHTML = '🔊';
      speakerBtn.style.color = '#60a5fa';
      speakText('Speaker turned on.');
    } else {
      speakerBtn.innerHTML = '🔇';
      speakerBtn.style.color = '#94a3b8';
      window.speechSynthesis.cancel(); // কথা বলা বন্ধ করা
    }
  }
}

function changeAiLanguage(lang) {
  currentLang = lang;
  const langData = aiKnowledge[lang] || aiKnowledge.bn;
  
  const welcomeEl = document.getElementById('aiWelcomeMsg');
  if (welcomeEl) welcomeEl.innerText = langData.welcome;

  const statusBar = document.getElementById('voiceStatusBar');
  if (statusBar) statusBar.innerText = langData.listening;

  const inputEl = document.getElementById('aiChatInput');
  if (inputEl) inputEl.placeholder = langData.placeholder;

  speakText(langData.welcome);
}

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

async function sendUserMessage(customText = '') {
  const input = document.getElementById('aiChatInput');
  const query = customText || (input ? input.value.trim() : '');
  if (!query) return;

  appendUserMessage(query);
  if (input) input.value = '';

  const loadingId = 'loading_' + Date.now();
  appendAiMessage("...", loadingId);

  setTimeout(() => {
    removeAiMessage(loadingId);
    const reply = generateSmartAiResponse(query);
    appendAiMessage(reply);
    speakText(reply);
  }, 500);
}

function generateSmartAiResponse(query) {
  const q = query.toLowerCase();
  const dict = aiKnowledge[currentLang] || aiKnowledge.bn;

  if (q.includes('কেমন আছেন') || q.includes('how are you') || q.includes('कैसी हो') || q.includes('कैसे हो')) {
    if (currentLang === 'hi') return 'मैं बिल्कुल ठीक हूँ! बताइए, DocuCraft AI में आज मैं आपकी क्या सहायता कर सकता हूँ?';
    if (currentLang === 'en') return 'I am doing great! How can DocuCraft AI assist you today?';
    return 'আমি একদম ভালো আছি, ধন্যবাদ! DocuCraft AI-তে আজ আপনাকে কীভাবে সাহায্য করতে পারি বলুন?';
  }

  if (q.includes('photo') || q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('ছবি') || q.includes('সাইজ')) {
    if (currentLang === 'hi') return 'आप हमारे "Photo & Sign KB/MB Resizer" टूल का उपयोग करके किसी भी फोटो या सिग्नेचर को अपनी आवश्यकतानुसार सटीक KB या MB में तुरंत resize कर सकते हैं।';
    if (currentLang === 'en') return 'You can use our "Photo & Sign KB/MB Resizer" tool to precisely resize any photo or signature to your desired KB or MB instantly.';
    return 'আপনি আমাদের "Photo & Sign KB/MB Resizer" টুলটি ব্যবহার করে যেকোনো ছবি বা সিগনেচারকে আপনার প্রয়োজনমতো নিখুঁত KB বা MB সাইজে ছোট বা বড় করতে পারেন।';
  }

  if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    if (currentLang === 'hi') return 'आप "Passport Photo Sheet" टूल की मदद से A4 पेज पर प्रिंट-रेडी पासपोर्ट फोटो शीट आसानी से तैयार कर सकते हैं।';
    if (currentLang === 'en') return 'You can easily generate print-ready passport photo sheets on an A4 page using our "Passport Photo Sheet" tool.';
    return 'আমাদের "Passport Photo Sheet" টুল ব্যবহার করে আপনি খুব সহজেই A4 পেজে প্রিন্ট-রেডি পাসপোর্ট ফটো শিট তৈরি করে নিতে পারেন।';
  }

  if (q.includes('signature') || q.includes('sign') || q.includes('স্বাক্ষর')) {
    if (currentLang === 'hi') return 'आप "Digital Signature Maker" टूल का उपयोग करके स्क्रीन पर अपना हस्ताक्षर ड्रा कर सकते हैं और उसे ट्रांसपेरेंट PNG के रूप में डाउनलोड कर सकते हैं।';
    if (currentLang === 'en') return 'You can draw your signature directly on the screen using the "Digital Signature Maker" and download it as a transparent PNG.';
    return 'ডিজিটাল সিগনেচারের জন্য "Digital Signature Maker" টুল ব্যবহার করে স্ক্রিনেই স্বাক্ষর এঁকে তা ট্রান্সপারেন্ট PNG হিসেবে ডাউনলোড করতে পারেন।';
  }

  if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress') || q.includes('পিডিএফ')) {
    if (currentLang === 'hi') return 'हमारे पास सभी PDF टूल्स उपलब्ध हैं जैसे Merge PDF, Split PDF, और Compress PDF, जिनकी मदद से आप अपने PDF दस्तावेज़ों को प्रबंधित कर सकते हैं।';
    if (currentLang === 'en') return 'We offer a complete suite of PDF tools including Merge, Split, and Compress PDF to easily manage your documents.';
    return 'আমাদের প্ল্যাটফর্মে Merge PDF, Split PDF এবং Compress PDF-এর মতো চমৎকার সব টুল রয়েছে, যা দিয়ে আপনি যেকোনো পিডিএফ খুব সহজে ম্যানেজ করতে পারবেন।';
  }

  if (q.includes('who made you') || q.includes('ke banieche') || q.includes('কে বানিয়েছে') || q.includes('developer')) {
    return 'আমাকে তৈরি করেছেন ইনদনীল রুইদাস (Indranil Ruidas), DocuCraft AI প্রজেক্টের প্রতিষ্ঠাতা ও ডেভেলপার!';
  }

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

  const statusBar = document.getElementById('voiceStatusBar');
  const langData = aiKnowledge[currentLang] || aiKnowledge.bn;

  recognition.onstart = function() {
    if (statusBar) {
      statusBar.innerText = langData.listening;
      statusBar.style.display = 'block';
    }
  };

  recognition.onresult = function(event) {
    const speechText = event.results[0][0].transcript;
    const input = document.getElementById('aiChatInput');
    if (input) input.value = speechText;
    if (statusBar) statusBar.style.display = 'none';
    sendUserMessage(speechText);
  };

  recognition.onerror = function() {
    if (statusBar) statusBar.style.display = 'none';
  };

  recognition.onend = function() {
    if (statusBar) statusBar.style.display = 'none';
  };

  recognition.start();
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
