import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiAward,
  FiBriefcase,
  FiClock,
  FiEdit3,
  FiLayers,
  FiMapPin,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

import api, { optimizeJob, validateJob } from "../services/api";
import "../App.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [optimizedDescription, setOptimizedDescription] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [validationPlatform, setValidationPlatform] = useState("linkedin");
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!job?.description) {
      setOptimizeError("Add a job description before optimizing.");
      return;
    }

    try {
      setOptimizing(true);
      setOptimizeError("");
      const result = await optimizeJob(job.description, platform);
      setOptimizedDescription(result || "No optimized description returned.");
    } catch (err) {
      setOptimizeError(
        err?.response?.data?.detail || "Unable to optimize this description right now."
      );
    } finally {
      setOptimizing(false);
    }
  };

  const handleCopy = async () => {
    if (!optimizedDescription) {
      return;
    }

    try {
      await navigator.clipboard.writeText(optimizedDescription);
      setCopySuccess("Copied successfully");
    } catch (err) {
      console.error("Copy failed", err);
      setCopySuccess("");
    }
  };

  const handleOpenPlatform = () => {
    const platformUrl = {
      linkedin: "https://www.linkedin.com/talent/post-a-job",
      naukri: "https://www.naukri.com/recruiter",
      indeed: "https://employers.indeed.com",
    }[platform] || "https://www.linkedin.com/talent/post-a-job";

    window.open(platformUrl, "_blank", "noopener,noreferrer");
  };

  const handleValidate = async () => {
    if (!job?.description) {
      setValidationError("Add a job description before validating.");
      return;
    }

    try {
      setValidating(true);
      setValidationError("");
      const result = await validateJob(job.description, validationPlatform);
      setValidationResult(result || null);
    } catch (err) {
      setValidationError(
        err?.response?.data?.detail || "Unable to validate this description right now."
      );
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <h2>{error}</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-card">
        <div className="job-details-hero">
          <div>
            <p className="job-details-eyebrow">Recruiter view</p>
            <h1>{job.title}</h1>
            <p className="job-details-subtitle">
              AI-powered recruitment workspace for creating, validating and publishing professional job descriptions.
            </p>
          </div>

          <div className="job-details-actions">
            <button
              className="back-btn"
              onClick={() => navigate("/dashboard")}
            >
              <FiArrowLeft /> Back
            </button>

            <button
              className="update-btn"
              onClick={() => navigate(`/jobs/edit/${job.id}`)}
            >
              <FiEdit3 /> Edit Job
            </button>
          </div>
        </div>

        <div className="detail-card-grid">
          <div className="detail-card">
            <div className="detail-card-icon">
              <FiBriefcase />
            </div>
            <div>
              <p className="detail-card-label">Company</p>
              <p className="detail-card-value">{job.company}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-icon">
              <FiMapPin />
            </div>
            <div>
              <p className="detail-card-label">Location</p>
              <p className="detail-card-value">{job.location}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-icon">
              <FiClock />
            </div>
            <div>
              <p className="detail-card-label">Experience</p>
              <p className="detail-card-value">{job.experience}</p>
            </div>
          </div>
          <div className="detail-card">
          <div className="detail-card-icon">
        <FiClock />
    </div>

    <div>
        <p className="detail-card-label">
            Created
        </p>

        <p className="detail-card-value">
            {new Date(job.created_at).toLocaleDateString()}
        </p>
    </div>
</div>
          <div className="detail-card">
            <div className="detail-card-icon">
              <FiAward />
            </div>
            <div>
              <p className="detail-card-label">Skills</p>
              {job.skills ? (
                <div className="skill-chip-group">
                  {(job.skills || "")
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="detail-card-value">No skills listed.</p>
              )}
            </div>
          </div>
        </div>

        
        <section className="job-description-section">

    <div className="section-header">
        <FiLayers />
        <h3>Job Description</h3>
    </div>

    <div className="job-description-card">

        <div className="job-description-content markdown-body">
            <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>

    </div>

</section>
<hr className="section-divider" />
        <div className="publish-assistant-section">
          <div className="publish-assistant-header">
            <div>
              <h3>AI Publish Assistant</h3>
              <p>Generate AI-optimized job descriptions tailored for LinkedIn, Indeed and Naukri.</p>
            </div>
          </div>

          <div className="publish-assistant-controls">
            <label className="publish-platform-field">
              <span>Platform</span>
              <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                <option value="linkedin">LinkedIn</option>
                <option value="naukri">Naukri</option>
                <option value="indeed">Indeed</option>
              </select>
            </label>

            <button className="optimize-btn" onClick={handleOptimize} disabled={optimizing}>
              {optimizing ? "Generating..." : "Generate AI Version"}
            </button>
          </div>

          {optimizeError ? <p className="publish-assistant-error">{optimizeError}</p> : null}

          {optimizedDescription ? (
            <div className="optimized-description-card">
              <div className="optimized-description-actions">
                <button className="copy-btn" onClick={handleCopy}>
                  Copy Description
                </button>
                <button className="open-platform-btn" onClick={handleOpenPlatform}>
                  Open {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              </div>
              {copySuccess ? <p className="success-message">{copySuccess}</p> : null}
              <div className="job-description">
                <ReactMarkdown>{optimizedDescription}</ReactMarkdown>
              </div>
            </div>
          ) : null}
        </div>
<hr className="section-divider" />
        <div className="validator-section">
          <div className="validator-header">
            <div>
              <h3>AI Job Description Validator</h3>
              <p>Evaluate your job description against recruitment best practices and receive AI-powered recommendations.</p>
            </div>
          </div>

          <div className="publish-assistant-controls">
            <label className="publish-platform-field">
              <span>Platform</span>
              <select value={validationPlatform} onChange={(event) => setValidationPlatform(event.target.value)}>
                <option value="linkedin">LinkedIn</option>
                <option value="naukri">Naukri</option>
                <option value="indeed">Indeed</option>
              </select>
            </label>

            <button className="optimize-btn" onClick={handleValidate} disabled={validating}>
              {validating ? "Validating..." : "Validate"}
            </button>
          </div>

          {validationError ? <p className="publish-assistant-error">{validationError}</p> : null}

          {validationResult ? (
            <div className="validator-results">
              <div className="validator-score-card">
                <p className="validator-label">JD Score</p>
                <div className="validator-score">{validationResult.score}</div>
                <p className="validator-score-caption">
                  {validationResult.score >= 80
                     ? "Excellent"
                     : validationResult.score >= 60
                     ? "Good"
                     : "Needs Improvement"}
                </p>
              </div>

              <div className="validator-insights-grid">
                <div className="validator-insight-card green-card">
                  <div className="validator-card-title">✅ Strengths</div>
                  <ul>
                    {(validationResult.strengths || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="validator-insight-card yellow-card">
                  <div className="validator-card-title">⚠ Missing Items</div>
                  <ul>
                    {(validationResult.missing || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="validator-insight-card blue-card">
                  <div className="validator-card-title">💡 Recommendations</div>
                  <ul>
                    {(validationResult.recommendations || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;