import React, { useState } from "react";
import Modal from "./Modal";
import api from "../api";

export default function ReservationModal({ room, onClose }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reservations/", { checkin_date: checkin, checkout_date: checkout, room: room.id });
      alert("Reservation requested");
      onClose();
    } catch (err) {
      alert("Reservation failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!room) return null;
  return (
    <Modal onClose={onClose} title={`Reserve room ${room.number}`}>
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm">Check-in</label>
        <input type="date" className="w-full p-2 border rounded" value={checkin} onChange={e=>setCheckin(e.target.value)} required />
        <label className="block text-sm">Check-out</label>
        <input type="date" className="w-full p-2 border rounded" value={checkout} onChange={e=>setCheckout(e.target.value)} required />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} type="button" className="px-3 py-2 rounded border">Cancel</button>
          <button disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded">{submitting ? "Booking..." : "Request Reservation"}</button>
        </div>
      </form>
    </Modal>
  );
}

