import React from "react";

export default function Footer(){
  return (
    <footer className="mt-auto bg-gray-50 py-8">
      <div className="container mx-auto px-6 text-sm text-gray-600">
        © {new Date().getFullYear()} RoyalStay — Built with care.
      </div>
    </footer>
  );
}

