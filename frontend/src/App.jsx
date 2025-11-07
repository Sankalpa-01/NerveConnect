import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Frontdesk from "./components/Frontdesk";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Demo from "./components/Demo";

// Import your global CSS file
import "./index.css"; // Make sure your tailwind/globals.css content is in here

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/frontdesk" element={<Frontdesk />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/demo" element={<Demo />} />
        
        {/* You can add a 404 page here */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
