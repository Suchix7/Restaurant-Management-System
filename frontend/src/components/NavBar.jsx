import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ forceSolid = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled || forceSolid ? "bg-[#2D6A4F] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Left */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/logo.jpg"
              alt="4 Donkeys"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Right */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/" ? "border-b-2 border-white pb-1" : ""
            }`}
          >
            HOME
          </Link>
          <Link
            to="/reserve"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/reserve"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            RESERVE
          </Link>
          <Link
            to="/menu"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/menu"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            MENU
          </Link>
          <Link
            to="/gallery"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/gallery"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            GALLERY
          </Link>
          <Link
            to="/events"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/events"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            EVENTS
          </Link>
          <Link
            to="/reserve-venue"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/reserve-venue"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            VENUE
          </Link>
          <Link
            to="/contact"
            className={`text-white hover:text-gray-200 ${
              location.pathname === "/contact"
                ? "border-b-2 border-white pb-1"
                : ""
            }`}
          >
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
