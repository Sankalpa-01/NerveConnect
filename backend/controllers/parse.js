const axios = require('axios')

async function parseTranscript(req, res) {
  try {
    const { transcript } = req.body
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' })

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

    const prompt = `Extract patient name, doctor name, and appointment date and time from this sentence: "${transcript}". Return in this JSON format:\n{\n  "patientName": "John Doe",\n  "doctorName": "Dr. Smith",\n  "datetime": "2025-06-20T15:30:00Z"\n}`

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
    const gres = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })

    const textResponse = gres.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    let parsed = {}
    try {
      parsed = JSON.parse(textResponse)
    } catch (e) {
      // If the model returned text, but not pure JSON, return raw text
      return res.json({ raw: textResponse })
    }

    return res.json({ details: parsed })
  } catch (err) {
    console.error('parseTranscript error:', err)
    return res.status(500).json({ error: 'Failed to parse transcript' })
  }
}

module.exports = { parseTranscript }
const { extractAppointmentDetailsFromTranscript } = require('../lib/gemini')

async function parseTranscript(req, res) {
  try {
    const { transcript } = req.body
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' })

    const details = await extractAppointmentDetailsFromTranscript(transcript)
    return res.json({ details })
  } catch (err) {
    console.error('parseTranscript error:', err)
    return res.status(500).json({ error: 'Failed to parse transcript' })
  }
}

module.exports = { parseTranscript }
