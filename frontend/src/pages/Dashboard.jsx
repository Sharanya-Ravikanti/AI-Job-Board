import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../App.css";

const formatDescriptionPreview = (description = "") => {
  const cleaned = (description || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/^\s*[-+*•]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*(?:\|.*\|)\s*$/gm, " ")
    .replace(/^\s*[-*_]{3,}\s*$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_~`]/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "No description provided yet.";
  }

  return cleaned.length > 150 ? `${cleaned.slice(0, 150).trimEnd()}...` : cleaned;
};

function Dashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/jobs");
      setJobs(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load jobs right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${jobId}`);

      setJobs((prev) =>
        prev.filter((job) => job.id !== jobId)
      );
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Failed to delete job."
      );
    }
  };

  const stats = useMemo(() => {
    const uniqueCompanies = new Set(
      jobs.map((job) => job.company).filter(Boolean)
    ).size;
    const uniqueLocations = new Set(
      jobs.map((job) => job.location).filter(Boolean)
    ).size;

    return [
      {
        label: "Total Jobs",
        value: jobs.length,
        accent: "blue",
      },
      {
        label: "Companies",
        value: uniqueCompanies,
        accent: "green",
      },
      {
        label: "Locations",
        value: uniqueLocations,
        accent: "purple",
      },
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [jobs, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

  <header className="dashboard-header">

    <div className="dashboard-title">
      <h1>HireGen AI</h1>
      <p className="dashboard-subtitle">
        AI-Powered Recruitment Management System
      </p>
    </div>

    <div className="header-actions">
      <button
        className="profile-btn"
        onClick={() => navigate("/profile")}
      >
        👤 Profile
      </button>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>

  </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`stat-card ${stat.accent}`}
          >
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h3>Job Listings</h3>
            <p>Track your latest opportunities.</p>
          </div>

          <button
            className="add-job-button"
            onClick={() => navigate("/add-job")}
          >
            + Add New Job
          </button>
        </div>

        <div className="job-search-wrapper">
          <input
            type="text"
            className="job-search-input"
            placeholder="Search by title, company, location, or skills"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Loading jobs...</div>
        ) : error ? (
          <div className="empty-state error">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">No jobs available</div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">No jobs match your search.</div>
        ) : (
          <div className="job-card-grid">
            {filteredJobs.map((job) => (
              <article key={job.id} className="job-card-item">
                <div className="job-card-top">
                  <div>
                    <h4>{job.title}</h4>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <span className="job-chip">{job.location}</span>
                </div>

                <p className="job-description-preview">
                  {formatDescriptionPreview(job.description)}
                </p>

                <button
                  className="details-link-btn"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  View Details
                </button>

                <div className="job-meta-row">
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
                  <span>Exp: {job.experience}</span>
                </div>

                <div className="action-buttons">
                  <button className="view-btn" onClick={() => navigate(`/jobs/${job.id}`)}>
                    👁 View
                  </button>
                  <button className="edit-btn" onClick={() => navigate(`/jobs/edit/${job.id}`)}>
                    ✏ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                    🗑 Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;