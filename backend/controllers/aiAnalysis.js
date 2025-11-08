// const axios = require("axios");
// const { getDb } = require("../lib/mongoClient");

// const templateString = `You are a medical assistant generating a short and complete prescription based on the following appointment details.\n\nPatient Case:\n\nSymptoms: {symptoms}\nDiagnosis: {diagnosis}\nInstructions: {instructions}\nVitals:\n- Blood Pressure: {bloodPressure}\n- Heart Rate: {heartRate}\n- Temperature: {temperature}\n- Oxygen Saturation: {oxygenSaturation}\n\nProvide a single concise paragraph that includes:\n- The suggested medicine with dosage and frequency,\n- Duration of medication,\n- Lifestyle and dietary recommendations,\n- Any additional remarks for recovery.\n\nWrite it clearly and professionally as a one-paragraph prescription, written in the first person as if by the physician. Avoid bullet points.`;

// async function generatePrescription(req, res) {
//   try {
//     const appointment = req.body?.appointment || req.body;

//     const inputs = templateString
//       .replace("{symptoms}", appointment.symptoms || "Not provided")
//       .replace("{diagnosis}", appointment.diagnosis || "Not provided")
//       .replace("{instructions}", appointment.instructions || "Not provided")
//       .replace("{bloodPressure}", appointment.bloodPressure || "Not provided")
//       .replace(
//         "{heartRate}",
//         appointment.heartRate?.toString() || "Not provided"
//       )
//       .replace(
//         "{temperature}",
//         appointment.temperature?.toString() || "Not provided"
//       )
//       .replace(
//         "{oxygenSaturation}",
//         appointment.oxygenSaturation?.toString() || "Not provided"
//       );

//     // Call Gemini REST API (Generative Language)
//     const apiKey =
//       process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY;
//     if (!apiKey)
//       return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

//     const payload = {
//       // minimal request matching earlier patterns in the repo
//       // Using v1beta generateContent endpoint
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: inputs }],
//         },
//       ],
//     };

//     // Allow a mock mode for local development/tests
//     if (process.env.USE_MOCK_GEMINI === "true") {
//       const symptoms = appointment.symptoms || "Not provided";
//       const diagnosis = appointment.diagnosis || "Not provided";
//       const prescription = `I recommend Paracetamol 500mg, 1 tablet every 6 hours as needed for pain and fever for 5 days. Continue hydration and rest. Follow up in 3-5 days or sooner if symptoms worsen.`;
//       // Save mock analysis to DB
//       try {
//         const db = await getDb();
//         const col = db.collection("ai_analysis");
//         await col.insertOne({
//           appointment,
//           prescription,
//           createdAt: new Date(),
//           mock: true,
//         });
//       } catch (e) {
//         console.warn(
//           "Failed to save mock AI analysis to MongoDB:",
//           e?.message || e
//         );
//       }
//       return res.json({ prescription });
//     }

//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

//     let gres;
//     try {
//       gres = await axios.post(url, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (err) {
//       console.error(
//         "Gemini API request failed:",
//         err?.response?.status,
//         err?.message
//       );
//       const allowMockFallback =
//         process.env.USE_MOCK_GEMINI === "true" ||
//         process.env.FALLBACK_TO_MOCK_ON_GEMINI_FAIL === "true" ||
//         process.env.NODE_ENV !== "production";
//       if (allowMockFallback) {
//         console.warn("Falling back to mock prescription due to Gemini failure");
//         const symptoms = appointment.symptoms || "Not provided";
//         const diagnosis = appointment.diagnosis || "Not provided";
//         const prescription = `I recommend Paracetamol 500mg, 1 tablet every 6 hours as needed for pain and fever for 5 days. Continue hydration and rest. Follow up in 3-5 days or sooner if symptoms worsen. `;
//         // Save mock analysis to DB
//         try {
//           const db = await getDb();
//           const col = db.collection("ai_analysis");
//           await col.insertOne({
//             appointment,
//             prescription,
//             createdAt: new Date(),
//             mock: true,
//             fallback: true,
//           });
//         } catch (e) {
//           console.warn(
//             "Failed to save mock AI analysis to MongoDB:",
//             e?.message || e
//           );
//         }
//         return res.json({ prescription });
//       }

//       return res.status(502).json({
//         error: "Failed to call Gemini API",
//         details: err?.response?.data || err?.message,
//       });
//     }

//     const textResponse = gres.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     const prescription =
//       textResponse || "Prescription generation failed or returned empty.";

//     // Optionally save to MongoDB for logs
//     try {
//       const db = await getDb();
//       const col = db.collection("ai_analysis");
//       await col.insertOne({ appointment, prescription, createdAt: new Date() });
//     } catch (e) {
//       console.warn("Failed to save AI analysis to MongoDB:", e?.message || e);
//     }

//     return res.json({ prescription });
//   } catch (error) {
//     console.error("AI Prescription Error:", error);
//     return res.status(500).json({ error: "AI prescription failed" });
//   }
// }

// async function storeAnalysis(req, res) {
//   try {
//     const { appointmentId, aiAnalysis } = req.body;

//     if (!appointmentId || !aiAnalysis) {
//       return res
//         .status(400)
//         .json({ error: "Missing appointmentId or aiAnalysis" });
//     }

//     const db = await getDb();
//     const { ObjectId } = require("mongodb");

//     const result = await db
//       .collection("appointments")
//       .findOneAndUpdate(
//         { _id: new ObjectId(appointmentId) },
//         { $set: { aiAnalysis } },
//         { returnDocument: "after" }
//       );

//     if (!result.value)
//       return res.status(404).json({ error: "Appointment not found" });

//     return res.json({
//       message: "AI analysis stored",
//       appointment: result.value,
//     });
//   } catch (err) {
//     console.error("STORE_AI_ANALYSIS_ERROR", err);
//     return res.status(500).json({ error: "Failed to store AI analysis" });
//   }
// }

// module.exports = { generatePrescription, storeAnalysis };

const axios = require("axios");
const { getDb } = require("../lib/mongoClient");

const templateString = `You are a medical assistant generating a short and complete prescription based on the following appointment details.\n\nPatient Case:\n\nSymptoms: {symptoms}\nDiagnosis: {diagnosis}\nInstructions: {instructions}\nVitals:\n- Blood Pressure: {bloodPressure}\n- Heart Rate: {heartRate}\n- Temperature: {temperature}\n- Oxygen Saturation: {oxygenSaturation}\n\nProvide a single concise paragraph that includes:\n- The suggested medicine with dosage and frequency,\n- Duration of medication,\n- Lifestyle and dietary recommendations,\n- Any additional remarks for recovery.\n\nWrite it clearly and professionally as a one-paragraph prescription, written in the first person as if by the physician. Avoid bullet points.`;

async function generatePrescription(req, res) {
  try {
    const appointment = req.body?.appointment || req.body;

    const inputs = templateString
      .replace("{symptoms}", appointment.symptoms || "Not provided")
      .replace("{diagnosis}", appointment.diagnosis || "Not provided")
      .replace("{instructions}", appointment.instructions || "Not provided")
      .replace("{bloodPressure}", appointment.bloodPressure || "Not provided")
      .replace(
        "{heartRate}",
        appointment.heartRate?.toString() || "Not provided"
      )
      .replace(
        "{temperature}",
        appointment.temperature?.toString() || "Not provided"
      )
      .replace(
        "{oxygenSaturation}",
        appointment.oxygenSaturation?.toString() || "Not provided"
      );

    // Call Gemini REST API (Generative Language)
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const modelName = "gemini-pro-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: inputs }],
        },
      ],
      // Add a generationConfig to force a more predictable response
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "text/plain", // Ensure it doesn't send JSON
      },
    };

    let gres;
    try {
      gres = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      // Log the detailed error from Google's API
      console.error(
        "Gemini API request failed:",
        err?.response?.status,
        JSON.stringify(err?.response?.data, null, 2) || err?.message
      );

      // We removed the mock fallback, so we just send the error
      return res.status(502).json({
        error: "Failed to call Gemini API",
        details: err?.response?.data?.error || err?.message,
      });
    }

    const textResponse = gres.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const prescription =
      textResponse || "Prescription generation failed or returned empty.";

    // Optionally save to MongoDB for logs
    try {
      const db = await getDb();
      const col = db.collection("ai_analysis");
      await col.insertOne({ appointment, prescription, createdAt: new Date() });
    } catch (e) {
      console.warn("Failed to save AI analysis to MongoDB:", e?.message || e);
    }

    return res.json({ prescription });
  } catch (error) {
    console.error("AI Prescription Error:", error);
    return res.status(500).json({ error: "AI prescription failed" });
  }
}

async function storeAnalysis(req, res) {
  try {
    const { appointmentId, aiAnalysis } = req.body;

    if (!appointmentId || !aiAnalysis) {
      return res
        .status(400)
        .json({ error: "Missing appointmentId or aiAnalysis" });
    }

    const db = await getDb();
    const { ObjectId } = require("mongodb");

    const result = await db
      .collection("appointments")
      .findOneAndUpdate(
        { _id: new ObjectId(appointmentId) },
        { $set: { aiAnalysis } },
        { returnDocument: "after" }
      );

    if (!result.value)
      return res.status(404).json({ error: "Appointment not found" });

    return res.json({
      message: "AI analysis stored",
      appointment: result.value,
    });
  } catch (err) {
    console.error("STORE_AI_ANALYSIS_ERROR", err);
    return res.status(500).json({ error: "Failed to store AI analysis" });
  }
}

module.exports = { generatePrescription, storeAnalysis };
