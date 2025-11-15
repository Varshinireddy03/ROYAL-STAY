import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Get JWT tokens
      const res = await api.post("/token/", form);
      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Fetch current user /me
      const me = await api.get("/users/me/");
      const role = me.data.role;
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "GUEST") navigate("/guest");
      else if (role === "MANAGER") navigate("/manager");
      else if (role === "RECEPTIONIST") navigate("/reception");
      else if (role === "STAFF") navigate("/staff");
      else navigate("/guest");
    } catch (err) {
      console.error("login error => ", err);
      alert("Invalid username or password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-header px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Brand Section */}
        <div className="hidden md:flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">RoyalStay</h1>
          <p className="text-xl opacity-90 mb-6">Premium Hotel Management System</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              <span>Seamless Reservations</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              <span>World-class Service</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              <span>Luxury Experience</span>
            </li>
          </ul>
        </div>

        {/* Login Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to your account</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
            >
              <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-sign-in-alt"}></i>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

