import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2D6A4F] text-white pt-16">
      {/* Newsletter Signup */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
        <p className="mb-6 text-sm">
          Be the first to hear about upcoming events, specials, and more.
        </p>

        <form method="POST" action="http://localhost:3000/api/subscribe">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">
              Subscribe
            </button>
          </div>
        </form>
      </div>

      {/* Info Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 border-t border-white/20">
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-yellow-300 transition">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-yellow-300 transition">
                Events
              </Link>
            </li>
            <li>
              <Link to="/reserve" className="hover:text-yellow-300 transition">
                Reserve
              </Link>
            </li>
            <li>
              <Link
                to="/reserve-venue"
                className="hover:text-yellow-300 transition"
              >
                Venue
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-yellow-300 transition">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yellow-300 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-sm text-white/80">Sydney, Australia</p>
          <p className="text-sm text-white/80">
            <a
              href="tel:+61123456789"
              className="hover:text-yellow-300 transition"
            >
              Phone: +61 123 456 789
            </a>
          </p>
          <p className="text-sm text-white/80">
            <a
              href="mailto:hello@4donkeysbar.com"
              className="hover:text-yellow-300 transition"
            >
              Email: hello@4donkeysbar.com
            </a>
          </p>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li>Mon–Thu: 4PM – 11PM</li>
            <li>Fri–Sat: 4PM – 1AM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>

      {/* Bottom Social Row */}
      <div className="border-t border-white/20 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center flex-col sm:flex-row">
          <p className="text-sm text-white/60 mb-2 sm:mb-0">
            Proudly crafted by 4 Donkeys Bar
          </p>

          <div className="flex gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
