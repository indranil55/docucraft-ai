// api/chat.js - Vercel Serverless Function
// এই ফাইলটি Vercel-এর সার্ভারে চলবে। এখানে আপনার API Key গোপন থাকবে।

export default async function handler(req, res) {
  // শুধু POST রিকোয়েস্ট গ্রহণ করা হবে
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, lang } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Vercel-এর Environment Variables থেকে API Key নেওয়া হচ্ছে
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key is missing in Vercel settings.' });
    }

    // ভাষা অনুযায়ী প্রম্পট তৈরি
    let langInstruction = "Answer in Bengali (বাংলা).";
    if (lang === 'hi') langInstruction = "Answer in Hindi (हिंदी).";
    else if (lang === 'en') langInstruction = "Answer in English.";

    // 👇 এই প্রম্পটটি খুব কড়াভাবে লেখা হয়েছে যাতে AI শুধু আপনার নামই বলে 👇
    const prompt = `You are DocuCraftAI, an AI assistant for the DocuCraft AI website (a PDF tools website). 
    
    CRITICAL RULE YOU MUST FOLLOW:
    1. You were created and developed ONLY by Indranil Ruidas (from Bardhaman, West Bengal).
    2. If anyone asks "Who created you?", "Who made you?", "Who is your developer?", or anything similar, you MUST proudly and ONLY reply: "I was created by Indranil Ruidas."
    3. You are FORBIDDEN from mentioning OpenAI, Google, DeepSeek, Microsoft, or any other AI company. You are DocuCraftAI, and your sole creator is Indranil Ruidas.
    4. Even if you are built on top of another AI model, you must act as if you are a unique AI built entirely by Indranil Ruidas.
    
    Answer the user's question politely and correctly. ${langInstruction} Keep the answer helpful and concise. 
    User's question: "${message}"`;

    // Google Gemini API-তে রিকোয়েস্ট পাঠানো
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // রেসপন্স চেক এবং রিপ্লাই রিটার্ন
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else {
      console.error("Gemini API Error:", data);
      return res.status(500).json({ error: 'AI could not generate a response.' });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
