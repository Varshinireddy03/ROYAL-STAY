import React, { useEffect, useState } from "react";
import api from "../api";

export default function CartDrawer({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (open) {
      load();
      loadLocalCart();
    }
  }, [open]);

  async function load() {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data.filter((o) => o.status !== "DELIVERED"));
    } catch (e) {
      // silently ignore if not authenticated or other errors
      setOrders([]);
    }
  }

  function loadLocalCart() {
    try {
      const raw = localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      setCartItems(parsed || []);
    } catch (e) {
      setCartItems([]);
    }
  }

  function clearLocalCart() {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
  }

  function updateLocalQuantity(id, delta) {
    try {
      const raw = localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      const idx = parsed.findIndex((c) => c.id === id);
      if (idx === -1) return;
      parsed[idx].quantity = Math.max(1, (parsed[idx].quantity || 1) + delta);
      localStorage.setItem("cart", JSON.stringify(parsed));
      setCartItems(parsed);
    } catch (e) {
      console.error(e);
    }
  }

  function calculateTotal() {
    return cartItems.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
  }

  async function placeOrder() {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      // find an active reservation belonging to the current user (CONFIRMED or CHECKED_IN)
      const meRes = await api.get('/users/me/');
      const myId = meRes.data.id;
      console.log('Current user ID:', myId);
      
      const resvRes = await api.get('/reservations/');
      console.log('All reservations:', resvRes.data);
      
      const myRes = resvRes.data.find(r => r.guest?.id === myId && (r.status === 'CONFIRMED' || r.status === 'CHECKED_IN'));
      console.log('Matching reservation:', myRes);
      
      if (!myRes) {
        alert('No active reservation found. Please request/confirm a reservation before placing orders.');
        return;
      }

      const payload = {
        reservation: myRes.id,
        items: cartItems.map(i => ({ item_id: i.id, quantity: i.quantity }))
      };
      console.log('Order payload:', payload);

      const orderRes = await api.post('/orders/', payload);
      console.log('Order created:', orderRes.data);
      alert('Order placed successfully');
      clearLocalCart();
      load();
      onClose();
    } catch (err) {
      console.error('Place order error:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to place order: ${err.response?.data?.detail || err.message || 'Unknown error'}`);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-96 bg-white shadow-xl p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Cart & Orders</h3>
          <div className="flex items-center gap-2">
            <button onClick={clearLocalCart} className="text-sm text-red-500">Clear Cart</button>
            <button onClick={onClose} className="text-gray-500">Close</button>
          </div>
        </div>

        {/* Local Cart Items */}
        <div className="mb-4">
          <h4 className="font-medium">Cart</h4>
          {cartItems.length === 0 && <p className="text-gray-500">No items in cart</p>}
          {cartItems.map((i) => (
            <div key={i.id} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-sm text-gray-600">₹{i.price} each</div>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <button onClick={() => updateLocalQuantity(i.id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <div className="px-3">{i.quantity}</div>
                  <button onClick={() => updateLocalQuantity(i.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
                <div className="text-blue-600 font-bold">₹{((Number(i.price) || 0) * (i.quantity || 1)).toFixed(2)}</div>
              </div>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="mt-3 p-3 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium">Subtotal</div>
                <div className="font-bold text-lg">₹{calculateTotal().toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={placeOrder} className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Place Order</button>
                <button onClick={clearLocalCart} className="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded">Clear</button>
              </div>
            </div>
          )}
        </div>

        {/* Server Orders (for staff/manager) */}
        <div>
          <h4 className="font-medium">Active Orders</h4>
          {orders.length === 0 && <p className="text-gray-500">No active orders</p>}
          {orders.map((o) => (
            <div key={o.id} className="border p-3 rounded mb-3">
              <div>ID #{o.id} — {o.status}</div>
              <ul className="ml-4 list-disc text-sm">
                {o.items.map((i) => (
                  <li key={i.id}>{i.item.name} × {i.quantity}</li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                {o.status === "PLACED" && <button onClick={async ()=>{await api.patch(`/orders/${o.id}/`,{status:"PREPARING"}); load();}} className="px-2 py-1 bg-yellow-400 rounded">Preparing</button>}
                {o.status === "PREPARING" && <button onClick={async ()=>{await api.patch(`/orders/${o.id}/`,{status:"READY"}); load();}} className="px-2 py-1 bg-blue-500 text-white rounded">Ready</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" onClick={onClose} />
    </div>
  );
}

