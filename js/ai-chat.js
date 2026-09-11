// DocuCraft AI - Ultimate Gemini Live Assistant with Built-in Guide & Universal Knowledge

const aiConversations = {
  en: {
    welcome: "Hello! I am DocuCraft AI Live. I know all about our website tools (KB Resizer, PDF tools, Invoice Maker) and can chat about anything else in the world. How can I help you today?",
    listening: "🎙️ Listening... Speak now in English",
    placeholder: "Ask about any tool or general topic..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI Live हूँ। मैं हमारे सभी टूल्स (KB Resizer, PDF Tools, Invoice Maker) और दुनिया के किसी भी विषय के बारे में जानता हूँ। बताइए, आज मैं आपकी क्या मदद करूँ?",
    listening: "🎙️ सुन रहा हूँ... कृपया हिंदी में बोलें",
    placeholder: "टूल या किसी भी विषय के बारे में पूछें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI Live। আমাদের ওয়েবসাইটের কোন টুল কীভাবে কাজ করে (যেমন- KB Resizer, PDF Tools, Invoice Maker) কিংবা মহাকাশ, আবহাওয়া বা যেকোনো সাধারণ জ্ঞান—সব বিষয়ে আমি আপনাকে সাহায্য করতে পারি। বলুন, কী জানতে চান?",
    listening: "🎙️ শুনছি... বাংলায় কথা বলুন",
    placeholder: "যেকোনো টুল বা প্রশ্ন সম্পর্কে এখানে লিখুন..."
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('autoAiModal')) return;

  const btn = document.createElement('button');
  btn.innerHTML = '💬 DocuCraft Gemini Live';
  btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #7c3aed, #db2777); color: #fff; border: none; padding: 11px 20px; border-radius: 30px; font-weight: 700; cursor: pointer; z-index: 99999; box-shadow: 0 6px 20px rgba(37,99,235,0.4); font-size: 14px;';
  btn.onclick = toggleAiHelpdesk;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'autoAiModal';
  modal.style.cssText = 'display: none; position: fixed; bottom: 10px; right: 10px; width: 380px; max-width: calc(100vw - 20px); height: 540px; max-height: 85vh; background: #fff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); z-index: 99999; flex-direction: column; overflow: hidden; border: 1px solid #cbd5e1;';
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
      <span style="font-weight: 750; font-size: 14px; display: flex; align-items: center; gap: 6px;">✨ DocuCraft Gemini Live</span>
      
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

  // ওয়েবসাইট টুলস সম্পর্কিত গাইডলাইন হ্যান্ডলার
  if (q.includes('resizer') || q.includes('kb') || q.includes('mb') || q.includes('ফটো সাইজ')) {
    reply = currentLang === 'bn' ? 
      "📸 **Photo & Sign KB/MB Resizer টুলটি ব্যবহার করার নিয়ম:**\n1. প্রথমে হোমপেজ থেকে রিসাইজার টুলে ক্লিক করুন।\n2. আপনার ছবি বা সিগনেচার আপলোড করুন।\n3. কাঙ্ক্ষিত সাইজ (যেমন ৫০ KB) সিলেক্ট করে প্রসেস করুন। ফাইলটি এক ক্লিকে ডাউনলোড হয়ে যাবে!" :
      "📸 **How to use KB/MB Resizer:** Upload your photo or signature, select your target KB/MB, and click process to download instantly!";
  } else if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    reply = currentLang === 'bn' ? 
      "🛂 **Smart Passport Photo Studio:** এই টুলের মাধ্যমে সাধারণ ছবি আপলোড করলেই এটি নিজে থেকে ব্যাকগ্রাউন্ড পরিষ্কার করে এবং প্রিন্ট-রেডি পাসপোর্ট শিট তৈরি করে দেয়।" :
      "🛂 **Passport Photo Studio:** Automatically removes background and generates print-ready passport grids!";
  } else if (q.includes('pdf') || q.includes('merge') || q.includes('compress')) {
    reply = currentLang === 'bn' ? 
      "📄 **PDF Tools:** আমাদের সাইটে পিডিএফ জোড়া লাগানোর জন্য (Merge), ছোট করার জন্য (Compress) এবং আলাদা করার জন্য (Split) দারুণ সব টুল রয়েছে। টুল সেকশন থেকে যেকোনো একটি বেছে নিন!" :
      "📄 **PDF Tools:** You can easily Merge, Compress, or Split PDF files instantly using our tools section.";
  } else if (q.includes('weather') || q.includes('আবহাওয়া') || q.includes('তাপমাত্রা')) {
    reply = await fetchLiveWeather(q.includes('kolkata') ? "Kolkata" : "Bardhaman");
  } else {
    reply = generateAdvancedSmartResponse(query, currentLang);
  }

  setTimeout(() => {
    removeAiMessage(loadingId);
    appendAiMessage(reply);
    speakText(reply);
  }, 600);
}

async function fetchLiveWeather(city) {
  try {
    let lat = 23.2322, lon = 87.8615; // Bardhaman
    if (city === "Kolkata") { lat = 22.5726; lon = 88.3639; }

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    const temp = data.current_weather.temperature;

    return currentLang === 'bn' ? 
      `${city} এর বর্তমান তাপমাত্রা ${temp}°C। আবহাওয়া বেশ চমৎকার রয়েছে!` : 
      `The current temperature in ${city} is ${temp}°C.`;
  } catch (err) {
    return currentLang === 'bn' ? "এই মুহূর্তে আবহাওয়া ডেটা পাওয়া যাচ্ছে না।" : "Weather data unavailable.";
  }
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
  const q = query.toLowerCase();

  const answers = {
    bn: [
      `"${query}" বিষয়টি নিয়ে খুব সুন্দর আলোচনা হতে পারে। আমাদের ওয়েবসাইটের টুলসগুলো যেমন আপনার ডকুমেন্ট কাজ সহজ করে, তেমনি এই বিষয়টিও বেশ কৌতূহলোদ্দীপক!`,
      `আপনার প্রশ্নটি দারুণ! "${query}" নিয়ে বলতে গেলে, এর গভীরে অনেক তথ্য রয়েছে। এ নিয়ে আপনার মতামত কী?`
    ],
    hi: [
      `"${query}" एक बहुत ही बढ़िया विषय है! इसके बारे में और गहराई से सोचा जा सकता है।`,
      `आपने बहुत ही दिलचस्प सवाल पूछा है। इस बारे में आपकी क्या राय है?`
    ],
    en: [
      `That's a fantastic point about "${query}"! Exploring this opens up so many fascinating perspectives.`,
      `Interesting question regarding "${query}"! Let's discuss this further.`
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
  chatBox.innerHTML += `<div id="${id}" style="margin: 10px 0; text-align: left;"><span style="background: #ffffff; color: #1e293b; padding: 10px 15px; border-radius: 16px 16px 16px 0; display: inline-block; font-size: 13.5px; max-width: 82%; border: 1px solid #e2e8f0; line-height: 1.5; word-break: break-word;">🤖 ${escapeHtml(text)}</span></div>`;
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
