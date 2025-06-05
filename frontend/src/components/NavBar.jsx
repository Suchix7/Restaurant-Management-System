import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = ({ forceSolid = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const menuItems = [
    { path: "/", label: "HOME" },
    { path: "/reserve", label: "RESERVE" },
    { path: "/menu", label: "MENU" },
    { path: "/gallery", label: "GALLERY" },
    { path: "/events", label: "EVENTS" },
    { path: "/reserve-venue", label: "VENUE" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled || forceSolid || isOpen
          ? "bg-[#2D6A4F] shadow-md"
          : "bg-transparent"
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-white hover:text-gray-200 transition-all ${
                location.pathname === item.path
                  ? "border-b-2 border-white pb-1"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 hover:bg-[#3d8a68] rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#2D6A4F] overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block text-white hover:bg-[#3d8a68] px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path ? "bg-[#3d8a68]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
