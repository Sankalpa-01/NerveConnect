const axios = require('axios')

async function extractAppointmentDetailsFromTranscript(transcript) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Extract patient name, doctor name, and appointment date and time from this sentence: "${transcript}". Return in this JSON format:\n{\n  "patientName": "John Doe",\n  "doctorName": "Dr. Smith",\n  "datetime": "2025-06-20T15:30:00Z"\n}`,
          },
        ],
      },
    ],
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
  const res = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })

  const textResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  try {
    return JSON.parse(textResponse)
  } catch (e) {
    // fallback: return raw text
    return { raw: textResponse }
  }
}

module.exports = { extractAppointmentDetailsFromTranscript }
