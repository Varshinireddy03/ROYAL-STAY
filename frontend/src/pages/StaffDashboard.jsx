import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import api from "../api";

export default function StaffDashboard() {
  const [assigned, setAssigned] = useState([]);
  const [orders, setOrders] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      // Get current staff user
      const user = (await api.get("/users/me/")).data;
      setMe(user);

      // Complaints assigned to this staff
      const allComplaints = (await api.get("/complaints/")).data;
      setAssigned(allComplaints.filter((c) => c.assigned_to?.id === user.id));

      // All food orders
      setOrders((await api.get("/orders/")).data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    }
  }

  async function resolveComplaint(id) {
    try {
      await api.patch(`/complaints/${id}/`, { status: "RESOLVED" });
      alert("Complaint resolved");
      init();
    } catch {
      alert("Unable to resolve complaint");
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await api.patch(`/orders/${id}/`, { status });
      alert("Order updated");
      init();
    } catch {
      alert("Unable to update order");
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="gradient-header text-white rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
                <p className="text-lg opacity-90">Handle complaints and manage food orders</p>
              </div>
              <button
                onClick={init}
                className="btn-secondary px-6 py-2 flex items-center gap-2"
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>

          {/* Assigned Complaints Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <i className="fas fa-exclamation-circle text-orange-500 text-2xl"></i>
                <h2 className="section-title mb-0">Assigned Complaints</h2>
                <span className="badge-warning px-3 py-1 rounded-full text-sm font-semibold">
                  {assigned.length}
                </span>
              </div>

              {assigned.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assigned.map((c) => (
                    <div
                      key={c.id}
                      className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-lg">{c.subject}</h3>
                        <span className={c.status === "RESOLVED" ? "badge-success" : "badge-warning"}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{c.detail}</p>

                      {c.status !== "RESOLVED" && (
                        <button
                          onClick={() => resolveComplaint(c.id)}
                          className="btn-primary w-full py-2 flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-check-circle"></i> Mark as Resolved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                  <p className="text-gray-600 text-lg font-semibold">No complaints assigned</p>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>

          {/* Food Orders Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <i className="fas fa-utensils text-indigo-600 text-2xl"></i>
                <h2 className="section-title mb-0">Food Orders</h2>
                <span className="badge-success px-3 py-1 rounded-full text-sm font-semibold">
                  {orders.length}
                </span>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition hover:border-indigo-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-800">Order #{o.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          o.status === "PLACED" ? "badge-warning" :
                          o.status === "PREPARING" ? "bg-yellow-100 text-yellow-800" :
                          o.status === "READY" ? "bg-blue-100 text-blue-800" :
                          "badge-success"
                        }`}>
                          {o.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-600 text-sm font-semibold mb-2">Items:</p>
                        <ul className="space-y-1">
                          {o.items.map((i) => (
                            <li key={i.id} className="text-gray-700 flex items-center gap-2">
                              <i className="fas fa-check text-indigo-600"></i>
                              <span>{i.item.name}</span>
                              <span className="text-gray-500 text-sm">× {i.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Order Status Workflow */}
                      <div className="flex gap-2 flex-wrap">
                        {o.status === "PLACED" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "PREPARING")}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                          >
                            <i className="fas fa-fire"></i> Start Preparing
                          </button>
                        )}

                        {o.status === "PREPARING" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "READY")}
                            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                          >
                            <i className="fas fa-check"></i> Mark Ready
                          </button>
                        )}

                        {o.status === "READY" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "DELIVERED")}
                            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                          >
                            <i className="fas fa-truck"></i> Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
                  <p className="text-gray-600 text-lg font-semibold">No food orders yet</p>
                  <p className="text-gray-500">Waiting for orders to arrive...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

