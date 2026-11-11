/* =========================================================
   DocuCraft AI - Universal Smart Voice Assistant
   ========================================================= */

let availableVoices = [];
let isVoiceOutputEnabled = true;
let globalRecognition = null;
let isListening = false;

function loadSystemVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadSystemVoices;
  loadSystemVoices();
}

function speakVoiceResponse(text, lang = 'en-US') {
  if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang;

    if (availableVoices.length > 0) {
      const matched = availableVoices.find(v => 
        v.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))
      );
      if (matched) utterance.voice = matched;
    }
    window.speechSynthesis.speak(utterance);
  }, 50);
}

function clickElementIfExists(selectors) {
  for (const s of selectors) {
    const el = document.querySelector(s);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.click();
      return true;
    }
  }
  return false;
}

function openSiteToolDirectly(toolQuery) {
  const q = toolQuery.toLowerCase().trim();

  // Creator check
  if (
    q.includes('who made you') || 
    q.includes('who created you') || 
    q.includes('who is your developer') || 
    q.includes('developer') || 
    q.includes('creator') || 
    q.includes('tomake ke baniyeche') || 
    q.includes('কে বানিয়েছে') || 
    q.includes('তোমাকে কে তৈরি করেছে')
  ) {
    speakVoiceResponse("I was created and developed by Indranil Ruidas as the smart voice assistant for DocuCraft AI.");
    return true;
  }

  // Modals
  if (q.includes('calculator') || q.includes('scientific')) {
    if (typeof openCalculatorModal === 'function') openCalculatorModal();
    else clickElementIfExists(['#calculatorModalBtn', '[data-tool="calculator"]', '#calculator-tool']);
    speakVoiceResponse("Opening Scientific Calculator for you.");
    return true;
  }

  if (q.includes('translator') || q.includes('translate')) {
    if (typeof openTranslatorModal === 'function') openTranslatorModal();
    else clickElementIfExists(['#translatorModalBtn', '[data-tool="translator"]', '#translator-tool']);
    speakVoiceResponse("Opening DocuCraft Translator.");
    return true;
  }

  if (q.includes('qr') || q.includes('upi')) {
    if (typeof openQrModal === 'function') openQrModal();
    else clickElementIfExists(['#qrModalBtn', '[data-tool="qr-generator"]', '#qr-tool']);
    speakVoiceResponse("Opening QR Code and UPI Generator.");
    return true;
  }

  if (q.includes('bill') || q.includes('electricity') || q.includes('power')) {
    if (typeof openElectricityModal === 'function') openElectricityModal();
    else clickElementIfExists(['#electricityModalBtn', '[data-tool="electricity"]', '#electricity-tool']);
    speakVoiceResponse("Opening Electricity Bill and Power Calculator.");
    return true;
  }

  // Targeted Tool Cards only
  const allCards = document.querySelectorAll('.tool-card, [data-tool]');
  for (let el of allCards) {
    const text = (el.getAttribute('data-tool') || el.innerText || '').toLowerCase().trim();
    if (text.length > 2 && (text.includes(q) || q.includes(text))) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.click();
      speakVoiceResponse(`Opening ${q}.`);
      return true;
    }
  }

  speakVoiceResponse(`Searching for ${toolQuery}.`);
  return false;
}

function toggleVoiceInput(inputElementId, callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
    return;
  }

  const inputField = document.getElementById(inputElementId);

  if (isListening && globalRecognition) {
    globalRecognition.stop();
    isListening = false;
    if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Calculator...)";
    return;
  }

  globalRecognition = new SpeechRecognition();
  globalRecognition.continuous = false;
  globalRecognition.interimResults = false;
  globalRecognition.lang = navigator.language || 'en-US';

  globalRecognition.onstart = function() {
    isListening = true;
    if (inputField) inputField.placeholder = "Listening... Speak now";
  };

  globalRecognition.onresult = function(event) {
    const spokenTranscript = event.results[0][0].transcript;
    if (inputField) inputField.value = spokenTranscript;
    openSiteToolDirectly(spokenTranscript);
    if (typeof callback === 'function') callback(spokenTranscript);
  };

  globalRecognition.onerror = function(event) {
    console.error("Speech Recognition Error:", event.error);
    isListening = false;
    if (inputField) inputField.placeholder = "Search any tool...";
  };

  globalRecognition.onend = function() {
    isListening = false;
    if (inputField) inputField.placeholder = "Search any tool (e.g. Merge PDF, Calculator...)";
  };

  globalRecognition.start();
}
