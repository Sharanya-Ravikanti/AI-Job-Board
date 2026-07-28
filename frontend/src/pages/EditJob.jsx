import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "../App.css";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);

      setFormData({
        title: response.data.title,
        company: response.data.company,
        location: response.data.location,
        description: response.data.description,
        skills: response.data.skills,
        experience: response.data.experience,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load the job."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerateAI = async () => {
    if (
      !formData.title ||
      !formData.skills ||
      !formData.experience
    ) {
      setError(
        "Please enter Title, Skills and Experience."
      );
      return;
    }

    setAiLoading(true);
    setError("");

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
    } catch (err) {
      setError("Failed to generate AI description.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.put(`/jobs/${id}`, formData);

      setSuccess("Job updated successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to update job."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <div className="dashboard-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">HireGen AI</p>
          <h1>Edit Job</h1>
        </div>

        <button
          className="logout-button"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      <div className="dashboard-panel form-panel">
        <div className="form-hero">
          <div>
            <p className="form-eyebrow">Update a role</p>
            <h2>Edit the opportunity</h2>
            <p>Refine the details below and keep your posting current.</p>
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
                    required
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <h3>Skills & description</h3>
              <p>Adjust the stack and summary for the current role.</p>
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
                  rows="10"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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
                  <FiStar className="button-icon" /> Regenerate AI
                </span>
              )}
            </button>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="button-content">
                  <FiTrendingUp className="button-icon" /> Updating...
                </span>
              ) : (
                <span className="button-content">
                  <FiTrendingUp className="button-icon" /> Update Job
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJob;