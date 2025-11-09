# 🩺 NerveConnect - AI-Powered Clinic Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

---

**NerveConnect** is an intelligent, full-stack hospital management platform.  
It combines an **AI Voice Frontdesk** for seamless, voice-driven appointment booking and a **Doctor Dashboard** powered by **Google Gemini AI** for smart prescription generation.

---

## 🚀 Live Demo

- **Frontend (Vercel):** [https://nerve-connect-frontend.vercel.app](https://nerve-connect-frontend.vercel.app)  
- **Backend (Render):** [https://nerveconnect-backend.onrender.com](https://nerveconnect-backend.onrender.com)

---

## ✨ Features

### 🎤 AI Voice Frontdesk (`/frontdesk`)
- **Voice-Enabled Appointments:** Uses the Web Speech API to capture and transcribe user voice input.  
- **AI Transcript Parsing:** Sends transcripts to the backend (`/api/auth/parse`) to interpret intent and schedule appointments, mimicking a human receptionist.

### 🧑‍⚕️ Doctor Dashboard (`/dashboard`)
- **Full Patient & Appointment CRUD:** Securely manage patient records and clinic appointments.  
- **AI-Powered Prescription Generation:** Uses the Google Gemini API to create prescription drafts based on symptoms and vitals.  
- **Doctor-in-the-Loop (DITL):** Review, edit, and approve AI-generated content before saving.  
- **Light/Dark Mode:** Built-in toggle for comfort and accessibility.

### 🔐 Secure Authentication
- **Full Auth Flow:** Sign-Up, Sign-In, and Sign-Out support.  
- **JWT Session Handling:** Stateless authentication using `jsonwebtoken`.  
- **Secure Cookie Storage:** Uses `httpOnly` cookies to prevent XSS attacks.  
- **Password Hashing:** Implements `bcryptjs` for hashing and salting.  
- **Protected Routes:** Middleware-secured endpoints for sensitive operations.

---

## 🧱 System Architecture

The project follows a **decoupled monorepo** architecture — separate frontend and backend layers communicating via REST APIs.

```mermaid
graph TD
    User[👤 User] --> FE(⚛️ React Frontend on Vercel);
    FE --> BE(⚙️ Node/Express Backend on Render);
    FE --> VAPI(🗣️ Web Speech API);
    
    subgraph Backend
        BE --> Auth(🔐 Auth Middleware);
        Auth --> Patients(👩‍⚕️ Patient Routes);
        Auth --> Appts(🗓️ Appointment Routes);
        BE --> Gemini(🤖 Google Gemini API);
        Patients --> DB[(💾 MongoDB Atlas)];
        Appts --> DB[(💾 MongoDB Atlas)];
    end

    style FE fill:#282c34,stroke:#61DAFB,stroke-width:2px,color:#fff;
    style BE fill:#333,stroke:#3C873A,stroke-width:2px,color:#fff;
    style DB fill:#47A248,stroke:#fff,stroke-width:2px,color:#fff;
    style Gemini fill:#4285F4,stroke:#fff,stroke-width:2px,color:#fff;
    style VAPI fill:#f44336,stroke:#fff,stroke-width:2px,color:#fff;
