import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "bg-[#2D6A4F] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Left */}
        <div className="flex items-center">
          <img
            src="/logo.jpg"
            alt="4 Donkeys"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Navigation Right */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#" className="text-white hover:text-gray-200">
            HOME
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            RESERVE
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            MENU
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            GALLERY
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            CONTACT
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
