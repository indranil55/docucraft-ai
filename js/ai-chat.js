// ================= js/ai-chat.js (Error-Revealing Version) =================

let isVoiceActive = true;
let currentLang = 'bn';

const welcomeMessages = {
  bn: "নমস্কার! আমি DocuCraftAI। আমি আপনার নিজের তৈরি AI অ্যাসিস্ট্যান্ট। যেকোনো বিষয়ে প্রশ্ন করুন!",
  hi: "नमस्ते! मैं DocuCraftAI हूँ। मैं आपका अपना बनाया हुआ AI सहायक हूँ। कुछ भी पूछें!",
  en: "Hello! I am DocuCraftAI. I am your own custom AI assistant. Ask me anything!"
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraftAI';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #7c3aed, #db2777); color: #fff; border: none; padding: 11px 20px; border-radius: 30px; font-weight: 700; cursor: pointer; z-index: 99999; box-shadow: 0 6px 20px rgba(37,99,235,0.4); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 380px; max-width: calc(100vw - 20px); height: 540px; max-height: 85vh; background: #fff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <span style="font-weight: 750; font-size: 14px; display: flex; align-items: center; gap: 6px;">🤖 DocuCraftAI</span>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="speakerToggleBtn" onclick="toggleVoiceOutput()" style="background: #0f172a; color: #60a5fa; border: 1px solid #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;">🔊</button>
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 4px 6px; border-radius: 6px; font-size: 11.5px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1; margin-left: 2px;">&times;</button>
      </div>
    </div>
    <div id="aiChatBody" style="padding: 14px; flex: 1; overflow-y: auto; background: #f8fafc; font-size: 13.5px; -webkit-overflow-scrolling: touch;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #ffffff; color: #1e293b; padding: 12px 16px; border-radius: 14px 14px 14px 0; display: inline-block; border: 1px solid #e2e8f0; line-height: 1.5;">${welcomeMessages.bn}</span>
      </div>
    </div>
    <div style="padding: 12px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
      <input type="text" id="aiChatInput" placeholder="যেকোনো বিষয়ে প্রশ্ন করুন..." style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; outline: none; background: #f8fafc;" onkeypress="if(event.key==='Enter') sendUserMessage()">
      <button onclick="startVoiceInput()" style="background: #0284c7; color: #fff; border: none; padding: 10px 12px; border-radius: 10px; cursor: pointer;">🎤</button>
      <button onclick="sendUserMessage()" style="background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 15px; border-radius: 10px; cursor: pointer;">➤</button>
    </div>
  `;
  document.body.appendChild(modal);
});

function toggleAiHelpdesk() {
  const modal = document.getElementById('autoAiModal');
  if (modal) modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function toggleVoiceOutput() {
  isVoiceActive = !isVoiceActive;
  const speakerBtn = document.getElementById('speakerToggleBtn');
  if (speakerBtn) {
    speakerBtn.innerHTML = isVoiceActive ? '🔊' : '🔇';
    speakerBtn.style.color = isVoiceActive ? '#60a5fa' : '#94a3b8';
    if (!isVoiceActive) window.speechSynthesis.cancel();
  }
}

function changeAiLanguage(lang) {
  currentLang = lang;
  document.getElementById('aiWelcomeMsg').innerText = welcomeMessages[lang];
}

function speakText(text) {
  if (!isVoiceActive || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'bn' ? 'bn-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
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
  appendAiMessage("টাইপ করছে...", loadingId);

  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  if (hindiRegex.test(query)) currentLang = 'hi';
  else if (bengaliRegex.test(query)) currentLang = 'bn';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, lang: currentLang })
    });

    // 🔥 আসল এরর মেসেজটি এখানে ধরা হচ্ছে
    if (!response.ok) {
      let errorMsg = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch(e) {}
      throw new Error(errorMsg);
    }

    const data = await response.json();

    if (data.reply) {
      removeAiMessage(loadingId);
      appendAiMessage(data.reply);
      speakText(data.reply);
    } else {
      throw new Error("ব্যাকএন্ড থেকে কোনো উত্তর আসেনি (Empty Reply)");
    }
  } catch (error) {
    console.error("Chat Error:", error);
    removeAiMessage(loadingId);
    // 🔥 এখন আসল সমস্যাটি চ্যাটবক্সে দেখা যাবে
    appendAiMessage(`⚠️ সমস্যা: ${error.message}`);
  }
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  chatBox.innerHTML += `<div style="margin: 10px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 10px 15px; border-radius: 16px 16px 0 16px; display: inline-block; max-width: 82%; word-break: break-word;">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text, id = '') {
  const chatBox = document.getElementById('aiChatBody');
  chatBox.innerHTML += `<div id="${id}" style="margin: 10px 0; text-align: left;"><span style="background: #ffffff; color: #1e293b; padding: 10px 15px; border-radius: 14px 14px 14px 0; display: inline-block; max-width: 82%; border: 1px solid #e2e8f0; line-height: 1.5;">🤖 ${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeAiMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert('Voice recognition not supported.'); return; }
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
