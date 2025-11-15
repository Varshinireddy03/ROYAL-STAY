import React from "react";
import { resolveImage } from "../utils";

export default function RoomCard({ room, onReserve }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden h-52 bg-gray-200">
        <img
          src={resolveImage(room.image)}
          alt="room"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {room.room_type}
          </span>
        </div>
        {/* AC Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            room.ac === "AC"
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}>
            <i className={`fas ${room.ac === "AC" ? "fa-snowflake" : "fa-fan"} mr-1`}></i>
            {room.ac}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Room Number and Price */}
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-gray-800">Room {room.number}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">₹{room.tariff}</div>
            <p className="text-xs text-gray-500">/night</p>
          </div>
        </div>

        {/* Availability Status */}
        {room.is_available && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              <i className="fas fa-check-circle"></i> Available
            </span>
          </div>
        )}

        {/* Reserve Button */}
        {onReserve && (
          <button
            onClick={() => onReserve(room)}
            className="btn-primary w-full py-2.5 font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <i className="fas fa-calendar-plus"></i> Reserve Now
          </button>
        )}
      </div>
    </div>
  );
}

