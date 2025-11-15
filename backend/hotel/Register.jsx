import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/", { username, password, first_name, last_name, email, role: "GUEST" });
      alert("Account created — please login.");
      nav("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Create your RoyalStay account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full p-3 border rounded-lg" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg" required />
          <input value={first_name} onChange={e=>setFirst(e.target.value)} placeholder="First name" className="w-full p-3 border rounded-lg" />
          <input value={last_name} onChange={e=>setLast(e.target.value)} placeholder="Last name" className="w-full p-3 border rounded-lg" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg" type="email" />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">Register</button>
        </form>
      </div>
    </div>
  );
}

