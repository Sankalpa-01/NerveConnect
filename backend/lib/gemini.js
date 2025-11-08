// const axios = require('axios')

// async function extractAppointmentDetailsFromTranscript(transcript) {
//   const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY
//   if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

//   const payload = {
//     contents: [
//       {
//         role: 'user',
//         parts: [
//           {
//             text: `Extract patient name, doctor name, and appointment date and time from this sentence: "${transcript}". Return in this JSON format:\n{\n  "patientName": "John Doe",\n  "doctorName": "Dr. Smith",\n  "datetime": "2025-06-20T15:30:00Z"\n}`,
//           },
//         ],
//       },
//     ],
//   }

//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
//   const res = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })

//   const textResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
//   try {
//     return JSON.parse(textResponse)
//   } catch (e) {
//     // fallback: return raw text
//     return { raw: textResponse }
//   }
// }

// module.exports = { extractAppointmentDetailsFromTranscript }

const axios = require("axios");

async function extractAppointmentDetailsFromTranscript(transcript) {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const prompt = `Extract patient name, doctor name, and appointment date and time from this sentence: "${transcript}". Return in this JSON format:
{
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "datetime": "2025-06-20T15:30:00Z"
}
**Ensure the output is ONLY the JSON object, with no other text or markdown.**`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    // ADD THIS CONFIGURATION
    generationConfig: {
      responseMimeType: "application/json", // This forces JSON output
      temperature: 0, // Makes the output more deterministic
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const res = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // The response will be a guaranteed JSON string, but might be wrapped in markdown.
    // Let's clean it just in case.
    let textResponse =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean up potential markdown blocks
    textResponse = textResponse.replace(/^```json\n/, "").replace(/\n```$/, "");

    // Now, parsing is much safer
    return JSON.parse(textResponse);
  } catch (err) {
    console.error(
      "Gemini JSON extraction failed:",
      err.response ? err.response.data : err.message
    );
    // If the API call itself fails, throw an error
    throw new Error("Failed to extract appointment details from transcript.");
  }
}

module.exports = { extractAppointmentDetailsFromTranscript };
