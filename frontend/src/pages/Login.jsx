import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      const token = response?.data?.access_token;
      if (!token) {
        throw new Error("No access token was returned by the server.");
      }

      
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.detail || "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-branding">
          <p className="brand-label">HireGen AI</p>
          <h1>Welcome back</h1>
          <p>Sign in to continue hiring smarter.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field-group" htmlFor="username">
            <span>Username</span>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-group" htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;