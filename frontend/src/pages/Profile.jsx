import { useEffect, useState } from "react";
import { FiArrowLeft, FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="profile-loading-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="profile-loading-card">
          <h2>{error}</h2>

          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>
    );
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <div className="dashboard-page">
      <div className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">
            {(user?.username || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="profile-eyebrow">Recruiter profile</p>
            <h1>{user?.username || "Recruiter"}</h1>
            <p className="profile-subtitle">
              Keep your account details current and ready for hiring.
            </p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-card">
            <div className="profile-info-icon">
              <FiUser />
            </div>
            <div>
              <p className="profile-info-label">Username</p>
              <p className="profile-info-value">{user?.username}</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <FiMail />
            </div>
            <div>
              <p className="profile-info-label">Email</p>
              <p className="profile-info-value">{user?.email}</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <FiShield />
            </div>
            <div>
              <p className="profile-info-label">Account Status</p>
              <p className="profile-info-value">Active</p>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <FiArrowLeft />
            </div>
            <div>
              <p className="profile-info-label">Member Since</p>
              <p className="profile-info-value">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft /> Back to Dashboard
          </button>

          <button
            className="update-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;