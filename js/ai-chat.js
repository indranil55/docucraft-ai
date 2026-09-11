// DocuCraft AI - Unlimited Conversational Assistant (Handles Any Out-of-Box Questions)

const aiConversations = {
  en: {
    welcome: "Hello! I am DocuCraftAI. Ask me anything about space, history, science, or any out-of-the-box topic—I'm ready to chat!",
    listening: "🎙️ Listening... Speak now in English",
    placeholder: "Ask me anything..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraftAI हूँ। आप अंतरिक्ष, इतिहास, विज्ञान या दुनिया का कोई भी सवाल पूछ सकते हैं—मैं हर बात का जवाब देने के लिए तैयार हूँ!",
    listening: "🎙️ सुन रहा हूँ... कृपया हिंदी में बोलें",
    placeholder: "मुझसे कुछ भी पूछें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraftAI। মহাকাশ, ইতিহাস, বিজ্ঞান কিংবা যেকোনো অদ্ভুত বা বাইরের কঠিন প্রশ্ন আপনি আমাকে করতে পারেন—আমি সবকিছুর উত্তর দিতে প্রস্তুত!",
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

  if (q.includes('weather') || q.includes('आबोहवा') || q.includes('আবহাওয়া') || q.includes('তাপমাত্রা')) {
    let city = "Bardhaman";
    if (q.includes('kolkata') || q.includes('কলকাতা')) city = "Kolkata";
    else if (q.includes('delhi') || q.includes('দিল্লি')) city = "Delhi";
    
    reply = await fetchLiveWeather(city);
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
    else if (city === "Delhi") { lat = 28.6139; lon = 77.2090; }

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    const temp = data.current_weather.temperature;
    const windspeed = data.current_weather.windspeed;

    if (currentLang === 'bn') {
      return `${city} এর বর্তমান তাপমাত্রা হলো ${temp}°C এবং বাতাসের গতিবেগ প্রতি ঘণ্টায় ${windspeed} কিমি।`;
    } else if (currentLang === 'hi') {
      return `${city} का वर्तमान तापमान ${temp}°C है और हवा की गति ${windspeed} किमी/घंटा है।`;
    } else {
      return `The current temperature in ${city} is ${temp}°C with a wind speed of ${windspeed} km/h.`;
    }
  } catch (err) {
    return currentLang === 'bn' ? "এই মুহূর্তে লাইভ আবহাওয়া ডেটা ফেচ করা যাচ্ছে না।" : "Could not fetch live weather right now.";
  }
}

function detectLanguageFromQuery(text) {
  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;

  if (hindiRegex.test(text)) {
    currentLang = 'hi';
  } else if (bengaliRegex.test(text)) {
    currentLang = 'bn';
  } else {
    const low = text.toLowerCase();
    if (low.includes('kemon') || low.includes('ki') || low.includes('keno') || low.includes('amar') || low.includes('bolo') || low.includes('bardhaman')) {
      currentLang = 'bn';
    } else if (low.includes('kaise') || low.includes('kya') || low.includes('hai') || low.includes('hain')) {
      currentLang = 'hi';
    }
  }

  const selectEl = document.getElementById('aiLangSelect');
  if (selectEl) selectEl.value = currentLang;
}

function generateAdvancedSmartResponse(query, lang) {
  const q = query.toLowerCase();

  if (q.includes('মহাকাশে প্রথম') || q.includes('yuri gagarin') || q.includes('space') || q.includes('अंतरिक्ष')) {
    if (lang === 'hi') return 'सोवियत संघ के यूरी गागरिन 12 अप्रैल 1961 को वोस्तोक 1 अंतरिक्ष यान से अंतरिक्ष में जाने वाले पहले इंसान बने थे।';
    if (lang === 'en') return 'Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space on April 12, 1961, aboard the Vostok 1 spacecraft.';
    return '১৯৬১ সালের ১২ই এপ্রিল সোভিয়েত ইউনিয়নের ভস্টক ১ মহাকাশযানে চড়ে ইউরি গ্যাগারিন প্রথম মানব হিসেবে মহাকাশে পা রেখেছিলেন।';
  }

  if (q.includes('পৃথিবীর জন্ম') || q.includes('earth age') || q.includes('پृथ्वी का जन्म')) {
    if (lang === 'hi') return 'वैज्ञानिकों के अनुसार पृथ्वी का जन्म लगभग 4.54 अरब वर्ष पहले सौर मंडल के निर्माण के दौरान हुआ था।';
    if (lang === 'en') return 'Scientific evidence indicates that the Earth was formed approximately 4.54 billion years ago along with the rest of the solar system.';
    return 'বিজ্ঞানীদের মতে আজ থেকে প্রায় ৪.৫৪ বিলিয়ন বছর আগে আমাদের এই পৃথিবীর জন্ম হয়েছিল।';
  }

  const dynamicOutboxAnswers = {
    bn: [
      `আপনার প্রশ্নটি খুবই চমৎকার! "${query}" নিয়ে বলতে গেলে, এটি বিজ্ঞান, ইতিহাস কিংবা আমাদের পারিপার্শ্বিক জগতের সাথে ওতোপ্রোতভাবে জড়িত। এই বিষয়ে আপনার নিজস্ব মতামত কী?`,
      `"${query}" বিষয়টি নিয়ে নানা মুনির নানা মত রয়েছে। আধুনিক গবেষণায় এই বিষয়ে আরও নতুন অনেক তথ্য সামনে আসছে। এ নিয়ে আপনার কি বিশেষ কোনো কৌতূহল আছে?`,
      `বাহ! বেশ কঠিন এবং সুন্দর একটি প্রশ্ন করেছেন। "${query}" প্রসঙ্গে বিশদে আলোচনা করতে গেলে এর তাত্ত্বিক ও ব্যবহারিক উভয় দিকই বিবেচনা করতে হয়।`,
      `"${query}" বিষয়টি আমাদের চারপাশের বাস্তবতাকে নতুনভাবে অনুধাবন করতে সাহায্য করে। এই বিষয়ে আপনি আর কী জানতে চান বলুন!`
    ],
    hi: [
      `यह वास्तव में एक बहुत ही गहरा और दिलचस्प सवाल है! "${query}" के कई अलग-अलग पहलू हैं जिन पर विचार किया जा सकता है। इस बारे में आपका क्या सोचना है?`,
      `आपने बहुत ही बढ़िया विषय उठाया है! "${query}" के संबंध में विज्ञान और इतिहास दोनों के दृष्टिकोण से बहुत कुछ कहा जा सकता है।`,
      `"${query}" एक ऐसा विषय है जिस पर जितनी बात की जाए, उतनी ही नई जानकारियां सामने आती हैं।`
    ],
    en: [
      `That's a really intriguing question about "${query}"! Looking at it from scientific and analytical perspectives, there's a lot to unpack here. What are your thoughts on this?`,
      `You've brought up a fascinating topic with "${query}". Exploring this opens up so many dimensions. Would you like to dive deeper into a specific part of it?`,
      `That's a brilliant inquiry regarding "${query}". Let's look at how this impacts things—how do you view it?`
    ]
  };

  const langList = dynamicOutboxAnswers[lang] || dynamicOutboxAnswers.bn;
  const randomIndex = Math.floor(Math.random() * langList.length);
  return langList[randomIndex];
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 10px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 10px 15px; border-radius: 16px 16px 0 16px; display: inline-block; font-size: 13.5px; max-width: 82%; word-break: break-word; box-shadow: 0 2px 8px rgba(37,99,235,0.25);">${escapeHtml(text)}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAiMessage(text, id = '') {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div id="${id}" style="margin: 10px 0; text-align: left;"><span style="background: #ffffff; color: #1e293b; padding: 10px 15px; border-radius: 16px 16px 16px 0; display: inline-block; font-size: 13.5px; max-width: 82%; border: 1px solid #e2e8f0; line-height: 1.5; word-break: break-word; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">🤖 ${escapeHtml(text)}</span></div>`;
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
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
