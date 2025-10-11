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
    // { path: "/booking", label: "BOOKING" },
    {
      path: "https://www.opentable.com.au/booking/restref/availability?lang=en-AU&correlationId=d49fa09e-516d-4d70-a75c-b841fe12adf7&restRef=264575&otSource=Restaurant%20website",
      label: "RESERVE",
    },
    { path: "/menu", label: "MENU" },
    { path: "/gallery", label: "GALLERY" },
    { path: "/events", label: "EVENTS" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled || forceSolid || isOpen
          ? "bg-[#788A78] shadow-md text-white"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Left */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/logo.png"
              alt="4 Donkeys"
              className={`h-10 w-auto object-contain transition duration-300 `}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {menuItems.map((item) =>
            item.label === "RESERVE" ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#8ed189] transition-all ${
                  location.pathname === item.path ? "border-b-2 pb-1" : ""
                }`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-[#8ed189] transition-all ${
                  location.pathname === item.path ? "border-b-2 pb-1" : ""
                }`}
              >
                {item.label}
              </Link>
            )
          )}
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
              {menuItems.map((item) =>
                item.label === "RESERVE" ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:text-[#8ed189] transition-all ${
                      location.pathname === item.path ? "border-b-2 pb-1" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`hover:text-[#8ed189] transition-all ${
                      location.pathname === item.path ? "border-b-2 pb-1" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
