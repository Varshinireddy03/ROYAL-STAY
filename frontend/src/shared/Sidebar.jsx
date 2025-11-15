import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function useRole() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const p = jwtDecode(token);
    return p.role;
  } catch { return null; }
}

const LinkItem = ({ to, children }) => (
  <NavLink to={to} className={({isActive}) => `block px-4 py-2 rounded-lg mb-1 ${isActive ? "bg-white text-blue-700 shadow" : "text-white/90 hover:bg-white/10"}`}>
    {children}
  </NavLink>
);

export default function Sidebar() {
  const role = useRole();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-blue-700 to-purple-700 text-white p-6 shadow-lg">
      <div className="mb-8">
        <div className="text-2xl font-bold">RoyalStay</div>
        <div className="text-sm opacity-80 mt-1">Hotel Management</div>
      </div>

      <nav className="flex-1">
        {role === "GUEST" && (
          <>
            <LinkItem to="/guest">Guest Dashboard</LinkItem>
            <LinkItem to="/rooms/1">Rooms</LinkItem>
            <LinkItem to="/bills">My Bills</LinkItem>
          </>
        )}

        {role === "MANAGER" && (
          <>
            <LinkItem to="/manager">Manager Dashboard</LinkItem>
            <LinkItem to="/manager#rooms">Rooms</LinkItem>
            <LinkItem to="/manager#food">Food Menu</LinkItem>
            <LinkItem to="/manager#reports">Reports</LinkItem>
          </>
        )}

        {role === "RECEPTIONIST" && (
          <>
            <LinkItem to="/reception">Receptionist Dashboard</LinkItem>
          </>
        )}

        {role === "STAFF" && (
          <>
            <LinkItem to="/staff">Staff Dashboard</LinkItem>
          </>
        )}
      </nav>

      <div className="mt-8">
        <button onClick={logout} className="w-full bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold">Logout</button>
      </div>
    </aside>
  );
}

