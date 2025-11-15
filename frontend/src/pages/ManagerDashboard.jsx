import React, { useEffect, useState } from "react";
import api from "../api";

export default function ManagerDashboard() {
  const [revenue, setRevenue] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const rev = await api.get("/report/revenue/");
      setRevenue(rev.data);

      const comp = await api.get("/complaints/");
      setComplaints(comp.data);

      const users = await api.get("/users/");
      setStaff(users.data.filter((u) => u.role === "STAFF"));
    } catch (err) {
      console.error(err);
      alert("Error loading data");
    }
  }

  async function assignComplaint(complaintId, staffId) {
    try {
      await api.post(`/complaints/${complaintId}/assign/`, {
        staff_id: staffId,
      });
      alert("Complaint assigned");
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Unable to assign");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="gradient-header text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
              <p className="text-lg opacity-90">Monitor revenue, occupancy, and guest complaints</p>
            </div>
            <button
              onClick={loadAll}
              className="btn-secondary px-6 py-2 flex items-center gap-2"
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-indigo-600">
                  {revenue && revenue.revenue !== undefined ? `₹${revenue.revenue.toLocaleString()}` : <i className="fas fa-spinner fa-spin"></i>}
                </h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <i className="fas fa-chart-line text-indigo-600 text-2xl"></i>
              </div>
            </div>
            <p className="text-gray-500 text-xs">Last 30 days performance</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Occupancy Rate</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {revenue && revenue.occupied_rooms !== undefined && revenue.total_rooms ? `${Math.round((revenue.occupied_rooms / revenue.total_rooms) * 100)}%` : <i className="fas fa-spinner fa-spin"></i>}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <i className="fas fa-building text-green-600 text-2xl"></i>
              </div>
            </div>
            <p className="text-gray-500 text-xs">{revenue && revenue.occupied_rooms !== undefined ? `${revenue.occupied_rooms}/${revenue.total_rooms} rooms occupied` : "Loading..."}</p>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <i className="fas fa-exclamation-circle text-orange-500 text-2xl"></i>
            <h2 className="section-title mb-0">Guest Complaints</h2>
            <span className="badge-danger px-3 py-1 rounded-full text-sm font-semibold">
              {complaints.filter(c => c.status === "OPEN").length} Open
            </span>
          </div>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <p className="text-gray-600 text-lg font-semibold">No complaints yet</p>
              <p className="text-gray-500">All guests are satisfied!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{c.subject}</h4>
                      <p className="text-gray-600 text-sm mt-1">Posted by: <span className="font-semibold">{c.posted_by.username}</span></p>
                    </div>
                    <span className={c.status === "OPEN" ? "badge-warning" : "badge-success"}>
                      {c.status}
                    </span>
                  </div>

                  {c.status === "OPEN" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <select
                        id={`staff-${c.id}`}
                        className="input-field flex-1"
                        defaultValue=""
                      >
                        <option value="">Select staff member to assign...</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.username}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          const staffId = document.getElementById(`staff-${c.id}`).value;
                          if (!staffId) return alert("Please select a staff member");
                          assignComplaint(c.id, staffId);
                        }}
                        className="btn-primary px-6 py-2 whitespace-nowrap"
                      >
                        <i className="fas fa-arrow-right"></i> Assign
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

