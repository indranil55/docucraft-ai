// DocuCraftAI - New Modern Secured Login & Authentication Lock System

const aiConversations = {
  en: {
    welcome: "Hello! Please login or sign up to access DocuCraftAI tools securely.",
    listening: "🎙️ Listening... Speak now in English",
    placeholder: "Ask me anything..."
  },
  hi: {
    welcome: "नमस्ते! DocuCraftAI टूल्स का सुरक्षित रूप से उपयोग करने के लिए कृपया लॉगिन या साइन अप करें।",
    listening: "🎙️ सुन रहा हूँ... कृपया हिंदी में बोलें",
    placeholder: "मुझसे कुछ भी पूछें..."
  },
  bn: {
    welcome: "নমস্কার! DocuCraftAI-এর সমস্ত টুলস নিরাপদে ব্যবহার করতে অনুগ্রহ করে প্রথমে লগইন বা সাইন আপ করুন।",
    listening: "🎙️ শুনছি... বাংলায় কথা বলুন",
    placeholder: "যেকোনো বিষয়ে প্রশ্ন করুন..."
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

document.addEventListener('DOMContentLoaded', () => {
  // নতুন এবং প্রিমিয়াম লক সিস্টেম সক্রিয় করা
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.style.display = 'flex';
    authModal.style.background = 'rgba(15, 23, 42, 0.85)';
    authModal.style.backdropFilter = 'blur(12px)';
  }
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraftAI';
  btn.style.cssText = 'position: fixed; bottom: 10px; right: 20px; background: linear-gradient(135deg, #2563eb, #7c3aed, #db2777); color: #fff; border: none; padding: 11px 20px; border-radius: 30px; font-weight: 700; cursor: pointer; z-index: 99999; box-shadow: 0 6px 20px rgba(37,99,235,0.4); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 380px; max-width: calc(100vw - 20px); height: 540px; max-height: 85vh; background: #fff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <span style="font-weight: 750; font-size: 14px; display: flex; align-items: center; gap: 6px;">🤖 DocuCraftAI</span>
      
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="speakerToggleBtn" onclick="toggleVoiceOutput()" style="background: #0f172a; color: #60a5fa; border: 1px solid #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;" title="Toggle Speaker">🔊</button>
        
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 4px 6px; border-radius: 6px; font-size: 11.5px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1; margin-left: 2px;">&times;</button>
      </div>
    </div>

    <div id="voiceStatusBar" style="display: none; background: #e0f2fe; color: #0369a1; padding: 6px 12px; font-size: 12px; font-weight: 600; text-align: center; border-bottom: 1px solid #bae6fd; flex-shrink: 0;">
      ${aiConversations.bn.listening}
    </div>

    <div id="aiChatBody" style="padding: 14px; flex: 1; overflow-y: auto; background: #f8fafc; font-size: 13.5px; -webkit-overflow-scrolling: touch;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #ffffff; color: #1e293b; padding: 12px 16px; border-radius: 14px 14px 14px 0; display: inline-block; border: 1px solid #e2e8f0; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
          ${aiConversations.bn.welcome}
        </span>
      </div>
    </div>

    <div style="padding: 12px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
      <input type="text" id="aiChatInput" placeholder="${aiConversations.bn.placeholder}" style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; outline: none; background: #f8fafc;" onkeypress="if(event.key==='Enter') sendUserMessage()">
      <button onclick="startVoiceInput()" style="background: #0284c7; color: #fff; border: none; padding: 10px 12px; border-radius: 10px; cursor: pointer;" title="Voice Input">🎤</button>
      <button onclick="sendUserMessage()" style="background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 15px; border-radius: 10px; cursor: pointer;">➤</button>
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

function toggleVoiceOutput() {
  isVoiceActive = !isVoiceActive;
  const speakerBtn = document.getElementById('speakerToggleBtn');
  if (speakerBtn) {
    if (isVoiceActive) {
      speakerBtn.innerHTML = '🔊';
      speakerBtn.style.color = '#60a5fa';
      speakText(currentLang === 'hi' ? 'स्पीकर चालू है।' : currentLang === 'en' ? 'Speaker turned on.' : 'স্পিকার অন করা হয়েছে।');
    } else {
      speakerBtn.innerHTML = '🔇';
      speakerBtn.style.color = '#94a3b8';
      window.speechSynthesis.cancel();
    }
  }
}

function changeAiLanguage(lang) {
  currentLang = lang;
  const langData = aiConversations[lang] || aiConversations.bn;
  
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

  detectLanguageFromQuery(query);
  appendUserMessage(query);
  if (input) input.value = '';

  const loadingId = 'loading_' + Date.now();
  appendAiMessage("...", loadingId);

  let reply = "";
  const q = query.toLowerCase();

  if (q.includes('কে বানিয়েছে') || q.includes('কে তৈরি করেছে') || q.includes('creator') || q.includes('who made')) {
    reply = currentLang === 'bn' ? 
      "👨‍💻 **DocuCraftAI** প্ল্যাটফর্মটি ইনদনীল রুইদাস (Indranil Ruidas) দ্বারা তৈরি ও পরিচালিত!" :
      "👨‍💻 **DocuCraftAI** was created and developed by Indranil Ruidas!";
  } else {
    reply = generateAdvancedSmartResponse(query, currentLang);
  }

  setTimeout(() => {
    removeAiMessage(loadingId);
    appendAiMessage(reply);
    speakText(reply);
  }, 600);
}

function detectLanguageFromQuery(text) {
  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;

  if (hindiRegex.test(text)) currentLang = 'hi';
  else if (bengaliRegex.test(text)) currentLang = 'bn';

  const selectEl = document.getElementById('aiLangSelect');
  if (selectEl) selectEl.value = currentLang;
}

function generateAdvancedSmartResponse(query, lang) {
  const answers = {
    bn: [
      `নমস্কার! "${query}" নিয়ে বলতে গেলে, এটি একটি চমৎকার বিষয়। আমাদের সাইটের টুলস কিংবা অন্য যেকোনো বিষয়ে আপনার আর কী জানার আছে বলুন!`
    ],
    hi: [
      `नमस्ते! "${query}" के बारे में बात करना बहुत अच्छा लगा। इस विषय पर आपकी क्या राय है?`
    ],
    en: [
      `Hello! Discussing "${query}" is quite fascinating. What are your thoughts on this?`
    ]
  };

  const list = answers[lang] || answers.bn;
  return list[Math.floor(Math.random() * list.length)];
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 10px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 10px 15px; border-radius: 16px 16px 0 16px; display: inline-block; font-size: 13.5px; max-width: 82%; word-break: break-word;">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text, id = '') {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div id="${id}" style="margin: 10px 0; text-align: left;"><span style="background: #ffffff; color: #1e293b; padding: 10px 15px; border-radius: 14px 14px 14px 0; display: inline-block; font-size: 13.5px; max-width: 82%; border: 1px solid #e2e8f0; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">🤖 ${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeAiMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice recognition not supported.');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = currentLang === 'bn' ? 'bn-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
  
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById('aiChatInput').value = text;
    sendUserMessage(text);
  };
  recognition.start();
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
