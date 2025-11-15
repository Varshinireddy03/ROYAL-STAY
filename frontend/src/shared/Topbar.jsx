import React from "react";
import { jwtDecode } from "jwt-decode";

export default function Topbar() {
  const token = localStorage.getItem("access_token");
  let username = "Guest";
  if (token) {
    try { username = jwtDecode(token).username; } catch {}
  }
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-sm border-b">
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold text-gray-800">Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">Signed in as <span className="font-semibold">{username}</span></div>
      </div>
    </header>
  );
}

