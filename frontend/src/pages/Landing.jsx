import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";

export default function Landing() {
  // sample highlighted rooms (these will also be pulled from API on real site)
  const featured = [
    { id: 1, number: "101", room_type: "DELuxe", ac: "AC", tariff: 2500, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60" },
    { id: 2, number: "202", room_type: "Double", ac: "Non-AC", tariff: 1800, img: "https://images.unsplash.com/photo-1542314831-070cd1dbfeec?auto=format&fit=crop&w=1200&q=60" },
    { id: 3, number: "305", room_type: "Suite", ac: "AC", tariff: 4200, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=60" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
              <i className="fas fa-crown text-yellow-300 mr-3"></i>Experience Royal Comfort
            </h1>
            <p className="text-xl md:text-2xl opacity-95 mb-2">at RoyalStay</p>
            <p className="text-lg opacity-90 mb-8">
              Book rooms, order food, manage complaints, and pay bills — all in one luxurious platform
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/login"
                className="btn-primary px-8 py-3 text-lg font-bold flex items-center gap-2"
              >
                <i className="fas fa-sign-in-alt"></i> Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white/20 backdrop-blur border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition flex items-center gap-2"
              >
                <i className="fas fa-user-plus"></i> Create Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 w-full pb-12">
        {/* Featured Rooms Section */}
        <section className="-mt-20 relative z-10 mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <i className="fas fa-door-open text-indigo-600 text-3xl"></i>
              <h2 className="text-3xl font-bold text-gray-800">Featured Rooms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose RoyalStay Section */}
        <section className="mb-16">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              <i className="fas fa-star text-yellow-400 mr-3"></i>Why Choose RoyalStay?
            </h2>
            <p className="text-gray-600 text-lg">Experience excellence in hospitality with our premium services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-clock text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock food and room service whenever you need. We're always here for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-receipt text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Transparent Billing</h3>
              <p className="text-gray-600 leading-relaxed">
                View itemized bills instantly and pay securely without any hidden charges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-calendar-alt text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Reserve your perfect room in seconds with our intuitive date selector and filters.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-headset text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Post complaints, get instant support, and track resolution in real-time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-utensils text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Dining Delights</h3>
              <p className="text-gray-600 leading-relaxed">
                Order from our curated menu and enjoy delicious meals delivered to your room.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-red-100 to-red-200 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <i className="fas fa-shield-alt text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-level security and privacy measures.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-12 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Royal Experience?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced luxury at RoyalStay
          </p>
          <Link
            to="/register"
            className="btn-primary px-10 py-3 text-lg font-bold inline-flex items-center gap-2"
          >
            <i className="fas fa-rocket"></i> Get Started Now
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

