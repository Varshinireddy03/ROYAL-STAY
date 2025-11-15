import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Layout({ children, onCart }) {
  const navigate = useNavigate();
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
    // Listen for storage changes
    const interval = setInterval(loadCartCount, 500);
    window.addEventListener("storage", loadCartCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadCartCount);
    };
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold tracking-wide">RoyalStay Hotel</h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
          >
            Back
          </button>

          {onCart && (
            <button
              onClick={onCart}
              className="relative bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

