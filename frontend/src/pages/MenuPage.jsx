import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axiosInstance from "@/lib/axiosInstance"; // Adjust the import based on your project structure

import EventLogoButton from "@/components/EventLogoButton";
import Spinner from "@/components/Spinner"; // Adjust the import based on your project structure
const MenuPage = () => {
;
  const [events, setEvents] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const currentEvent = events[slideIndex];

  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [menuPages, setMenuPages] = useState([]);

  const fetchMenu = async () => {
    try {
      const response = await axiosInstance.get("/menu");
      const data = response.data.map((item, index) => ({
        id: index + 1,
        title: item.category,
        image: item.imageUrl,
      }));
      console.log(data);
      setMenuPages(data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % menuPages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + menuPages.length) % menuPages.length);
  };

  const handleKeyPress = (e) => {
    if (e.key === "ArrowRight") nextPage();
    if (e.key === "ArrowLeft") prevPage();
    if (e.key === "Escape") setIsZoomed(false);
  };

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <NavBar forceSolid={true} />

      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(45, 106, 79, 0.08), rgba(45, 106, 79, 0.15)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 16.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 18c-7.5 0-13.5-6-13.5-13.5S22.5 7.5 30 7.5s13.5 6 13.5 13.5S37.5 34.5 30 34.5zm0-27C19.5 7.5 11.25 15.75 11.25 26.25s8.25 18.75 18.75 18.75 18.75-8.25 18.75-18.75S40.5 7.5 30 7.5z' fill='%232D6A4F' fill-opacity='0.1'/%3E%3C/svg%3E")
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-xl text-gray-600">
              Use arrow keys or buttons to navigate through our menu
            </p>
          </div>

          {/* Menu Navigation */}
          {/* <div className="flex justify-center gap-4 mb-8">
            {menuPages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(index)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === index
                    ? "bg-[#2D6A4F] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div> */}

          {/* Menu Display */}
          {menuPages.length > 0 ? (
            <>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-[4/3] bg-gray-100"
                  >
                    <img
                      src={menuPages[currentPage].image}
                      alt={menuPages[currentPage].title}
                      className="w-full h-full object-contain"
                    />

                    {/* Zoom Button */}
                    <button
                      onClick={() => setIsZoomed(true)}
                      className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                    >
                      <ZoomIn className="w-6 h-6" />
                    </button>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevPage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Page Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {menuPages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? "bg-[#2D6A4F] w-6"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* Page Title */}
              <div className="text-center mt-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {menuPages[currentPage].title}
                </h2>
                <p className="text-gray-600 mt-2">
                  Page {currentPage + 1} of {menuPages.length}
                </p>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
     
      {/* Fullscreen Zoom View */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={menuPages[currentPage].image}
              alt={menuPages[currentPage].title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
