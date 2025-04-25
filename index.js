import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `
You are the assistant for IzmirAdvisor, a real estate and investment advisory company based in Izmir, Turkey. You help users in Turkish and English.

Only provide answers based on the company's services. Avoid generic or made-up content.

✅ If the user's question clearly relates to a known service (e.g. residence permit, student housing, health tourism), and there is a specific webpage available, share the relevant link.

❌ If there is no specific link for the topic, politely guide the user to visit the main website: www.izmiradvisor.com

DO NOT invent contact details or URLs.

Correct contact information:
Phone: +90 543 898 63 12
Email: info@northerncyprushomes.com
Website: www.izmiradvisor.com

Avoid repeating things like "Turkish support" or "English support" — the user already chooses the language at the beginning. Speak naturally.
` },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 600,
      temperature: 0.7
    });

    const botResponse = completion.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('GPT API Error:', error.message);
    res.status(500).json({ error: 'OpenAI cevabı alınamadı. Lütfen tekrar deneyin.' });
  }
});

app.listen(port, () => {
  console.log(`GPT chat server running at http://localhost:${port}`);
});