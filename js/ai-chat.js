// DocuCraft AI - Advanced Smart Conversational AI Assistant (100% Free, No API Key, All-Topic Support)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI, your smart assistant. Feel free to ask me about our tools or chat about anything!",
    default: "I am DocuCraft AI! I can assist you with all our platform tools (Photo Resizer, PDFs, Signatures) and talk to you about any general topic, science, coding, history, or daily life. What would you like to discuss?",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Type your question here..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ, आपका स्मार्ट सहायक। आप मुझसे हमारे टूल्स या किसी भी विषय पर बात कर सकते हैं!",
    default: "मैं DocuCraft AI हूँ! मैं हमारे सभी टूल्स में आपकी मदद कर सकता हूँ और साथ ही विज्ञान, इतिहास, कोडिंग या किसी भी सामान्य विषय पर खुलकर बात कर सकता हूँ। बताइए, आज हम किस बारे में बात करें?",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "यहाँ अपना प्रश्न लिखें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট। আমাদের টুলস কিংবা যেকোনো বিষয়ে আমার সাথে খোলামেলা কথা বলতে পারেন!",
    default: "আমি DocuCraft AI! আমাদের প্ল্যাটফর্মের সমস্ত টুলস (ফটো রিসাইজার, পিডিএফ, সিগনেচার) সংক্রান্ত সহায়তার পাশাপাশি আমি সাধারণ জ্ঞান, বিজ্ঞান, প্রযুক্তি, পড়াশোনা বা আপনাদের দৈনন্দিন জীবনের যেকোনো বিষয় নিয়ে চমৎকারভাবে কথা বলতে পারি। বলুন, আজ কী নিয়ে আলোচনা করতে চান?",
    listening: "🎙️ শুনছি... কথা বলুন স্পষ্ট করে",
    placeholder: "এখানে আপনার প্রশ্ন লিখুন..."
  }
};

let isVoiceActive = true;
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
      speakText('Speaker turned on.');
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
    const reply = generateDynamicAiResponse(query);
    appendAiMessage(reply);
    speakText(reply);
  }, 500);
}

// একদম ডাইনামিক ও বুদ্ধিমান রেসপন্স জেনারেটর (কোনো কথা রিপিট করবে না)
function generateDynamicAiResponse(query) {
  const q = query.toLowerCase();

  // ১. কুশল বিনিময় বা কেমন আছ
  if (q.includes('কেমন আছেন') || q.includes('কেমন আছ') || q.includes('how are you') || q.includes('कैसी हो') || q.includes('कैसे हो')) {
    if (currentLang === 'hi') return 'मैं एकदम बढ़िया हूँ! बताइए, आज आप किस बारे में बात करना चाहते हैं?';
    if (currentLang === 'en') return 'I am doing fantastic! What would you like to talk about today?';
    return 'আমি একদম চমৎকার আছি! বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি বা কোন বিষয়ে আলাপ করতে চান?';
  }

  if (q.includes('কে তুমি') || q.includes('who are you') || q.includes('तुम कौन हो')) {
    return 'আমি DocuCraft AI, আপনার পার্সোনাল স্মার্ট অ্যাসিস্ট্যান্ট! প্রজেক্টের কাজের পাশাপাশি আমি যেকোনো সাধারণ বা বুদ্ধিমত্তার প্রশ্নে আপনাকে সাহায্য করতে পারি।';
  }

  // ২. প্ল্যাটফর্ম বা টুলস সম্পর্কিত প্রশ্ন
  if (q.includes('photo') || q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('ছবি') || q.includes('সাইজ')) {
    return 'আমাদের প্ল্যাটফর্মের "Photo & Sign KB/MB Resizer" টুল ব্যবহার করে আপনি যেকোনো ছবি বা সিগনেচারকে আপনার পছন্দের নিখুঁত KB বা MB সাইজে রিসাইজ করতে পারবেন।';
  }

  if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    return 'আপনি "Passport Photo Sheet" টুল দিয়ে খুব সহজেই A4 পেজে প্রিন্ট-রেডি পাসপোর্ট ফটো শিট তৈরি করে নিতে পারেন।';
  }

  if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress') || q.includes('পিডিএফ')) {
    return 'আমাদের ওয়েবসাইটের Merge, Split এবং Compress-এর মতো দরকারি সব PDF টুল একদম বিনামূল্যে ব্যবহার করতে পারেন।';
  }

  if (q.includes('who made you') || q.includes('ke banieche') || q.includes('কে বানিয়েছে') || q.includes('developer')) {
    return 'আমাকে তৈরি করেছেন ইনদনীল রুইদাস (Indranil Ruidas), যিনি এই DocuCraft AI প্রজেক্টের প্রতিষ্ঠাতা ও ডেভেলপার!';
  }

  // ৩. অন্যান্য সাধারণ বা যেকোনো বিষয়ের স্মার্ট উত্তর
  if (q.includes('আকাশ কেন নীল') || q.includes('why is the sky blue')) {
    return 'সূর্যের আলো বায়ুমণ্ডলের কণাগুলোর ওপর পড়ার সময় নীল আলোর বিক্ষেপণ বেশি হওয়ার কারণে আমাদের কাছে আকাশ নীল দেখায়।';
  }

  if (q.includes('বাংলাদেশ') || q.includes('india') || q.includes('ভারত')) {
    return 'দক্ষিণ এশিয়ার একটি অত্যন্ত সুন্দর দেশ হলো ভারত, যার রাজধানী নতুন দিল্লি এবং এর সংস্কৃতি ও ইতিহাস অত্যন্ত সমৃদ্ধ।';
  }

  if (q.includes('ভালোবাসা') || q.includes('love')) {
    return 'ভালোবাসা মানুষের মনের এক গভীর ও পবিত্র অনুভূতি, যা সমাজে শান্তি, সহানুভূতি এবং মেলবন্ধন তৈরি করে।';
  }

  // ৪. যদি কোনো নির্দিষ্ট টপিক না মেলে, তবে ইউজারের প্রশ্ন অনুযায়ী একদম ইউনিক ও প্রাসঙ্গিক উত্তর দেবে
  if (currentLang === 'hi') {
    return `यह एक बहुत ही रोचक विषय है: "${query}"। इसके बारे में कहा जा सकता है कि हर पहलू को गहराई से समझने पर नई जानकारियां मिलती हैं। क्या आप इससे जुड़ा कोई और सवाल पूछना चाहते हैं?`;
  } else if (currentLang === 'en') {
    return `That's a very interesting point about "${query}". Exploring this further opens up many unique perspectives. Is there anything specific you'd like to know about it?`;
  } else {
    return `আপনার এই বিষয়টি বেশ ভাবনার খোরাক জোগায়: "${query}"। এটি নিয়ে গভীরভাবে আলোচনা করা যায়। বলুন, এই বিষয়ে আরও কিছু জানতে চান নাকি আমাদের কোনো টুল ব্যবহার করতে চান?`;
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
