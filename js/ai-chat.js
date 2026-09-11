// DocuCraft AI - Advanced Multi-Language Conversational AI (Gemini Live Style)

const aiConversations = {
  en: {
    welcome: "Hello! I am DocuCraft AI. We can talk about anything—science, coding, history, or daily life. What's on your mind?",
    listening: "🎙️ Listening... Speak now in English",
    placeholder: "Type your message here...",
    fallbacks: [
      "That's a very interesting point! Tell me more about how you see it.",
      "I love discussing topics like this. What specific aspect would you like to dive into?",
      "That makes a lot of sense. Let's explore this a bit further. What are your thoughts?",
      "Fascinating! There's so much to unpack here. What else would you like to discuss about this?"
    ]
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ। हम विज्ञान, तकनीक, इतिहास या किसी भी विषय पर खुलकर बात कर सकते हैं। बताइए, आज क्या बात करें?",
    listening: "🎙️ सुन रहा हूँ... कृपया हिंदी में बोलें",
    placeholder: "यहाँ अपना संदेश टाइप करें...",
    fallbacks: [
      "यह वास्तव में एक बहुत ही दिलचस्प बात है! इस बारे में आपकी क्या राय है?",
      "मुझे इस तरह के विषयों पर चर्चा करना बहुत पसंद है। इसके बारे में और क्या जानना चाहते हैं?",
      "आपकी बात बिल्कुल सही है। चलिए इस पर थोड़ा और विस्तार से बात करते हैं।",
      "यह बहुत ही बढ़िया सवाल है! इस पर आपका क्या सोचना है?"
    ]
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI। বিজ্ঞান, কোডিং, ইতিহাস বা যেকোনো সাধারণ বিষয় নিয়ে আপনি আমার সাথে খোলামেলা আড্ডা বা আলোচনা করতে পারেন। বলুন, আজ কী নিয়ে কথা বলব?",
    listening: "🎙️ শুনছি... বাংলায় কথা বলুন",
    placeholder: "এখানে আপনার মেসেজ লিখুন...",
    fallbacks: [
      "বিষয়টি নিয়ে সত্যিই অনেক চমৎকার আলোচনা করা যেতে পারে! এই বিষয়ে আপনার নিজস্ব মতামত কী বলুন তো?",
      "আপনার কথাটি বেশ দারুণ! এই প্রসঙ্গে আপনার সাথে একমত হওয়া যায়। এ নিয়ে আরও কিছু কি বলতে চান?",
      "বেশ চমৎকার একটি পয়েন্ট তুলেছেন! এই বিষয়ে বিস্তারিত বলতে গেলে বলা যায় যে, এটি বেশ গভীর একটি বিষয়।",
      "আপনার এই প্রশ্নটি নিয়ে আরও অনেক নতুন তথ্য জানা যেতে পারে। এ বিষয়ে আপনার ধারণা কেমন?"
    ]
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft Live AI';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #db2777); color: #fff; border: none; padding: 10px 18px; border-radius: 30px; font-weight: 600; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 360px; max-width: calc(100vw - 20px); height: 500px; max-height: 80vh; background: #fff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
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
      ${aiConversations.bn.listening}
    </div>

    <div id="aiChatBody" style="padding: 12px; flex: 1; overflow-y: auto; background: #f8fafc; font-size: 13px; -webkit-overflow-scrolling: touch;">
      <div style="margin: 8px 0; text-align: left;">
        <span id="aiWelcomeMsg" style="background: #f1f5f9; color: #1e293b; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; border: 1px solid #e2e8f0; line-height: 1.4;">
          ${aiConversations.bn.welcome}
        </span>
      </div>
    </div>

    <div style="padding: 10px; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
      <input type="text" id="aiChatInput" placeholder="${aiConversations.bn.placeholder}" style="flex: 1; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none;" onkeypress="if(event.key==='Enter') sendUserMessage()">
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

  // অটো ল্যাঙ্গুয়েজ ডিটেকশন (ব্যবহারকারী যে ভাষায় লিখবে বা বলবে, চ্যাটবট সেই ভাষা ধরে নেবে)
  detectLanguageFromQuery(query);

  appendUserMessage(query);
  if (input) input.value = '';

  const loadingId = 'loading_' + Date.now();
  appendAiMessage("...", loadingId);

  setTimeout(() => {
    removeAiMessage(loadingId);
    const reply = generateSmartConversationalResponse(query, currentLang);
    appendAiMessage(reply);
    speakText(reply);
  }, 600);
}

// ব্যবহারকারীর ইনপুট থেকে ভাষা স্বয়ংক্রিয়ভাবে চেনার ফাংশন
function detectLanguageFromQuery(text) {
  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;

  if (hindiRegex.test(text)) {
    currentLang = 'hi';
  } else if (bengaliRegex.test(text)) {
    currentLang = 'bn';
  } else {
    // যদি ইংরেজি বা রোমান হরফে লিখে তবে টেক্সট চেক করে ভাষা নির্ধারণ করা যায়
    const low = text.toLowerCase();
    if (low.includes('kemon') || low.includes('ki') || low.includes('keno') || low.includes('amar')) {
      currentLang = 'bn';
    } else if (low.includes('kaise') || low.includes('kya') || low.includes('hai') || low.includes('hain')) {
      currentLang = 'hi';
    }
  }

  // ড্রপডাউন বা UI সিলেক্টও অটো আপডেট করে দেওয়া
  const selectEl = document.getElementById('aiLangSelect');
  if (selectEl) selectEl.value = currentLang;
}

// জেমিনির মতো যেকোনো কথার স্বয়ংক্রিয় এবং পরিবর্তনশীল উত্তর জেনারেটর
function generateSmartConversationalResponse(query, lang) {
  const q = query.toLowerCase();
  
  // ১. পরিচয় বা ডেভেলপার সংক্রান্ত প্রশ্ন
  if (q.includes('who are you') || q.includes('কে তুমি') || q.includes('तुम कौन हो') || q.includes('তোমার নাম')) {
    if (lang === 'hi') return 'मैं DocuCraft AI हूँ, जिसे इंड्रनील रुइदास (Indranil Ruidas) द्वारा एक स्मार्ट और नेचुरल असिस्टेंट के रूप में बनाया गया है।';
    if (lang === 'en') return 'I am DocuCraft AI, a natural conversational assistant created by Indranil Ruidas to chat and help you with anything.';
    return 'আমি DocuCraft AI, ইনদনীল রুইদাস (Indranil Ruidas) দ্বারা তৈরি একটি স্মার্ট ও ন্যাচারাল এআই অ্যাসিস্ট্যান্ট। যেকোনো বিষয়ে খোলামেলা কথা বলতে আমি প্রস্তুত!';
  }

  // ২. ওয়েবসাইট টুলস সংক্রান্ত প্রশ্ন
  if (q.includes('tool') || q.includes('website') || q.includes('টুল') || q.includes('ওয়েবসাইট') || q.includes('pdf') || q.includes('पासपोर्ट')) {
    if (lang === 'hi') return 'हमारी वेबसाइट पर Photo & Sign KB/MB Resizer, Smart Passport Photo Studio, और PDF Merge/Split जैसे कई शानदार टूल्स मौजूद हैं। आप इनका खुलकर उपयोग कर सकते हैं!';
    if (lang === 'en') return 'Our website features incredible utilities like Photo & Sign KB/MB Resizer, Smart Passport Photo Studio, and robust PDF tools to make your work effortless.';
    return 'আমাদের ওয়েবসাইটে Photo & Sign KB/MB Resizer, Smart Passport Photo Studio এবং প্রয়োজনীয় সব PDF Tools খুব সহজেই ব্যবহার করতে পারেন!';
  }

  // ৩. বিজ্ঞান, মহাকাশ বা প্রযুক্তি (Science & Tech)
  if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('एआई') || q.includes('প্রযুক্তি')) {
    if (lang === 'hi') return 'आर्टिफिशियल इंटेलिजेंस (AI) आज के समय में दुनिया को तेजी से बदल रहा है। यह मशीनों को इंसानों की तरह सोचने और सीखने की क्षमता देता है। इस बारे में आपका क्या सोचना है?';
    if (lang === 'en') return 'Artificial Intelligence is transforming our world rapidly, enabling machines to process data, learn, and reason much like humans do. How do you see AI shaping the future?';
    return 'আর্টিফিশিয়াল ইন্টেলিজেন্স বা এআই হলো প্রযুক্তির এক বিপ্লব, যা মেশিনকে মানুষের মতো চিন্তা করতে ও শিখতে সহায়তা করে। ভবিষ্যতের পৃথিবীতে এআই নিয়ে আপনার ধারণা কী?';
  }

  if (q.includes('space') || q.includes('universe') || q.includes('ब्रह्मांड') || q.includes('মহাকাশ') || q.includes('black hole')) {
    if (lang === 'hi') return 'ब्रह्मांड रहस्यों से भरा हुआ है! अरबों आकाशगंगाएँ, तारे और ब्लैक होल्स इसके सबसे दिलचस्प हिस्से हैं। क्या आपको स्पेस मिस्ट्रीज़ पढ़ना पसंद है?';
    if (lang === 'en') return 'The universe is filled with endless mysteries—billions of galaxies, expanding space, and enigmatic black holes. Are you fascinated by space exploration?';
    return 'মহাকাশ এক অন্তহীন রহস্যে ভরা। কোটি কোটি গ্যালাক্সি আর ব্ল্যাক হোলের এই জগৎ নিয়ে মানুষের কৌতূহলের শেষ নেই। মহাকাশ বিজ্ঞান নিয়ে আপনার কি বিশেষ আগ্রহ আছে?';
  }

  // ৪. কুশল বিনিময় বা চ্যাট (Greetings)
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('नमस्ते') || q.includes('কেমন') || q.includes('kemon')) {
    if (lang === 'hi') return 'नमस्ते! मैं पूरी तरह से ठीक हूँ। बताइए, आज हम किस दिलचस्प विषय पर बात करें?';
    if (lang === 'en') return 'Hello there! I am doing great. What interesting topic shall we chat about today?';
    return 'নমস্কার! আমি একদম ভালো আছি। বলুন, আজ কোন মজার বা ইন্টারেস্টিং বিষয় নিয়ে আলোচনা করা যাক?';
  }

  // ৫. র্যান্ডম ও পরিবর্তনশীল কনভার্সেশনাল ফলব্যাক (যাতে প্রতিবার আলাদা ও নতুন উত্তর দেয়)
  const langData = aiConversations[lang] || aiConversations.bn;
  const fallbacks = langData.fallbacks;
  const randomIndex = Math.floor(Math.random() * fallbacks.length);
  return fallbacks[randomIndex];
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
  const langData = aiConversations[currentLang] || aiConversations.bn;

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
  return String(text = value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
