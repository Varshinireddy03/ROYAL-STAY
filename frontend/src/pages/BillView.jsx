import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

export default function BillView() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = (await api.get("/bills/")).data;
      setBills(data);
    } catch (err) {
      console.error("Error loading bills:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="gradient-header text-white rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Bills</h1>
                <p className="text-lg opacity-90">View and track all your stay charges</p>
              </div>
              <button
                onClick={load}
                className="btn-secondary px-6 py-2 flex items-center gap-2"
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-indigo-600 text-5xl mb-4"></i>
                <p className="text-gray-600 text-lg">Loading bills...</p>
              </div>
            </div>
          ) : bills.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
              <p className="text-gray-600 text-lg font-semibold">No bills yet</p>
              <p className="text-gray-500">Your bills will appear here after your stay</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-indigo-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Reservation ID */}
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <i className="fas fa-receipt text-indigo-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Reservation</p>
                        <p className="text-lg font-bold text-gray-800">#{b.reservation?.id}</p>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <i className="fas fa-coins text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Amount</p>
                        <p className="text-lg font-bold text-green-600">₹{b.total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${b.paid ? "bg-green-100" : "bg-yellow-100"}`}>
                        <i className={`fas ${b.paid ? "fa-check-circle text-green-600" : "fa-clock text-yellow-600"} text-xl`}></i>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Payment Status</p>
                        <p className={`text-lg font-bold ${b.paid ? "text-green-600" : "text-yellow-600"}`}>
                          {b.paid ? "Paid" : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Payment Badge */}
                    <div className="flex items-center justify-end">
                      {b.paid ? (
                        <span className="badge-success px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                          <i className="fas fa-verified"></i> Verified
                        </span>
                      ) : (
                        <span className="badge-warning px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                          <i className="fas fa-hourglass"></i> Awaiting Payment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button className="flex-1 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition flex items-center justify-center gap-2">
                      <i className="fas fa-download"></i> Download Receipt
                    </button>
                    {!b.paid && (
                      <button className="flex-1 btn-primary px-4 py-2 font-semibold flex items-center justify-center gap-2">
                        <i className="fas fa-credit-card"></i> Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

