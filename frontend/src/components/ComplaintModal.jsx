import React, { useState } from "react";
import Modal from "./Modal";
import api from "../api";


import { useEffect } from "react";

export default function ComplaintModal({ open, onClose, onComplaintSubmitted }) {
  const [formData, setFormData] = useState({
    subject: "",
    detail: "",
    reservation: "",
  });
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);

  // Load reservations when modal opens
  useEffect(() => {
    if (open) {
      loadReservations();
    }
  }, [open]);

  async function loadReservations() {
    try {
      setLoadingRes(true);
      const res = await api.get("/reservations/");
      // Filter for CONFIRMED or CHECKED_IN reservations
      const active = res.data.filter(
        (r) => r.status === "CONFIRMED" || r.status === "CHECKED_IN"
      );
      setReservations(active);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoadingRes(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.detail.trim() || !formData.reservation) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/complaints/", {
        reservation: parseInt(formData.reservation),
        subject: formData.subject,
        detail: formData.detail,
      });
      alert("Complaint submitted successfully!");
      setFormData({ subject: "", detail: "", reservation: "" });
      onClose();
      if (onComplaintSubmitted) onComplaintSubmitted();
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <i className="fas fa-exclamation-triangle text-orange-500 text-2xl"></i>
          <h2 className="text-2xl font-bold text-gray-800">Raise Complaint</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reservation Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-calendar-check mr-2 text-indigo-600"></i>
              Select Reservation
            </label>
            {loadingRes ? (
              <p className="text-gray-500 text-sm">Loading reservations...</p>
            ) : reservations.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No active reservations found. Please make a reservation first.
              </p>
            ) : (
              <select
                value={formData.reservation}
                onChange={(e) =>
                  setFormData({ ...formData, reservation: e.target.value })
                }
                className="input-field w-full"
                required
              >
                <option value="">-- Select a reservation --</option>
                {reservations.map((res) => (
                  <option key={res.id} value={res.id}>
                    Reservation #{res.id} - Room {res.room || "TBD"} ({res.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-heading mr-2 text-indigo-600"></i>
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g., Noisy neighbors, AC not working"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="input-field w-full"
              required
            />
          </div>

          {/* Detail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-align-left mr-2 text-indigo-600"></i>
              Complaint Details
            </label>
            <textarea
              placeholder="Please describe the issue in detail..."
              value={formData.detail}
              onChange={(e) =>
                setFormData({ ...formData, detail: e.target.value })
              }
              rows="4"
              className="input-field w-full resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reservations.length === 0}
              className="flex-1 btn-primary px-4 py-2 font-semibold flex items-center justify-center gap-2"
            >
              <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-send"}></i>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

