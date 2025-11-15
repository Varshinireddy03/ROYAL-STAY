import React from "react";
import { resolveImage } from "../utils";

export default function FoodCard({ item, onOrder }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl card-shadow overflow-hidden transform hover:scale-105">
      <div className="relative h-48 overflow-hidden">
  {/* Use centralized public image for food items */}
  <img src="/food.jpeg" alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          ₹{item.price}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        <button 
          onClick={() => onOrder(item)} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <i className="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

