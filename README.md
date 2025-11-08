# 🩺 NerveConnect - AI-Powered Clinic Management System

NerveConnect is an intelligent, full-stack hospital management platform. It combines an AI Voice Frontdesk for seamless appointment booking and a Doctor Dashboard powered by the Gemini AI for smart prescription generation.

## 🚀 Features

### 🧑‍⚕️ Doctor Dashboard
Patient & Appointment Management (Full CRUD) for securely managing clinic data.
AI-Powered Suggestions using the Google Gemini API to generate prescriptions based on symptoms and vitals.
Doctor-in-the-Loop (DITL) interface allowing doctors to review, edit, and approve AI suggestions before saving them to the patient's record.
Light/Dark Mode for user comfort.

### 🔐 Secure Authentication
Full Auth Flow including sign-up, sign-in, and sign-out.
JWT-based Session Handling stored securely in httpOnly cookies.
Password Protection using bcrypt for hashing.
Protected Routes via Express middleware to secure patient and dashboard data.

## 🧱 Tech Stack
🎨 Frontend
React 18, Vite, React Router, TailwindCSS, Lucide Icons, Web Speech API

⚙️ Backend
Node.js, Express, MongoDB Atlas, jsonwebtoken, bcryptjs, cookie-parser, cors

🤖 AI
Google Gemini API (via generativelanguage.googleapis.com)

🗃️ Database
MongoDB

## 🚀 Deployment
-- Vercel (Frontend) - https://nerve-connect-frontend.vercel.app
-- Render (Backend) - https://nerveconnect-backend.onrender.com

## 📂 Folder Structure
This project uses a monorepo structure with two main folders: frontend and backend.

NerveConnect_React/
├── backend/
│   ├── controllers/
│   │   ├── aiAnalysis.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   └── patients.js
│   ├── lib/
│   │   ├── gemini.js
│   │   └── mongoClient.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   └── patientRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── SignIn.jsx
    │   │   └── SignUp.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js


## ⚙️ Setup & Development

Follow these steps to get the project running locally.

### 1. Clone the Repository
git clone [https://github.com/your-username/NerveConnect_React.git](https://github.com/your-username/NerveConnect_React.git)
cd NerveConnect_React

### 2. Set Up the Backend
First, cd into the backend folder to set up the server.

#### 1. Navigate to the backend folder
cd backend

#### 2. Install dependencies
npm install

#### 3. Create your environment file (This is the most important step!)
1. .env (Backend)
Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:5173

2. MongoDB Connection
Get this from your MongoDB Atlas dashboard
MONGODB_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/yourDatabaseName

3. Auth Secret
Use any long, random string
JWT_SECRET=THIS_IS_A_VERY_STRONG_AND_RANDOM_SECRET_KEY

4. Google Gemini API Key
Get this from Google AI Studio
GEMINI_API_KEY=.....

5. Run the backend server:
npm start

Your backend should now be running on http://localhost:4000.

### 3. Set Up the Frontend
Open a new terminal window and navigate to the frontend directory.

#### 1. Navigate to the frontend folder
cd frontend

#### 2. Install dependencies
npm install

#### 3. Run the frontend development server
npm run dev

### Your frontend app will now be running on http://localhost:5173.

## 🧪 Testing the App
Visit these routes in your browser to test the application:
http://localhost:5173/signup - to create an account, 
http://localhost:5173/signin - to log in,  
http://localhost:5173/dashboard - for the doctor’s AI-powered prescription tool, 

## 📌 Todo / Improvements
✅ Add doctor availability calendar ⏳ Notifications (email/text)

📃 License MIT License © 2025 Rishabh Anand
📃 License

This project is licensed under the MIT License.
