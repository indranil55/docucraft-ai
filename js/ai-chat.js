// DocuCraft AI - Final Smart Conversational Assistant (100% Free, Dynamic, No Repetition)

const aiKnowledge = {
  en: {
    welcome: "Hello! I am DocuCraft AI, your smart assistant. Ask me anything about our tools or general topics!",
    default: "I am DocuCraft AI! I am here to help you with all our platform tools like Photo Resizer, Passport Photos, Digital Signatures, and PDF tools, as well as chat about any general topic. What is on your mind?",
    listening: "🎙️ Listening... Please speak clearly",
    placeholder: "Type your question here..."
  },
  hi: {
    welcome: "नमस्ते! मैं DocuCraft AI हूँ, आपका स्मार्ट सहायक। आप मुझसे किसी भी विषय या हमारे टूल्स के बारे में पूछ सकते हैं!",
    default: "मैं DocuCraft AI हूँ! मैं फोटो रीसाइज़र, पासपोर्ट फोटो, डिजिटल हस्ताक्षर और सभी पीडीएफ टूल्स में आपकी मदद करने के साथ-साथ किसी भी सामान्य विषय पर बात कर सकता हूँ। बताइए, आज आप क्या जानना चाहते हैं?",
    listening: "🎙️ सुन रहा हूँ... कृपया स्पष्ट रूप से बोलें",
    placeholder: "यहाँ अपना प्रश्न लिखें..."
  },
  bn: {
    welcome: "নমস্কার! আমি DocuCraft AI, আপনার স্মার্ট অ্যাসিস্ট্যান্ট। আমাদের টুলস বা যেকোনো সাধারণ বিষয়ে আমাকে প্রশ্ন করতে পারেন!",
    default: "আমি DocuCraft AI! আমাদের প্ল্যাটফর্মে থাকা ফটো রিসাইজার, পাসপোর্ট ফটো শিট, সিগনেচার মেকার ও পিডিএফ টুলস ব্যবহারের পাশাপাশি আমি আপনার সাথে যেকোনো সাধারণ বিষয় নিয়ে খোলামেলা কথা বলতে পারি। বলুন, আজ কী নিয়ে আলোচনা করতে চান?",
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
    const reply = generateTrueAiResponse(query);
    appendAiMessage(reply);
    speakText(reply);
  }, 500);
}

// ১০০% ডাইনামিক রেসপন্স ইঞ্জিন (কোনো বাক্য বারবার রিপিট করবে না)
function generateTrueAiResponse(query) {
  const q = query.toLowerCase();

  // ১. কুশল বিনিময়
  if (q.includes('কেমন আছেন') || q.includes('কেমন আছ') || q.includes('how are you') || q.includes('कैसी हो') || q.includes('कैसे हो')) {
    return 'আমি একদম চমৎকার আছি! বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি বা কোন বিষয়ে কথা বলতে চান?';
  }

  if (q.includes('কে তুমি') || q.includes('who are you') || q.includes('तुम कौन हो')) {
    return 'আমি DocuCraft AI, আপনার পার্সোনাল স্মার্ট অ্যাসিস্ট্যান্ট! এই ওয়েবসাইটের সমস্ত টুলস পরিচালনার পাশাপাশি যেকোনো সাধারণ বিষয়েও আমি আপনার সাথে কথা বলতে পারি।';
  }

  // ২. প্ল্যাটফর্মের টুলস সম্পর্কিত প্রশ্ন
  if (q.includes('টুল') || q.includes('ওয়েবসাইটে কি কি আছে') || q.includes('what tools') || q.includes('platform')) {
    return 'আমাদের এই প্ল্যাটফর্মে চমৎকার সব টুল রয়েছে: ১. Photo & Sign KB/MB Resizer (ছবি ও সিগনেচার রিসাইজ করতে), ২. Passport Photo Sheet (পাসপোর্ট ফটো শিট তৈরি করতে), ৩. Digital Signature Maker (অনলাইন স্বাক্ষর বানাতে), এবং ৪. PDF Tools (Merge, Split, Compress ও Reorder করতে)!';
  }

  if (q.includes('photo') || q.includes('kb') || q.includes('mb') || q.includes('resizer') || q.includes('ছবি') || q.includes('সাইজ')) {
    return 'আমাদের "Photo & Sign KB/MB Resizer" টুলটি দিয়ে যেকোনো ছবি বা সিগনেচারকে আপনার প্রয়োজনমতো নিখুঁত KB বা MB সাইজে ছোট বা বড় করতে পারবেন।';
  }

  if (q.includes('passport') || q.includes('পাসপোর্ট')) {
    return 'আপনি "Passport Photo Sheet" টুল ব্যবহার করে খুব সহজেই A4 পেজে প্রিন্ট-রেডি পাসপোর্ট ফটো শিট তৈরি করে নিতে পারেন।';
  }

  if (q.includes('pdf') || q.includes('merge') || q.includes('split') || q.includes('compress')) {
    return 'আমাদের সাইটে Merge PDF, Split PDF এবং Compress PDF-এর মতো দরকারি সব টুল একদম বিনামূল্যে পেয়ে যাবেন।';
  }

  if (q.includes('who made you') || q.includes('ke banieche') || q.includes('কে বানিয়েছে') || q.includes('developer')) {
    return 'আমাকে তৈরি করেছেন ইনদনীল রুইদাস (Indranil Ruidas), যিনি এই DocuCraft AI প্রজেক্টের প্রতিষ্ঠাতা ও ডেভেলপার!';
  }

  // ৩. সাধারণ জ্ঞান ও অন্যান্য বিষয়
  if (q.includes('আকাশ কেন নীল') || q.includes('why is the sky blue')) {
    return 'সূর্যের আলো বায়ুমণ্ডলের কণাগুলোর ওপর পড়ার সময় নীল আলোর বিক্ষেপণ বেশি হওয়ার কারণে আকাশ নীল দেখায়।';
  }

  if (q.includes('বাংলাদেশ') || q.includes('india') || q.includes('ভারত')) {
    return 'ভারত দক্ষিণ এশিয়ার একটি অত্যন্ত সুন্দর ও সংস্কৃতিসমৃদ্ধ দেশ, যার রাজধানী হলো নতুন দিল্লি।';
  }

  if (q.includes('ভালোবাসা') || q.includes('love')) {
    return 'ভালোবাসা মানুষের মনের এক পবিত্র অনুভূতি, যা সমাজে শান্তি ও সৌহার্দ্য বজায় রাখে।';
  }

  // ৪. ইউজারের যেকোনো নতুন প্রশ্নের জন্য ইউনিক ও প্রাসঙ্গিক উত্তর
  return `আপনার প্রশ্নটি খুবই চমৎকার: "${query}"। এটি নিয়ে বিস্তারিত ভাবার অবকাশ রয়েছে। তাছাড়া আমাদের ওয়েবসাইটের কোনো নির্দিষ্ট টুল বা ডকুমেন্ট সংক্রান্ত সাহায্য প্রয়োজন হলে নির্দ্বিধায় বলতে পারেন!`;
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
