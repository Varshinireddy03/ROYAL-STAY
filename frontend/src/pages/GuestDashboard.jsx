import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Card from "../components/Card";
import FoodCard from "../components/FoodCard";
import CartDrawer from "../components/CartDrawer";
import ComplaintModal from "../components/ComplaintModal";

export default function GuestDashboard() {
  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const roomRes = await api.get("/rooms/available/");
      const menuRes = await api.get("/food/");
      setRooms(roomRes.data);
      setMenu(menuRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function requestReservation() {
    try {
      await api.post("/reservations/", {
        checkin_date: "2025-12-01",
        checkout_date: "2025-12-03",
      });
      alert("Reservation requested! Waiting for confirmation.");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to request reservation");
    }
  }

  return (
    <Layout onCart={() => setCartOpen(true)}>
      {/* Hero Section */}
      <div className="gradient-header text-white rounded-xl p-8 mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome to RoyalStay</h1>
        <p className="text-lg opacity-90">Experience luxury and comfort like never before</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-calendar-plus text-indigo-600 text-2xl"></i>
            <h3 className="font-bold text-gray-800">Reserve Room</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Book your ideal room for your stay</p>
          <button
            onClick={requestReservation}
            className="btn-primary w-full py-2 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i> New Reservation
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-utensils text-orange-500 text-2xl"></i>
            <h3 className="font-bold text-gray-800">Order Food</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Browse and order from our menu</p>
          <button
            onClick={() => setCartOpen(true)}
            className="btn-primary w-full py-2 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <i className="fas fa-shopping-cart"></i> Order Now
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-exclamation-circle text-orange-500 text-2xl"></i>
            <h3 className="font-bold text-gray-800">Raise Complaint</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Report any issues or concerns</p>
          <button
            onClick={() => setComplaintOpen(true)}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <i className="fas fa-flag"></i> Report Issue
          </button>
        </div>
      </div>

      {/* Rooms Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-700">
        <i className="fas fa-door-open mr-2 text-indigo-600"></i>Available Rooms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <div className="col-span-3 flex justify-center py-12">
            <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl"></i>
          </div>
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <Card key={room.id}>
              <p className="text-lg font-bold">{room.number}</p>
              <p className="text-gray-600 capitalize">
                {room.room_type} • {room.ac}
              </p>
              <p className="text-blue-600 font-semibold text-lg mt-2">
                ₹{room.tariff}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No rooms available.</p>
        )}
      </div>

      {/* Food Menu Section */}
      <h2 className="text-2xl font-semibold mb-3 text-gray-700">
        <i className="fas fa-utensils mr-2 text-orange-500"></i>Food Menu
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12">
            <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl"></i>
          </div>
        ) : menu.length > 0 ? (
          menu.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onOrder={(it) => {
                try {
                  const cur = JSON.parse(localStorage.getItem("cart") || "[]");
                  // simple cart structure: [{id, name, price, quantity}]
                  const existing = cur.find((c) => c.id === it.id);
                  if (existing) {
                    existing.quantity = (existing.quantity || 1) + 1;
                  } else {
                    cur.push({ id: it.id, name: it.name, price: it.price, quantity: 1 });
                  }
                  localStorage.setItem("cart", JSON.stringify(cur));
                  setCartOpen(true);
                } catch (e) {
                  console.error(e);
                  alert("Failed to add to cart");
                }
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">No food items available.</p>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ComplaintModal
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        onComplaintSubmitted={load}
      />
    </Layout>
  );
}

