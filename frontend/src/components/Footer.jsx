import React from "react";

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
              <a href="#" className="hover:text-yellow-300 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300 transition">
                Menu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300 transition">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-sm text-white/80">Sydney, Australia</p>
          <p className="text-sm text-white/80">Phone: +61 123 456 789</p>
          <p className="text-sm text-white/80">Email: hello@4donkeysbar.com</p>
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
            <a href="#" className="hover:text-yellow-300 transition">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="hover:text-yellow-300 transition">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zM5 10c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
