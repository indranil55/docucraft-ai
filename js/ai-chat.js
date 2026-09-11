// DocuCraft AI - True Multi-Language Smart Conversational Assistant (100% Free, No API Key Needed)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI, your smart assistant. Ask me anything about our tools or any general topic!",
    default: "That is an interesting point! I am DocuCraft AI, and I can help you with all our website tools (KB Resizer, PDFs, Signatures) as well as chat with you about science, history, coding, or daily life. What would you like to discuss?",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Type your question here..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ, आपका स्मार्ट सहायक। आप मुझसे हमारे टूल्स या किसी भी विषय के बारे में पूछ सकते हैं!",
    default: "यह एक बहुत ही दिलचस्प बात है! मैं DocuCraft AI हूँ, और मैं हमारे सभी टूल्स (KB Resizer, PDFs, Signatures) के साथ-साथ विज्ञान, इतिहास, कोडिंग या किसी भी विषय पर बात कर सकता हूँ। बताइए, आज हम किस बारे में बात करें?",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "यहाँ अपना प्रश्न लिखें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট। আমাদের টুলস বা যেকোনো সাধারণ বিষয়ে আমাকে প্রশ্ন করতে পারেন!",
    default: "বিষয়টি বেশ চমৎকার! আমি DocuCraft AI। আমাদের ওয়েবসাইটের সমস্ত টুলস (ফটো রিসাইজার, পিডিএফ, সিগনেচার) ব্যবহারের পাশাপাশি আমি বিজ্ঞান, ইতিহাস, প্রযুক্তি বা যেকোনো সাধারণ বিষয়ে আপনার সাথে খোলামেলা কথা বলতে পারি। বলুন, আজ কী নিয়ে আলোচনা করতে চান?",
    listening: "🎙️ শুনছি... কথা বলুন স্পষ্ট করে",
    placeholder: "এখানে আপনার প্রশ্ন লিখুন..."
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

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
    const reply = generateMultilingualResponse(query, currentLang);
    appendAiMessage(reply);
    speakText(reply);
  }, 400);
}

// ভাষা অনুযায়ী নিখুঁত ও আলাদা উত্তর জেনারেটর
function generateMultilingualResponse(query, lang) {
  const q = query.toLowerCase();
  const dict = aiKnowledge[lang] || aiKnowledge.bn;

  // ১. কুশল বিনিময় (Hello / Hi / Namaste / Kemon achhen)
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('नमस्ते') || q.includes('কেমন') || q.includes('कैसी') || q.includes('kemon')) {
    if (lang === 'hi') return 'नमस्ते! मैं एकदम ठीक हूँ। बताइए, आज मैं आपकी क्या सहायता कर सकता हूँ?';
    if (lang === 'en') return 'Hello there! I am doing great. How can I help you today?';
    return 'নমস্কার! আমি একদম ভালো আছি। বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি?';
  }

  // ২. পরিচয় বা কে তৈরি করেছে
  if (q.includes('who are you') || q.includes('तुम कौन हो') || q.includes('কে তুমি')) {
    if (lang === 'hi') return 'मैं DocuCraft AI हूँ, आपका स्मार्ट असिस्टेंट जिसे इंड्रनील रुइदास (Indranil Ruidas) ने बनाया है।';
    if (lang === 'en') return 'I am DocuCraft AI, your smart assistant created by Indranil Ruidas.';
    return 'আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট যাকে ইনদনীল রুইদাস (Indranil Ruidas) তৈরি করেছেন।';
  }

  // ৩. টুলস বা ওয়েবসাইট সম্পর্কিত প্রশ্ন
  if (q.includes('tool') || q.includes('website') || q.includes('टूल') || q.includes('টুল') || q.includes('ওয়েবসাইট')) {
    if (lang === 'hi') return 'हमारी वेबसाइट पर कई बेहतरीन टूल्स उपलब्ध हैं जैसे: Photo & Sign KB/MB Resizer, Passport Photo Sheet, Digital Signature Maker, और PDF Tools!';
    if (lang === 'en') return 'Our website offers amazing tools like Photo & Sign KB/MB Resizer, Passport Photo Sheet, Digital Signature Maker, and PDF Tools!';
    return 'আমাদের ওয়েবসাইটে চমৎকার সব টুল রয়েছে যেমন: Photo & Sign KB/MB Resizer, Passport Photo Sheet, Digital Signature Maker এবং PDF Tools!';
  }

  if (q.includes('photo') || q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('фото') || q.includes('ফটো')) {
    if (lang === 'hi') return 'आप "Photo & Sign KB/MB Resizer" टूल का उपयोग करके किसी भी फोटो या हस्ताक्षर को सटीक KB या MB में बदल सकते हैं।';
    if (lang === 'en') return 'You can use the "Photo & Sign KB/MB Resizer" tool to precisely resize any photo or signature to your target KB or MB.';
    return 'আপনি "Photo & Sign KB/MB Resizer" টুল ব্যবহার করে যেকোনো ছবি বা সিগনেচারকে আপনার পছন্দমতো KB বা MB-তে রিসাইজ করতে পারেন।';
  }

  // ৪. সাধারণ জ্ঞান বা অন্যান্য যেকোনো বিষয়
  if (q.includes('sky') || q.includes('आकाश') || q.includes('আকাশ')) {
    if (lang === 'hi') return 'प्रकीर्णन (Scattering) के कारण सूर्य का प्रकाश वातावरण में फैल जाता है, जिससे आकाश नीला दिखाई देता है।';
    if (lang === 'en') return 'Due to Rayleigh scattering of sunlight in the atmosphere, the sky appears blue to our eyes.';
    return 'বায়ুমণ্ডলে আলোর বিক্ষেপণের (Scattering) কারণে আমাদের কাছে আকাশ নীল দেখায়।';
  }

  if (q.includes('love') || q.includes('प्यार') || q.includes('ভালোবাসা')) {
    if (lang === 'hi') return 'प्यार और स्नेह इंसानी जीवन का सबसे खूबसूरत हिस्सा हैं, जो समाज में शांति लाते हैं।';
    if (lang === 'en') return 'Love and compassion are the most beautiful aspects of human life, bringing peace and harmony.';
    return 'ভালোবাসা ও সহানুভূতি মানুষের জীবনের সবচেয়ে সুন্দর দিক, যা সমাজে শান্তি ও সৌহার্দ্য নিয়ে আসে।';
  }

  // ৫. যেকোনো নতুন বা সাধারণ প্রশ্নের জন্য ভাষা অনুযায়ী পারফেক্ট জেনেরিক উত্তর
  if (lang === 'hi') {
    return `आपने बहुत अच्छा प्रश्न पूछा है: "${query}"। इस विषय पर व्यापक रूप से चर्चा की जा सकती है। क्या आप इसके बारे में कुछ और जानना चाहते हैं?`;
  } else if (lang === 'en') {
    return `That is a thoughtful question about "${query}". There is a lot more we can explore regarding this topic. Is there anything specific you would like to know?`;
  } else {
    return `আপনার প্রশ্নটি বেশ সুন্দর: "${query}"। বিষয়টি নিয়ে আরও বিস্তারিত আলোচনা করা যেতে পারে। এই বিষয়ে কি আরও কিছু জানতে চান?`;
  }
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
