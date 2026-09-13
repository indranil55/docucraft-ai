// DocuCraft AI Smart Assistant - AI Chat & Voice Assistant Script

document.addEventListener('DOMContentLoaded', () => {
  initAiChat();
});

let isVoiceActive = true;

function initAiChat() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendUserMessage();
      }
    });
  }
}

function openSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    const input = document.getElementById('chatInput');
    if (input) input.focus();
  }
}

function closeSmartAiChat() {
  const modal = document.getElementById('smartAiChatModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}

function changeChatLanguage(lang) {
  const welcomeMsg = document.getElementById('welcomeMsg');
  if (!welcomeMsg) return;

  if (lang === 'bn') {
    welcomeMsg.innerText = "হ্যালো! আমি আপনার DocuCraft AI সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি? আপনি যেকোনো টুল বা ফরম্যাটিং সম্পর্কে বাংলা, হিন্দি বা ইংরেজিতে জিজ্ঞেস করতে পারেন।";
  } else if (lang === 'hi') {
    welcomeMsg.innerText = "नमस्ते! मैं आपका DocuCraft AI सहायक हूँ। आज मैं आपकी किस प्रकार सहायता कर सकता हूँ?";
  } else {
    welcomeMsg.innerText = "Hello! I am your DocuCraft AI Assistant. How can I help you today? You can ask me about any tool or formatting in Bengali, Hindi, or English.";
  }
}

function toggleVoiceOutput() {
  isVoiceActive = !isVoiceActive;
  const btn = document.getElementById('voiceMuteToggle');
  if (btn) {
    if (isVoiceActive) {
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Voice ON';
      btn.style.background = '#1e293b';
      btn.style.color = '#60a5fa';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Voice OFF';
      btn.style.background = '#64748b';
      btn.style.color = '#ffffff';
    }
  }
}

function sendQuickQuery(queryText) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = queryText;
    sendUserMessage();
  }
}

function sendUserMessage() {
  const input = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  if (!input || !messagesContainer) return;

  const text = input.value.trim();
  if (!text) return;

  // ইউজারের মেসেজ চ্যাটবক্সে যোগ করা
  const userDiv = document.createElement('div');
  userDiv.className = 'msg user';
  userDiv.innerText = text;
  messagesContainer.appendChild(userDiv);

  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // এআই রেসপন্স জেনারেট করা
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'msg bot';
    botDiv.innerText = getAiBotResponse(text);
    messagesContainer.appendChild(botDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (isVoiceActive && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(botDiv.innerText);
      window.speechSynthesis.speak(utterance);
    }
  }, 600);
}

function getAiBotResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('kb') || q.includes('resize') || q.includes('photo')) {
    return "To resize a photo or signature to exact KB, open the 'Photo & Sign KB / MB Resizer' tool from the grid, upload your image, enter your target KB size, and click process to download!";
  } else if (q.includes('passport') || q.includes('grid')) {
    return "Use the 'Passport Photo Sheet' tool. Upload your photo, select the number of copies (e.g., 8 or 16), and generate a print-ready A4 sheet instantly.";
  } else if (q.includes('compress') || q.includes('pdf size')) {
    return "To reduce your PDF size, select the 'Compress PDF' tool, upload your heavy PDF file, and click process to get an optimized lightweight file.";
  } else if (q.includes('signature') || q.includes('sign')) {
    return "You can use the 'Digital Signature Maker' tool to draw your signature directly on screen and download it as a clean transparent PNG image.";
  } else {
    return "DocuCraft AI is ready to help! You can use any of our 30+ tools for PDFs, image resizing, and document generation directly from the home grid.";
  }
}
