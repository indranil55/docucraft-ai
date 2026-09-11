// DocuCraft AI - True Multi-Language Live Conversational Assistant & Chat Logic (Gemini Style)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI, your live assistant. Ask me anything about science, history, coding, daily life, or our website tools!",
    default: "That is a fascinating topic! As your AI assistant, I can chat with you about anything—whether it's technology, science, literature, or daily conversations. Tell me more, what would you like to explore?",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Ask me anything..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ, आपका लाइव असिस्टेंट। आप मुझसे विज्ञान, इतिहास, कोडिंग या किसी भी विषय पर खुलकर बात कर सकते हैं!",
    default: "यह वास्तव में एक बहुत ही रोचक विषय है! मैं आपके साथ किसी भी विषय पर चर्चा कर सकता हूँ—चाहे वह विज्ञान हो, तकनीक हो, इतिहास हो या दैनिक जीवन की बातें। बताइए, इस बारे में आप और क्या जानना चाहते हैं?",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "मुझसे कुछ भी पूछें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI, আপনার লাইভ অ্যাসিস্ট্যান্ট। বিজ্ঞান, ইতিহাস, টেকনোলজি কিংবা যেকোনো সাধারণ বিষয় নিয়ে আমার সাথে খোলামেলা কথা বলতে পারেন!",
    default: "বিষয়টি নিয়ে সত্যিই অনেক কিছু ভাবার আছে! আপনার সাথে যেকোনো বিষয়ে আড্ডা দিতে বা আলোচনা করতে আমার খুব ভালো লাগে—তা হতে পারে বিজ্ঞান, মহাকাশ, কোডিং, ইতিহাস কিংবা সাধারণ জ্ঞান। বলুন, এই বিষয়ে আর কী জানতে চান?",
    listening: "🎙️ শুনছি... কথা বলুন স্পষ্ট করে",
    placeholder: "আমাকে যেকোনো কিছু জিজ্ঞেস করুন..."
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft AI Live';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 360px; max-width: calc(100vw - 20px); height: 480px; max-height: 80vh; background: #fff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: #1e293b; color: #fff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <span style="font-weight: 600; font-size: 13px;">🤖 DocuCraft Live AI</span>
      
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="speakerToggleBtn" onclick="toggleVoiceOutput()" style="background: #0f172a; color: #60a5fa; border: 1px solid #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;" title="Toggle Speaker">🔊</button>
        
        <select id="aiLangSelect" onchange="changeAiLanguage(this.value)" style="background: #0f172a; color: #fff; border: 1px solid #475569; padding: 4px 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">
          <option value="bn" selected>বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>
        <button onclick="toggleAiHelpdesk()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height: 1; margin-left: 2px;">&times;</button>
      </div>
    </div>

    <div id="voiceStatusBar" style="display: none; background: #e0f2fe; color: #0369a1; padding: 6px 12px; font-size: 12px; font-weight: 600; text-align: center; border-bottom: 1px solid #bae6fd; flex-shrink: 0;">
      ${aiKnowledge.bn.listening}
    </div>

    <div id="aiChatBody" style="padding: 12px; flex: 1; overflow-y: auto; background: #f8fafc; font-size: 13px; -webkit-overflow-scrolling: touch;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #f1f5f9; color: #1e293b; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; border: 1px solid #e2e8f0; line-height: 1.4;">
          ${aiKnowledge.bn.welcome}
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
      <input type="text" id="aiChatInput" placeholder="${aiKnowledge.bn.placeholder}" style="flex: 1; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none;" onkeypress="if(event.key==='Enter') sendUserMessage()">
      <button onclick="startVoiceInput()" style="background: #0284c7; color: #fff; border: none; padding: 9px 11px; border-radius: 8px; cursor: pointer;" title="Voice Input">🎤</button>
      <button onclick="sendUserMessage()" style="background: #2563eb; color: #fff; border: none; padding: 9px 14px; border-radius: 8px; cursor: pointer;">➤</button>
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
    const reply = generateGeminiStyleResponse(query, currentLang);
    appendAiMessage(reply);
    speakText(reply);
  }, 500);
}

function generateGeminiStyleResponse(query, lang) {
  const q = query.toLowerCase();
  
  if (q.includes('who are you') || q.includes('तुम कौन हो') || q.includes('কে তুমি') || q.includes('তোমার নাম কী')) {
    if (lang === 'hi') return 'मैं DocuCraft AI हूँ, एक एडवांस conversational assistant जिसे इंड्रनील रुइदास (Indranil Ruidas) ने विकसित किया है।';
    if (lang === 'en') return 'I am DocuCraft AI, an advanced conversational assistant developed by Indranil Ruidas.';
    return 'আমি DocuCraft AI, ইনদনীল রুইদাস (Indranil Ruidas) দ্বারা তৈরি একটি অ্যাডভান্সড এআই অ্যাসিস্ট্যান্ট।';
  }

  if (q.includes('tool') || q.includes('website') || q.includes('टूल') || q.includes('টুল') || q.includes('ওয়েবসাইট') || q.includes('pdf')) {
    if (lang === 'hi') return 'हमारी वेबसाइट पर विभिन्न प्रकार के उपयोगी टूल्स उपलब्ध हैं जैसे Photo & Sign KB/MB Resizer, Smart Passport Photo Studio, और PDF Tools!';
    if (lang === 'en') return 'Our platform features powerful utilities like Photo & Sign KB/MB Resizer, Smart Passport Photo Studio, and PDF processing tools.';
    return 'আমাদের প্ল্যাটফর্মে চমৎকার সব ইউটিলিটি রয়েছে যেমন Photo & Sign KB/MB Resizer, Smart Passport Photo Studio এবং প্রয়োজনীয় সব PDF Tools!';
  }

  if (q.includes('black hole') || q.includes('ब्लैक होल') || q.includes('ব্ল্যাক হোল')) {
    if (lang === 'hi') return 'ब्लैक होल ब्रह्मांड का एक ऐसा क्षेत्र है जहाँ गुरुत्वाकर्षण इतना अधिक होता है कि प्रकाश भी इससे बाहर नहीं निकल सकता।';
    if (lang === 'en') return 'A black hole is a region of spacetime where gravity is so strong that nothing—not even light—can escape from it.';
    return 'ব্ল্যাক হোল হলো মহাকাশের এমন একটি জায়গা যেখানে মহাকর্ষ বল এত বেশি যে আলোও সেখান থেকে বের হতে পারে না।';
  }

  if (q.includes('kemon acho') || q.includes('كيف حالك') || q.includes('कैसी हो') || q.includes('how are you') || q.includes('কেমন আছো')) {
    if (lang === 'hi') return 'मैं पूरी तरह से ठीक हूँ! बोलिए, आज हम किस दिलचस्प विषय पर बात करें?';
    if (lang === 'en') return 'I am doing fantastic! What interesting topic shall we discuss today?';
    return 'আমি একদম চমৎকার আছি! বলুন, আজ কোন আকর্ষণীয় বিষয় নিয়ে কথা বলতে চান?';
  }

  if (lang === 'hi') {
    return `यह एक बहुत ही विचारणीय प्रश्न है: "${query}"। इस विषय पर और गहराई से चर्चा की जा सकती है।`;
  } else if (lang === 'en') {
    return `That's a really insightful point about "${query}". There are many dimensions to explore here.`;
  } else {
    return `"${query}" বিষয়টি নিয়ে সত্যিই অনেক চমৎকার আলোচনা করা যেতে পারে। এই বিষয়ে আপনার মতামত কী?`;
  }
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 10px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 9px 14px; border-radius: 14px 14px 0 14px; display: inline-block; font-size: 13.5px; max-width: 82%; word-break: break-word;">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text, id = '') {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div id="${id}" style="margin: 10px 0; text-align: left;"><span style="background: #f1f5f9; color: #1e293b; padding: 9px 14px; border-radius: 14px 14px 14px 0; display: inline-block; font-size: 13.5px; max-width: 82%; border: 1px solid #e2e8f0; line-height: 1.45; word-break: break-word;">🤖 ${escapeHtml(text)}</span></div>`;
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
