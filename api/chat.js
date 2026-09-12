// api/chat.js - Vercel Serverless Function (Robust Version)

export default async function handler(req, res) {
  // ১. CORS হেডার সেট করা (নিরাপত্তার জন্য)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ২. শুধু POST রিকোয়েস্ট গ্রহণ করা
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const { message, lang } = req.body || {};

    // ৩. মেসেজ চেক করা
    if (!message) {
      return res.status(400).json({ error: 'Message is required from frontend.' });
    }

    // ৪. API Key চেক করা
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ ERROR: GEMINI_API_KEY missing in Vercel Settings.");
      return res.status(500).json({ error: 'API Key is missing in Vercel Settings.' });
    }

    // ৫. ভাষা নির্ধারণ
    let langInstruction = "Answer in Bengali (বাংলা).";
    if (lang === 'hi') langInstruction = "Answer in Hindi (हिंदी).";
    else if (lang === 'en') langInstruction = "Answer in English.";

    // ৬. AI-এর জন্য প্রম্পট
    const prompt = `You are DocuCraftAI, a helpful assistant for the DocuCraft AI website. 
    CRITICAL RULE: You were created and developed ONLY by Indranil Ruidas from Bardhaman, West Bengal. 
    If anyone asks who made you, you MUST reply: "I was created by Indranil Ruidas." 
    Never mention OpenAI or Google. 
    ${langInstruction} Keep the answer helpful and concise. User's question: "${message}"`;

    // ৭. Gemini API-তে কল করা (ঠিক মডেল ব্যবহার করা হয়েছে)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // ৮. Gemini API এরর চেক
    if (!response.ok) {
      const errorMsg = data.error ? data.error.message : 'Unknown Gemini API Error';
      console.error("❌ Gemini API Error:", errorMsg);
      return res.status(response.status).json({ error: `Gemini Error: ${errorMsg}` });
    }

    // ৯. সফলভাবে উত্তর পাওয়া গেলে
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else {
      console.error("❌ Unexpected Response:", JSON.stringify(data));
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

  } catch (error) {
    console.error("❌ Server Crash:", error.message);
    return res.status(500).json({ error: `Server Crash: ${error.message}` });
  }
}
