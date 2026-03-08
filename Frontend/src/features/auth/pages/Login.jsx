import React from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    if (!validateForm()) return;
    await handleLogin({ email, password });
    navigate("/");
  };
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading...</h1>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" />
        </div>
      </main>
    );
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="email"
              name="email"
              placeholder="Enter your email"
            />

            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>
          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
