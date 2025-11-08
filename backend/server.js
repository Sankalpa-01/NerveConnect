require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connect } = require("./lib/mongoClient");
const {
  generatePrescription,
  storeAnalysis,
} = require("./controllers/aiAnalysis");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS to allow the Vite frontend and include credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("NerveConnect Backend is running"));

app.post("/api/ai_analysis", generatePrescription);

// store AI analysis for appointment (protected)
const authMiddleware = require("./middleware/authMiddleware");
app.post("/api/appointments/ai_analysis", authMiddleware, storeAnalysis);

// auth
app.use("/api/auth", authRoutes);

// patients
app.use("/api/patients", patientRoutes);

// appointments
app.use("/api/appointments", appointmentRoutes);

// Debug endpoint to inspect DB (only enabled in non-production or when explicitly allowed)
if (
  process.env.ENABLE_DB_STATUS === "true" ||
  process.env.NODE_ENV !== "production"
) {
  const { getDb } = require("./lib/mongoClient");
  app.get("/internal/db-status", async (req, res) => {
    try {
      const db = await getDb();
      const collections = await db.listCollections().toArray();
      const result = {};
      for (const c of collections) {
        const count = await db.collection(c.name).countDocuments();
        result[c.name] = count;
      }
      return res.json({ ok: true, collections: result });
    } catch (err) {
      console.error("DB status error:", err);
      return res.status(500).json({
        error: "Failed to fetch DB status",
        details: err?.message || err,
      });
    }
  });
}
// start server after connecting to DB
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
