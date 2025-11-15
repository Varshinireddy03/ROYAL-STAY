import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { resolveImage } from "../utils";
import Layout from "../components/Layout";

export default function RoomView() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const r = (await api.get(`/rooms/${id}/`)).data;
      setRoom(r);
    } catch (err) {
      console.error("Error loading room:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-indigo-600 text-5xl mb-4"></i>
            <p className="text-gray-600 text-lg mt-4">Loading room details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <p className="text-gray-600 text-lg">Room not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={resolveImage(room.image)}
                className="w-full h-full object-cover"
                alt="room"
              />
              {/* Badges */}
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

              {/* Availability Badge */}
              <div className="absolute top-6 right-6">
                {room.is_available ? (
                  <span className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                    <i className="fas fa-check-circle"></i> Available
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                    <i className="fas fa-times-circle"></i> Occupied
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title and Price */}
              <div className="flex items-baseline justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Room {room.number}</h1>
                <div className="text-right">
                  <div className="text-4xl font-bold text-indigo-600">₹{room.tariff}</div>
                  <p className="text-gray-600">/night</p>
                </div>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <i className="fas fa-door-open text-indigo-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Room Type</p>
                    <p className="font-semibold text-gray-800">{room.room_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <i className={`fas ${room.ac === "AC" ? "fa-snowflake" : "fa-fan"} text-blue-600 text-2xl`}></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Climate</p>
                    <p className="font-semibold text-gray-800">{room.ac}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <i className={`fas ${room.is_available ? "fa-check-circle text-green-600" : "fa-times-circle text-red-600"} text-2xl`}></i>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="font-semibold text-gray-800">{room.is_available ? "Available" : "Occupied"}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Room Features</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> Premium bedding and linens
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> En-suite bathroom with premium toiletries
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> 32" Smart LED TV
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> Free Wi-Fi throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> Room service available 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i> Climate control system
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              {room.is_available && (
                <button className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                  <i className="fas fa-calendar-check"></i> Book This Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

