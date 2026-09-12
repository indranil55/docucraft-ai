// DocuCraftAI - Unlimited Conversational Assistant (Handles Personal Intro, Site Guide & Out-of-Box Questions)

const aiConversations = {
  en: {
    welcome: "Hello! I am DocuCraftAI, the smart assistant of this website. I am doing great, hope you are doing well too! I was created by Indranil Ruidas from Bardhaman, West Bengal. How can I help you today?",
    listening: "🎙️ Listening... Speak now in English",
    placeholder: "Ask me anything..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraftAI हूँ, इस वेबसाइट का स्मार्ट सहायक। मैं बहुत अच्छा हूँ, आशा है आप भी अच्छे होंगे! मुझे पश्चिम बंगाल के बर्धमान से इंद्रनील रुइदास (Indranil Ruidas) द्वारा बनाया गया है। बताइए, आज मैं आपकी क्या मदद करूँ?",
    listening: "🎙️ सुन रहा हूँ... कृपया हिंदी में बोलें",
    placeholder: "मुझसे कुछ भी पूछें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraftAI, এই ওয়েবসাইটের স্মার্ট অ্যাসিস্ট্যান্ট। আমি খুব ভালো আছি, আশা করি আপনিও ভীষণ ভালো আছেন! আমাকে তৈরি করেছেন ইনদনীল রুইদাস (Indranil Ruidas), বাড়ি পশ্চিমবঙ্গের বর্ধমান জেলায়। বলুন, আপনাকে কীভাবে সাহায্য করতে পারি?",
    listening: "🎙️ শুনছি... বাংলায় কথা বলুন",
    placeholder: "যেকোনো বিষয়ে প্রশ্ন করুন..."
  }
};

let isVoiceActive = true;
let currentLang = 'bn';

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

  // ব্যক্তিগত পরিচয় ও ক্রিয়েটর সম্পর্কিত প্রশ্ন হ্যান্ডলার
  if (q.includes('কে বানিয়েছে') || q.includes('কে তৈরি করেছে') || q.includes('creator') || q.includes('who made')) {
    reply = currentLang === 'bn' ? 
      "👨‍💻 **DocuCraftAI** প্ল্যাটফর্মটি ইনদনীল রুইদাস (Indranil Ruidas) দ্বারা তৈরি ও পরিচালিত!" :
      "👨‍💻 **DocuCraftAI** was created and developed by Indranil Ruidas!";
  } else if (q.includes('কোথায় বাড়ি') || q.includes('কোথায় বাড়ি') || q.includes('where is your home') || q.includes('bardhaman')) {
    reply = currentLang === 'bn' ? 
      "🏡 ক্রিয়েটর ইনদনীল রুইদাসের বাড়ি পশ্চিমবঙ্গের বর্ধমান (Bardhaman, West Bengal) জেলায়।" :
      "🏡 The creator Indranil Ruidas is from Bardhaman, West Bengal, India.";
  } else if (q.includes('কেমন আছো') || q.includes('কেমন আছেন') || q.includes('how are you')) {
    reply = currentLang === 'bn' ? 
      "😊 আমি নমস্কার জানিয়ে বলছি, আমি খুব ভালো আছি! আশা করি আপনিও অনেক ভালো আছেন। বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি?" :
      "😊 I am doing great! Hope you are doing wonderful as well. How can I assist you today?";
  } else if (q.includes('পছন্দ নয়') || q.includes('ভালো নয়') || q.includes('bad') || q.includes('not good')) {
    reply = currentLang === 'bn' ? 
      "🙏 আপনার মূল্যবান মতামতের জন্য ধন্যবাদ! আপনার পছন্দ অনুযায়ী এটিকে আরও উন্নত করার জন্য আমি সবসময় প্রস্তুত আছি। বলুন, কী পরিবর্তন করলে আপনার আরও ভালো লাগবে?" :
      "🙏 Thank you for your feedback! I'm always here to improve and adapt to your preferences. Let me know what you'd like to change!";
  } else if (q.includes('resizer') || q.includes('kb') || q.includes('mb') || q.includes('ফটো সাইজ')) {
    reply = currentLang === 'bn' ? 
      "📸 **Photo & Sign KB/MB Resizer:** আপনার ছবি বা সিগনেচার আপলোড করে নির্দিষ্ট KB বা MB (যেমন- ৫০ KB) সিলেক্ট করে এক ক্লিকে রিসাইজ করে নিন।" :
      "📸 **KB/MB Resizer:** Upload your photo/signature and compress it precisely to your target size instantly!";
  } else if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    reply = currentLang === 'bn' ? 
      "🛂 **Smart Passport Photo Studio:** যেকোনো সাধারণ ছবি দিয়ে ব্যাকগ্রাউন্ড পরিষ্কার (সাদা বা রয়্যাল ব্লু) করে প্রিন্ট-রেডি পাসপোর্ট সাইজ শিট তৈরি করুন।" :
      "🛂 **Passport Studio:** Generates clean background passport photo sheets instantly!";
  } else if (q.includes('weather') || q.includes('আবহাওয়া') || q.includes('তাপমাত্রা')) {
    reply = await fetchLiveWeather("Bardhaman");
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
  const answers = {
    bn: [
      `নমস্কার! "${query}" নিয়ে বলতে গেলে, এটি একটি চমৎকার বিষয়। আমাদের সাইটের টুলস কিংবা অন্য যেকোনো বিষয়ে আপনার আর কী জানার আছে বলুন!`,
      `আপনার প্রশ্নটি খুবই সুন্দর! "${query}" প্রসঙ্গে বিস্তারিত আলোচনা করা যেতে পারে। এ নিয়ে আপনার মতামত কী?`
    ],
    hi: [
      `नमस्ते! "${query}" के बारे में बात करना बहुत अच्छा लगा। इस विषय पर आपकी क्या राय है?`,
      `यह एक बहुत ही दिलचस्प सवाल है! इसके बारे में आप और क्या जानना चाहते हैं?`
    ],
    en: [
      `Hello! Discussing "${query}" is quite fascinating. What are your thoughts on this?`,
      `That's an interesting inquiry about "${query}"! How can I help you explore this further?`
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
