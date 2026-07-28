import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiCpu,
  FiGrid,
  FiLock,
  FiStar,
} from "react-icons/fi";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiCpu />,
      title: "AI Job Description Generator",
      description:
        "Generate professional, recruiter-ready job descriptions instantly using AI.",
    },
    {
      icon: <FiCheckCircle />,
      title: "JD Quality Validator",
      description:
        "Analyze job descriptions with AI and receive quality scores and actionable improvements.",
    },
    {
      icon: <FiStar />,
      title: "AI Publish Assistant",
      description:
        "Optimize job postings for LinkedIn, Indeed, and Naukri with platform-specific suggestions.",
    },
    {
      icon: <FiGrid />,
      title: "Recruitment Dashboard",
      description:
        "Create, edit, manage, and organize job postings in one secure recruiter workspace.",
    },
    {
      icon: <FiBarChart2 />,
      title: "Job Management",
      description:
        "Track all your job listings with a clean dashboard designed for recruiters.",
    },
    {
      icon: <FiLock />,
      title: "Secure Authentication",
      description:
        "JWT-based authentication ensures every recruiter accesses only their own jobs and profile.",
    },
  ];

  const steps = [
    {
      title: "1. Create a Job",
      description:
        "Enter the role, company, required skills, experience, and location.",
    },
    {
      title: "2. Generate & Validate",
      description:
        "Use AI to generate professional job descriptions and validate their quality.",
    },
    {
      title: "3. Optimize & Publish",
      description:
        "Enhance postings for recruitment platforms and manage them from your dashboard.",
    },
  ];

  return (
    <div className="landing-page">
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="landing-brand">HireGen AI</div>

          <div className="landing-nav-actions">
            <button
              className="landing-nav-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="landing-primary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="landing-hero-content">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">
              AI-powered recruitment platform
            </p>

            <h1>HireGen AI</h1>

            <p className="landing-subtitle">
              AI-Powered Recruitment Platform
            </p>

            <p className="landing-description">
              Create, optimize, validate, and manage professional job
              descriptions using AI. HireGen AI helps recruiters streamline
              hiring with an intelligent, secure, and easy-to-use recruitment
              platform.
            </p>

            <div className="landing-actions">
              <button
                className="landing-primary-btn"
                onClick={() => navigate("/register")}
              >
                Get Started <FiArrowRight />
              </button>

              <button
                className="landing-secondary-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>

          <div className="landing-hero-card">
            <div className="landing-card-row">
              <div>
                <p className="landing-card-label">AI Features</p>
                <h3>3</h3>
              </div>

              <div>
                <p className="landing-card-label">Authentication</p>
                <h3>JWT</h3>
              </div>
            </div>

            <div className="landing-card-row alt">
              <div>
                <p className="landing-card-label">AI Model</p>
                <h3>OpenRouter</h3>
              </div>

              <div>
                <p className="landing-card-label">Backend</p>
                <h3>FastAPI</h3>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-section">
          <div className="section-heading center">
            <p className="landing-eyebrow">Features</p>
            <h2>Everything recruiters need to move faster</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section alt-section">
          <div className="section-heading center">
            <p className="landing-eyebrow">How it works</p>
            <h2>Three simple steps to smarter hiring</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article key={step.title} className="step-card">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section preview-section">
          <div className="preview-copy">
            <p className="landing-eyebrow">Dashboard Preview</p>

            <h2>Manage recruitment with confidence</h2>

            <p>
              Track jobs, generate AI-powered descriptions, validate content,
              and manage hiring workflows from one centralized dashboard.
            </p>
          </div>

          <div className="dashboard-preview">
            <div className="preview-window">
              <div className="preview-toolbar">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="preview-chip active">Overview</div>
                  <div className="preview-chip">Jobs</div>
                  <div className="preview-chip">AI Tools</div>
                </div>

                <div className="preview-content">
                  <div className="preview-stat-row">
                    <div className="preview-stat" />
                    <div className="preview-stat" />
                    <div className="preview-stat" />
                  </div>

                  <div className="preview-list">
                    <div className="preview-item large" />
                    <div className="preview-item" />
                    <div className="preview-item" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 HireGen AI. Built for modern recruitment teams.</p>
      </footer>
    </div>
  );
}

export default LandingPage;