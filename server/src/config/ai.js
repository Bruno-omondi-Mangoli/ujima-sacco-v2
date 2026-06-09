import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const extractJSON = (text) => {
  try { return JSON.parse(text) } catch {}
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in AI response')
  return JSON.parse(match[0])
}

export const askAI = async (prompt, maxTokens = 1500) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an AI agent for Ujima SACCO Kenya. Always respond with valid JSON only. No markdown. No explanation. Just the JSON object.'
      },
      { role: 'user', content: prompt }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: maxTokens,
  })
  const text = completion.choices[0]?.message?.content || ''
  return extractJSON(text)
}
