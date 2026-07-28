import { useState } from "react";
import {
  FiBriefcase,
  FiClock,
  FiFileText,
  FiMapPin,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../App.css";

function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleGenerateAI = async () => {
    if (
      !formData.title ||
      !formData.skills ||
      !formData.experience
    ) {
      setError("Please enter Title, Skills and Experience first.");
      return;
    }

    setAiLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/ai/generate-job", {
        title: formData.title,
        skills: formData.skills,
        experience: formData.experience,
      });

      setFormData((prev) => ({
        ...prev,
        description: response.data.description,
      }));

      setSuccess("AI generated the job description successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to generate job description."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/jobs", formData);

      setSuccess("Job created successfully.");

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create the job right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">HireGen AI</p>
          <h1>Add New Job</h1>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="dashboard-panel form-panel">
        <div className="form-hero">
          <div>
            <p className="form-eyebrow">Create a role</p>
            <h2>Post a new opportunity</h2>
            <p>Fill in the essentials below and let AI craft the description for you.</p>
          </div>
        </div>

        <form className="job-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="section-heading">
              <h3>Role details</h3>
              <p>Required fields are marked with an asterisk.</p>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>
                  Job Title <span className="required-mark">*</span>
                </span>
                <div className="input-with-icon">
                  <FiBriefcase />
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Senior Product Designer"
                    required
                  />
                </div>
              </label>

              <label className="field-group">
                <span>
                  Company <span className="required-mark">*</span>
                </span>
                <div className="input-with-icon">
                  <FiUser />
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="HireGen AI"
                    required
                  />
                </div>
              </label>

              <label className="field-group">
                <span>
                  Location <span className="required-mark">*</span>
                </span>
                <div className="input-with-icon">
                  <FiMapPin />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Remote / Hyderabad"
                    required
                  />
                </div>
              </label>

              <label className="field-group">
                <span>
                  Experience <span className="required-mark">*</span>
                </span>
                <div className="input-with-icon">
                  <FiClock />
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="3+ years"
                    required
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <h3>Skills & description</h3>
              <p>Add the core stack and expand the role summary.</p>
            </div>

            <label className="field-group">
              <span>
                Skills <span className="required-mark">*</span>
              </span>
              <div className="input-with-icon">
                <FiTag />
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Python, SQL"
                  required
                />
              </div>
            </label>

            <label className="field-group">
              <span>
                Description <span className="required-mark">*</span>
              </span>
              <div className="input-with-icon textarea-icon">
                <FiFileText />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="10"
                  placeholder="Generate using AI or write manually..."
                  required
                />
              </div>
            </label>
          </section>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="ai-button"
              onClick={handleGenerateAI}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <span className="button-content">
                  <FiStar className="button-icon" /> Generating...
                </span>
              ) : (
                <span className="button-content">
                  <FiStar className="button-icon" /> Generate with AI
                </span>
              )}
            </button>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="button-content">
                  <FiTrendingUp className="button-icon" /> Saving Job...
                </span>
              ) : (
                <span className="button-content">
                  <FiTrendingUp className="button-icon" /> Save Job
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJob;