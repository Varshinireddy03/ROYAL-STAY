import React, { useEffect, useState } from "react";
import api from "../api";

export default function ReceptionDashboard() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const resv = await api.get("/reservations/");
      const rms = await api.get("/rooms/");
      // Only show pending (REQUESTED) and confirmed (CONFIRMED) reservations
      const pending = resv.data.filter(r => r.status === "REQUESTED" || r.status === "CONFIRMED");
      setReservations(pending);
      setRooms(rms.data);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Failed to load data");
    }
  }

  async function assignRoom(id) {
    if (!selectedRoom) {
      alert("Select a room first");
      return;
    }

    try {
      await api.post(`/reservations/${id}/assign_room/`, {
        room_id: selectedRoom,
      });
      alert("Room assigned successfully!");
      setSelectedRoom("");
      loadData();
    } catch (err) {
      console.error("Error assigning room:", err);
      alert("Failed to assign room");
    }
  }

  async function checkout(id) {
    try {
      await api.post(`/reservations/${id}/checkout/`);
      alert("Guest checked out successfully!");
      loadData();
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Failed to checkout");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="gradient-header text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reception Dashboard</h1>
              <p className="text-lg opacity-90">Manage reservations and guest check-ins/check-outs</p>
            </div>
            <button
              onClick={loadData}
              className="btn-secondary px-6 py-2 flex items-center gap-2"
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <i className="fas fa-calendar-check text-indigo-600 text-2xl"></i>
            <h2 className="section-title mb-0">Reservations</h2>
            <span className="badge-success px-3 py-1 rounded-full text-sm font-semibold">
              {reservations.length} Active
            </span>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
              <p className="text-gray-600 text-lg font-semibold">No pending reservations</p>
              <p className="text-gray-500">All bookings have been processed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition hover:border-indigo-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <i className="fas fa-user text-indigo-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Guest</p>
                        <p className="text-lg font-bold text-gray-800">{r.guest.username}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <i className="fas fa-calendar text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Duration</p>
                        <p className="text-gray-800 font-semibold">{r.checkin_date}</p>
                        <p className="text-gray-600 text-sm">→ {r.checkout_date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg ${r.status === "CONFIRMED" ? "bg-green-100" : "bg-yellow-100"}`}>
                        <i className={`fas fa-info-circle text-xl ${r.status === "CONFIRMED" ? "text-green-600" : "text-yellow-600"}`}></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Status</p>
                        <span className={r.status === "CONFIRMED" ? "badge-success" : "badge-warning"}>
                          {r.status}
                        </span>
                        {r.room && <p className="text-gray-600 text-sm mt-1">Room: <span className="font-semibold">{r.room}</span></p>}
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  {r.status === "REQUESTED" && (
                    <div className="pt-4 border-t flex gap-3">
                      <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="">Select Room to Assign...</option>
                        {rooms
                          .filter((rm) => rm.is_available)
                          .map((rm) => (
                            <option key={rm.id} value={rm.id}>
                              {rm.number} ({rm.room_type})
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={() => assignRoom(r.id)}
                        className="btn-primary px-6 py-2 whitespace-nowrap"
                      >
                        <i className="fas fa-arrow-right"></i> Assign Room
                      </button>
                    </div>
                  )}

                  {r.status === "CONFIRMED" && (
                    <div className="pt-4 border-t">
                      <button
                        onClick={() => checkout(r.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-sign-out-alt"></i> Process Checkout
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

