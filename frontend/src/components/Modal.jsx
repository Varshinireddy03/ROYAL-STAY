import React from "react";

export default function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

