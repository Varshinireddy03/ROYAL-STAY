import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rooms/${id}/`);
        setRoom(res.data);
      } catch (err) {
        console.error("Error loading room:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-indigo-600 text-5xl mb-4"></i>
            <p className="text-gray-600 text-lg">Loading room details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <p className="text-gray-600 text-lg">Room not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full min-h-96">
              <img
                src={room.image || "https://images.unsplash.com/photo-1560448104-8b2b3c3e7c3f?auto=format&fit=crop&w=1200&q=60"}
                alt="room"
                className="w-full h-full object-cover"
              />
              {/* Overlay Badges */}
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                  {room.room_type}
                </span>
                <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                  room.ac === "AC"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  <i className={`fas ${room.ac === "AC" ? "fa-snowflake" : "fa-fan"} mr-1`}></i>
                  {room.ac}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Room {room.number}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-indigo-600">₹{room.tariff}</span>
                <span className="text-gray-600">/night</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Room Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <i className="fas fa-door-open text-indigo-600 text-lg"></i>
                  <span className="text-gray-700"><strong>Type:</strong> {room.room_type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className={`fas ${room.ac === "AC" ? "fa-snowflake" : "fa-fan"} text-blue-600 text-lg`}></i>
                  <span className="text-gray-700"><strong>Climate:</strong> {room.ac}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className={`fas ${room.is_available ? "fa-check-circle text-green-600" : "fa-times-circle text-red-600"} text-lg`}></i>
                  <span className="text-gray-700">
                    <strong>Availability:</strong> {room.is_available ? "Available" : "Occupied"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Premium bedding
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Flat-screen TV
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Private bathroom
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Free Wi-Fi
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Air conditioning
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <i className="fas fa-check text-green-500"></i> Room service available
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            {room.is_available && (
              <button className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                <i className="fas fa-calendar-check"></i> Reserve This Room
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

