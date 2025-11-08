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
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "text/plain", 
      },
    };

    let gres;
    try {
      gres = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(
        "Gemini API request failed:",
        err?.response?.status,
        JSON.stringify(err?.response?.data, null, 2) || err?.message
      );

      return res.status(502).json({
        error: "Failed to call Gemini API",
        details: err?.response?.data?.error || err?.message,
      });
    }

    const textResponse = gres.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const prescription =
      textResponse || "Prescription generation failed or returned empty.";

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
