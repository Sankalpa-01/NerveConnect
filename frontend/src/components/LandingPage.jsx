import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Brain,
  Clock,
  Shield,
  TrendingUp,
  Users,
  Heart,
  Activity,
  Stethoscope,
  Smartphone,
  PlayCircle,
  Video,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  // State management
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const fullText = "Reimagined";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [animatedValues, setAnimatedValues] = useState({
    providers: 0,
    patients: 0,
    uptime: 0,
    support: 0,
  });

  const navigate = useNavigate();

  // Refs
  const navRef = useRef(null);
  const statsSectionRef = useRef(null);
  const countersRef = useRef(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play(); // start video
    }
  };

  // Animation function
  const animateCounters = () => {
    const targets = {
      providers: 500,
      patients: 25000,
      uptime: 99.9,
      support: 24,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        providers: Math.floor(targets.providers * easeOutProgress),
        patients: Math.floor(targets.patients * easeOutProgress),
        uptime: +(targets.uptime * easeOutProgress).toFixed(1),
        support: Math.floor(targets.support * easeOutProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  };

  // Effects
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Navbar scroll effect
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 100) {
          navRef.current.style.background = "rgba(26, 26, 46, 0.95)";
          navRef.current.style.backdropFilter = "blur(16px) saturate(180%)";
        } else {
          navRef.current.style.background = "rgba(255, 255, 255, 0.1)";
          navRef.current.style.backdropFilter = "blur(16px) saturate(180%)";
        }
      }

      // Section highlighting logic
      const sections = ["home", "features", "about", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for counters
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsSectionRef.current) {
      statsObserver.observe(statsSectionRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      if (statsSectionRef.current) {
        statsObserver.unobserve(statsSectionRef.current);
      }
    };
  }, []);

  // Typing effect (independent)
  useEffect(() => {
    let currentIndex = 0;
    setTypedText(""); // reset before starting

    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(typingInterval);
      }
    }, 200); // slower typing (increase this number to slow down more)

    return () => clearInterval(typingInterval);
  }, [fullText]);

  // Helper functions
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      message: !formData.message.trim(),
    };

    setFormErrors(errors);

    if (!Object.values(errors).some((error) => error)) {
      // Logic to submit form
      // In a real app, you might POST to formspree or a backend
      console.log("Form submitted:", formData);
      alert("Message sent!"); // Placeholder
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } else {
      alert("Please fill in all required fields correctly.");
    }
  };

  const createRipple = (e) => {
    navigate("/demo");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setMobileMenuOpen(false);
    }
  };

  // Data arrays
  const faqs = [
    {
      question: "Is MediCare Pro HIPAA compliant?",
      answer:
        "Yes, MediCare Pro is fully HIPAA compliant. We implement industry-standard security measures including data encryption, access controls, audit logs, and regular security audits to ensure all protected health information (PHI) is secure.",
    },
    {
      question: "How does the AI prescription generator work?",
      answer:
        "Our AI analyzes patient symptoms, medical history, and current medications to suggest appropriate prescriptions. It checks for drug interactions and provides dosage recommendations, but all prescriptions must be reviewed and approved by a licensed physician before being issued.",
    },
    {
      question: "Can I import data from my current system?",
      answer:
        "Yes, we offer data migration services for most common healthcare management systems. Our team will work with you to ensure a smooth transition with minimal disruption to your practice.",
    },
    {
      question: "What training is provided?",
      answer:
        "We provide comprehensive onboarding including video tutorials, live training sessions, and detailed documentation. Our customer success team is also available to answer any questions as you get started.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, MediCare Pro offers fully functional iOS and Android apps that allow you to manage your practice on the go. All apps are designed with the same security standards as our web platform.",
    },
  ];

  // [FIXED] Replaced placeholder strings with actual Lucide icons
  const features = [
    {
      icon: <Stethoscope className="w-12 h-12 text-blue-600" />,
      title: "Doctor Dashboard",
      description:
        "Comprehensive patient management with detailed medical history, diagnosis tracking, and treatment plans.",
      items: [
        "Patient Details Viewer",
        "Medical History Tracking",
        "Treatment Planning",
        "Appointment Overview",
      ],
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-600" />,
      title: "AI Prescription Generator",
      description:
        "Generate accurate prescriptions based on symptoms and diagnosis using advanced AI technology.",
      items: [
        "Symptom-based Suggestions",
        "Drug Interaction Checks",
        "Dosage Recommendations",
        "Digital Prescriptions",
      ],
    },
    {
      icon: <Calendar className="w-12 h-12 text-teal-600" />,
      title: "Appointment & Follow-Up Tracker",
      description:
        "Manage appointments, follow-ups, and reminders effortlessly with intelligent scheduling.",
      items: [
        "Smart Scheduling",
        "Follow-Up Reminders",
        "Patient Queue Management",
        "Calendar Sync Integration",
      ],
    },

    {
      icon: <Shield className="w-12 h-12 text-red-600" />,
      title: "Secure MCP Server",
      description:
        "Enhanced security with MCP server integration and role-based access control for medical professionals.",
      items: [
        "Authentication System",
        "Role-based Access",
        "Data Encryption",
        "HIPAA Compliance",
      ],
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-600" />,
      title: "Analytics & Reports",
      description:
        "Comprehensive analytics and reporting tools to track practice performance and patient outcomes.",
      items: [
        "Patient Analytics",
        "Revenue Tracking",
        "Appointment Metrics",
        "Custom Reports",
      ],
    },
    {
      icon: <FileText className="w-12 h-12 text-green-600" />,
      title: "Smart Health Record Summarizer",
      description:
        "Summarize lengthy patient health records into concise, actionable insights.",
      items: [
        "Automatic Medical Note Extraction",
        "Past Diagnosis Summary",
        "Treatment History Overview",
        "AI-driven Recommendations",
      ],
    },
  ];

  const testimonials = [
    {
      initials: "JD",
      name: "Dr. John Doe",
      role: "Cardiologist",
      quote:
        "MediCare Pro has revolutionized how I manage my practice. The AI prescription tool saves me hours each week and reduces errors significantly.",
      stars: 5,
    },
    {
      initials: "SJ",
      name: "Sarah Johnson",
      role: "Practice Manager",
      quote:
        "The voice appointment system has cut our front desk workload in half. Our staff is more efficient and patients love the seamless experience.",
      stars: 4.5,
    },
    {
      initials: "RM",
      name: "Dr. Robert Miller",
      role: "Pediatrician",
      quote:
        "As someone who was hesitant about new technology, I was amazed at how intuitive MediCare Pro is. The analytics have helped me optimize my practice.",
      stars: 5,
    },
  ];

  const pricingPlans = [
    // ... (This section is fine) ...
  ];

  const footerLinks = {
    product: ["Features", "Pricing", "Security", "Updates", "Roadmap"],
    resources: ["Documentation", "Help Center", "Webinars", "Community", "API"],
    company: ["About", "Careers", "Privacy", "Terms", "Contact"],
  };

  return (
    <>
      {" "}
      <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes ecg {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes ecgPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .typing-cursor::after {
      content: '|';
      animation: blink 1s infinite;
      margin-left: 2px;
    }
  `}</style>
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600 to-teal-500 flex justify-center items-center z-50 transition-opacity duration-500">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white">
              Loading MediCare Pro
            </h2>
            <p className="text-white/80 mt-2">
              Your healthcare management solution
            </p>
          </div>
        </div>
      )}
      <div
        className={`antialiased font-sans ${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* Navigation */}
        <nav
          ref={navRef}
          className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-white font-bold text-xl font-serif">
                  MediCare Pro
                </span>
              </div>

              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className={`text-white hover:text-teal-300 transition-colors duration-300 font-medium relative ${
                    activeSection === "home"
                      ? "text-teal-300 after:w-full after:opacity-100"
                      : "text-white after:w-0 after:opacity-0"
                  }`}
                >
                  Home
                  {activeSection === "home" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className={`text-white hover:text-teal-300 transition-colors duration-300 font-medium relative ${
                    activeSection === "features"
                      ? "text-teal-300 after:w-full after:opacity-100"
                      : "text-white after:w-0 after:opacity-0"
                  }`}
                >
                  Features
                  {activeSection === "features" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className={`text-white hover:text-teal-300 transition-colors duration-300 font-medium relative ${
                    activeSection === "about"
                      ? "text-teal-300 after:w-full after:opacity-100"
                      : "text-white after:w-0 after:opacity-0"
                  }`}
                >
                  About
                  {activeSection === "about" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className={`text-white hover:text-teal-300 transition-colors duration-300 font-medium relative ${
                    activeSection === "testimonials"
                      ? "text-teal-300 after:w-full after:opacity-100"
                      : "text-white after:w-0 after:opacity-0"
                  }`}
                >
                  Testimonials
                  {activeSection === "testimonials" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`text-white hover:text-teal-300 transition-colors duration-300 font-medium relative ${
                    activeSection === "contact"
                      ? "text-teal-300 after:w-full after:opacity-100"
                      : "text-white after:w-0 after:opacity-0"
                  }`}
                >
                  Contact
                  {activeSection === "contact" && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300 rounded-full"></span>
                  )}
                </button>
              </div>

              <div className="flex space-x-4">
                <Link
                  to={"/signin"}
                  className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900/95 z-40 flex flex-col items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Contact
              </button>
              <div className="flex space-x-4 mt-8">
                <Link
                  to="/signin"
                  className="px-6 py-3 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section
          id="home"
          className="mt-9 min-h-screen bg-gradient-to-r from-blue-600 to-teal-500 relative flex items-center justify-center overflow-hidden"
        >
          {/* Animated particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  top: `${[20, 70, 40, 60, 30][i]}%`,
                  left: `${[15, 80, 50, 30, 70][i]}%`,
                  width: `${[8, 12, 6, 10, 8][i]}px`,
                  height: `${[8, 12, 6, 10, 8][i]}px`,
                  animation: `float ${[10, 15, 12, 14, 11][i]}s ease-in-out ${
                    [1, 2, 3, 2, 1][i]
                  }s infinite`,
                }}
              ></div>
            ))}
          </div>

          <div className="mt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">
                <span className="block mb-5">Healthcare Management</span>
                <span
                  className={`block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 ${
                    typedText.length === fullText.length
                      ? "animate-pulse"
                      : "typing-cursor"
                  }`}
                >
                  {typedText || "\u00A0"}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                Streamline your medical practice with AI-powered prescriptions,
                voice-enabled appointments, and comprehensive patient management
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={createRipple}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> Start Free Trial
                </button>
                <button
                  onClick={createRipple}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" /> Watch Demo
                </button>
              </div>

              {/* ECG Animation */}
              <div className="mt-20 relative max-w-2xl mx-auto">
                <div className="relative h-24 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern
                        id="grid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* ECG Line Animation - Slower (6s instead of 3s) */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 800 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="ecgGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>

                    {/* Animated ECG path */}
                    <g style={{ animation: "ecg 6s linear infinite" }}>
                      <path
                        d="M 0 50 L 50 50 L 60 50 L 70 20 L 80 80 L 90 50 L 100 50 L 120 50 L 130 45 L 140 55 L 150 50 L 250 50 L 260 50 L 270 20 L 280 80 L 290 50 L 300 50 L 320 50 L 330 45 L 340 55 L 350 50 L 450 50 L 460 50 L 470 20 L 480 80 L 490 50 L 500 50 L 520 50 L 530 45 L 540 55 L 550 50 L 650 50 L 660 50 L 670 20 L 680 80 L 690 50 L 700 50 L 720 50 L 730 45 L 740 55 L 750 50 L 800 50"
                        fill="none"
                        stroke="url(#ecgGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          animation: "ecgPulse 2s ease-in-out infinite",
                        }}
                      />
                    </g>
                  </svg>
                </div>

                {/* Label */}
                <div className="mt-4 flex items-center justify-center gap-2 text-white/60 text-sm">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <span>Real-time health monitoring ready</span>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => scrollToSection("features")}
                  className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-white animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our AI-Powered Clinic Management System?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of healthcare management with intelligent
                automation that adapts to your practice
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8 text-purple-600" />,
                  title: "AI That Learns Your Style",
                  description:
                    "Our intelligent prescription generator adapts to each doctor's preferences, creating personalized recommendations that align with your clinical expertise.",
                  highlight: "Continuously improving accuracy",
                },
                {
                  icon: <Clock className="w-8 h-8 text-green-600" />,
                  title: "Real-Time Synchronization",
                  description:
                    "Instant updates across all platforms. When an appointment is booked, your dashboard updates immediately - no delays, no confusion.",
                  highlight: "Zero lag time",
                },
                {
                  icon: <Shield className="w-8 h-8 text-red-600" />,
                  title: "Secure Central Hub",
                  description:
                    "Our MCP server acts as your intelligent backbone, managing all clinic data with enterprise-level security and seamless integration.",
                  highlight: "100% HIPAA compliant",
                },
                {
                  icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
                  title: "Context-Aware Suggestions",
                  description:
                    "Understands patient context and provides tailored treatment or medication advice suited to their medical background.",
                  highlight: "Personalized medical insights",
                },
                {
                  icon: <CheckCircle className="w-8 h-8 text-pink-600" />,
                  title: "Smart Prescription Validation",
                  description:
                    "Automatically verifies prescriptions for dosage accuracy, drug conflicts, and potential side effects before submission.",
                  highlight: "Error-free prescriptions",
                },

                {
                  icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
                  title: "Adaptive Intelligence",
                  description:
                    "The system evolves with every interaction, building smarter recommendations based on successful prescriptions and treatment outcomes.",
                  highlight: "Self-improving algorithms",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Powerful Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                Transform Your Healthcare Practice
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools designed to streamline operations, enhance
                patient care, and improve outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl group"
                >
                  {/* [FIXED] This now renders the icon component */}
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="text-sm text-gray-500 space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        {/* [FIXED] Replaced <i> with <Icon> */}
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />{" "}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  See It In Action
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                  Watch Our Product Demo
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Discover how MediCare Pro can transform your healthcare
                  practice in just 2 minutes. See our intuitive interface,
                  powerful features, and seamless workflows in action.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handlePlay}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" /> Play Demo
                  </button>
                </div>
              </div>

              <div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-200 flex items-center justify-center">
                  

                 
                  <video
                  ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="https://placehold.co/640x360/1e40af/white?text=Product+Demo"
                    controls
                  >
                    <source
                      src="https://res.cloudinary.com/doojbkvn6/video/upload/v1762609149/Medicare_Pro_Video_Generation_yx3xa1.mp4" // video
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsSectionRef}
          className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 relative overflow-hidden"
        >
          {/* ... (This section is fine) ... */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ... */}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from healthcare professionals who have transformed their
                practice with MediCare Pro
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  {/* [FIXED] Kept Font Awesome <i> tags for stars, as it's the easiest way to show half-stars.
                      Make sure you are loading Font Awesome in your main index.html file! */}
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas ${
                          i < Math.floor(testimonial.stars)
                            ? "fa-star"
                            : i < testimonial.stars
                            ? "fa-star-half-alt"
                            : "fa-star"
                        } ${i >= testimonial.stars ? "text-gray-300" : ""}`}
                      ></i>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                FAQs
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about MediCare Pro
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <button
                    className="flex justify-between items-center w-full text-left group"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    {/* [FIXED] Replaced <i> with <Icon> */}
                    {activeAccordion === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300" />
                    )}
                  </button>
                  <div
                    className={`mt-4 text-gray-600 overflow-hidden transition-all duration-300 ${
                      activeAccordion === index ? "max-h-96" : "max-h-0"
                    }`}
                    style={{
                      maxHeight: activeAccordion === index ? "500px" : "0",
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Still have questions?{" "}
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Contact our support team
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of healthcare professionals who trust MediCare Pro
              for their daily operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={"/demo"}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  Contact Us
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                  Get In Touch
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Have questions or want to learn more? Our team is here to help
                  you find the right solution for your healthcare practice.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      {/* [FIXED] Replaced <i> with <Icon> */}
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600">hello@medicarepro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      {/* [FIXED] Replaced <i> with <Icon> */}
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600">+91 7134566766</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      {/* [FIXED] Replaced <i> with <Icon> */}
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visit Us</h4>
                      <p className="text-gray-600">
                        Chhend Colony, Flat No.-167
                        <br />
                        Rourkela, Odisha-769003
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Send Us a Message
                  </h3>
                  <form
                    action="https://formspree.io/f/xyzjpgon"
                    method="Post"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          placeholder="Subject"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border ${
                            formErrors.message
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="Your message"
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <span className="text-white font-bold text-xl font-serif">
                    MediCare Pro
                  </span>
                </div>
                <p className="text-gray-400 mb-6">
                  Revolutionizing healthcare management with cutting-edge
                  technology and intuitive design.
                </p>
                <div className="flex space-x-4">
                  {/* [FIXED] Replaced <i> with <Icon> */}
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Product</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.product.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Resources</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.resources.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Company</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.company.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                &copy; 2025 MediCare Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* [FIXED] Added style block for .animation-delay-xxxx
          This was missing from your original code and would have caused a crash.
      */}
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
}
