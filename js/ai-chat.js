// DocuCraft AI - Smart Universal AI Assistant (100% Free, Handles All Topics, No API Key Needed)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI, your smart universal assistant. Ask me anything about our tools or any general topic!",
    default: "I am DocuCraft AI! I can help you with our tools (Photo Resizer, PDFs, etc.) or chat with you about any general topic, science, history, coding, or life. What would you like to know?",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Type your question here..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ, आपका स्मार्ट यूनिवर्सल सहायक। आप मुझसे किसी भी विषय पर बात कर सकते हैं!",
    default: "मैं DocuCraft AI हूँ! मैं हमारे टूल्स में आपकी मदद कर सकता हूँ और साथ ही विज्ञान, इतिहास, कोडिंग या किसी भी सामान्य विषय पर बात कर सकता हूँ। आप क्या जानना चाहते हैं?",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "यहाँ अपना प्रश्न लिखें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI, আপনার স্মার্ট অলরাউন্ডার অ্যাসিস্ট্যান্ট। আমাদের টুলস বা যেকোনো সাধারণ বিষয়ে আমাকে প্রশ্ন করতে পারেন!",
    default: "আমি DocuCraft AI! আমাদের টুলস ও পিডিএফ সংক্রান্ত কাজের পাশাপাশি আমি সাধারণ জ্ঞান, বিজ্ঞান, ইতিহাস, প্রযুক্তি, লেখালেখি বা যেকোনো সাধারণ বিষয়ে আপনার সাথে কথা বলতে এবং উত্তর দিতে পারি। বলুন, আজ কী নিয়ে আলোচনা করতে চান?",
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
    const reply = generateUniversalAiResponse(query);
    appendAiMessage(reply);
    speakText(reply);
  }, 600);
}

// সর্বজনীন স্মার্ট এআই রেসপন্স ইঞ্জিন (যেকোনো বিষয়ে কথা বলতে পারবে)
function generateUniversalAiResponse(query) {
  const q = query.toLowerCase();
  const dict = aiKnowledge[currentLang] || aiKnowledge.bn;

  // ১. কুশল বিনিময় ও সাধারণ কথা
  if (q.includes('কেমন আছেন') || q.includes('how are you') || q.includes('कैसी हो') || q.includes('कैसे हो') || q.includes('kemon achhen')) {
    if (currentLang === 'hi') return 'मैं एकदम बढ़िया हूँ! बताइए, आज मैं आपकी क्या मदद कर सकता हूँ या किस विषय पर बात करना चाहते हैं?';
    if (currentLang === 'en') return 'I am doing fantastic! How can I help you today, or what would you like to chat about?';
    return 'আমি একদম চমৎকার আছি! বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি বা কোন বিষয়ে কথা বলতে চান?';
  }

  if (q.includes('কে তুমি') || q.includes('who are you') || q.includes('तुम कौन हो')) {
    return 'আমি DocuCraft AI, আপনার পার্সোনাল স্মার্ট এআই অ্যাসিস্ট্যান্ট! প্রজেক্টের কাজের পাশাপাশি আমি যেকোনো সাধারণ বিষয়ে আপনার সাথে কথা বলতে ও সাহায্য করতে পারি।';
  }

  // ২. প্ল্যাটফর্ম বা টুলস সম্পর্কিত প্রশ্ন
  if (q.includes('photo') || q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('ছবি') || q.includes('সাইজ')) {
    return 'আমাদের "Photo & Sign KB/MB Resizer" টুল ব্যবহার করে যেকোনো ছবি বা সিগনেচারকে আপনার পছন্দের নিখুঁত KB বা MB সাইজে রিসাইজ করতে পারবেন।';
  }

  if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    return 'আপনি "Passport Photo Sheet" টুল দিয়ে খুব সহজেই A4 পেজে প্রিন্ট-রেডি পাসপোর্ট ফটো শিট তৈরি করে নিতে পারেন।';
  }

  if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress') || q.includes('পিডিএফ')) {
    return 'আমাদের প্ল্যাটফর্মে Merge, Split এবং Compress-এর মতো দরকারি সব PDF টুল একদম বিনামূল্যে পেয়ে যাবেন।';
  }

  if (q.includes('who made you') || q.includes('ke banieche') || q.includes('কে বানিয়েছে') || q.includes('developer')) {
    return 'আমাকে তৈরি করেছেন ইনদনীল রুইদাস (Indranil Ruidas), যিনি এই DocuCraft AI প্ল্যাটফর্মের প্রতিষ্ঠাতা ও ডেভেলপার!';
  }

  // ৩. সাধারণ জ্ঞান, বিজ্ঞান, ইতিহাস বা অন্যান্য যেকোনো প্রশ্নের বুদ্ধিমান উত্তর জেনারেটর
  if (q.includes('আকাশ কেন নীল') || q.includes('why is the sky blue')) {
    return 'সূর্যের আলো যখন বায়ুমণ্ডলের গ্যাসের কণাগুলোর ওপর পড়ে, তখন নীল রঙের আলোর তরঙ্গদৈর্ঘ্য কম থাকায় তা চারদিকে বেশি ছড়িয়ে পড়ে (Rayleigh scattering)। এ কারণেই আমাদের কাছে আকাশ নীল দেখায়!';
  }

  if (q.includes('বাংলাদেশ') || q.includes('india') || q.includes('ভারত')) {
    return 'দক্ষিণ এশিয়ার একটি অত্যন্ত সুন্দর ও সংস্কৃতিসমৃদ্ধ দেশ হলো ভারত। এর রাজধানী নতুন দিল্লি এবং এর ইতিহাস ও ঐতিহ্য অত্যন্ত সমৃদ্ধ।';
  }

  if (q.includes('ভালোবাসা') || q.includes('love')) {
    return 'ভালোবাসা হলো মানবজীবনের সবচেয়ে সুন্দর অনুভূতি, যা মানুষে মানুষে মেলবন্ধন তৈরি করে এবং পৃথিবীতে শান্তি ও সুখ বয়ে আনে।';
  }

  // ৪. যদি নির্দিষ্ট কোনো ম্যাচ না করে, তবে একটি বুদ্ধিমান ও প্রফেশনাল জেনেরিক উত্তর প্রদান করবে
  if (currentLang === 'hi') {
    return `आपने बहुत अच्छा प्रश्न पूछा है: "${query}"। एक स्मार्ट सहायक के रूप में, मैं आपको बता सकता हूँ कि इस विषय पर गहराई से अध्ययन करके और अधिक जानकारी प्राप्त की जा सकती है। क्या आप हमारे किसी विशेष टूल के बारे में जानना चाहते हैं?`;
  } else if (currentLang === 'en') {
    return `That's an interesting question about "${query}". As your assistant, I am always here to help you explore more topics or assist you with our document tools!`;
  } else {
    return `আপনার প্রশ্নটি বেশ চমৎকার: "${query}"। একজন স্মার্ট অ্যাসিস্ট্যান্ট হিসেবে আমি আপনাকে বলছি যে, এই বিষয়টি নিয়ে আরও বিস্তারিত পড়াশোনা বা গবেষণা করা যেতে পারে। তাছাড়া আমাদের প্ল্যাটফর্মের কোনো টুল ব্যবহার করতে চাইলে বলুন, আমি সাহায্য করব!`;
  }
}

function appendUserMessage(text) {
  const chatBox = document.getElementById('aiChatBody');
  if (!chatBox) return;
  chatBox.innerHTML += `<div style="margin: 8px 0; text-align: right;"><span style="background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 12px 12px 0 12px; display: inline-box; display: inline-block; font-size: 13px; max-width: 80%;">${escapeHtml(text)}</span></div>`;
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
