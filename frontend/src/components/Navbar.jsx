import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar({ onCart }) {
  const nav = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCartCount = () => {
      try {
        const raw = localStorage.getItem("cart") || "[]";
        const parsed = JSON.parse(raw);
        const total = parsed.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    loadCartCount();
    // Listen for storage changes (when cart updates from other components)
    window.addEventListener("storage", loadCartCount);
    return () => window.removeEventListener("storage", loadCartCount);
  }, []);

  function logout(){
    localStorage.clear();
    nav("/login");
  }
  return (
    <nav className="bg-white shadow py-3">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">RoyalStay</Link>

        <div className="flex items-center gap-4">
          <Link to="/guest" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
          <Link to="/bills" className="text-gray-700 hover:text-indigo-600">Bills</Link>
          <button onClick={onCart} className="relative p-2 rounded hover:bg-gray-100">
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={()=>nav("/login")} className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"><UserCircleIcon className="w-6 h-6" /></button>
          <button onClick={logout} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
}

