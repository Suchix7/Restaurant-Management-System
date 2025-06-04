import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
];

const swipeConfidenceThreshold = 10000;

const Hero = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const navigate = useNavigate();

  const paginate = (newDirection) => {
    setPage(([prev]) => {
      const newPage =
        (prev + newDirection + heroImages.length) % heroImages.length;
      return [newPage, newDirection];
    });
  };

  const imageIndex = page % heroImages.length;

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div className="relative w-full h-full">
        {/* Background Image with Overlay */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            className="absolute inset-0 w-full h-full"
            custom={direction}
            variants={{
              enter: (dir) => ({
                x: dir > 0 ? 1000 : -1000,
                opacity: 0,
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
              },
              exit: (dir) => ({
                zIndex: 0,
                x: dir > 0 ? -1000 : 1000,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <img
              src={heroImages[imageIndex]}
              alt={`Hero ${imageIndex + 1}`}
              className="w-full h-full object-cover brightness-[.65]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Text & CTAs */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-start p-32 text-white max-w-[1600px] ">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            “Great evenings begin with great spaces.”
          </h1>
          <p className="text-lg mb-6 max-w-xl">
            Discover cocktails, ambience, and unforgettable moments at 4 Donkeys
            Bar.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/reserve")}
              className="bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-200 transition"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => navigate("/reserve-venue")}
              className="bg-transparent border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-black transition"
            >
              Book the Venue
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full"
        >
          <ChevronRight className="text-white" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
              className={`w-3 h-3 rounded-full transition ${
                index === imageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
