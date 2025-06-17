import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Martini } from "lucide-react";

import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ContentSection from "@/components/ContentSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Gallery from "@/components/Gallery";
import BrandSection from "@/components/BrandSection";
import Footer from "@/components/Footer";

function LandingPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  // Show popup once on first load
  // Show popup after 5 seconds on first load
  useEffect(() => {
    const seen = sessionStorage.getItem("seen-event-popup");
    if (!seen) {
      const timeout = setTimeout(() => {
        setShowPopup(true);
        setHasSeenPopup(true);
        sessionStorage.setItem("seen-event-popup", "true");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <NavBar />
      <Hero />
      <ContentSection />
      <Gallery />
      <BrandSection />
      <Footer />

      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 left-4 md:left-20 md:-translate-y-1/2 z-50 font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        style={{
          clipPath:
            "polygon(50% 0%, 90% 0%, 60% 40%, 60% 65%, 70% 80%, 30% 80%, 40% 65%, 40% 40%, 10% 0%)",
          width: "80px",
          height: "120px",
          background: `
      linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1)),
      radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.4), transparent),
      rgba(255, 255, 255, 0.05)
    `,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          borderRadius: "14px",
          color: "#ffffff",
        }}
      ></button>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:p-0"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-hidden border border-gray-300"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 z-10 md:top-4 md:right-4 bg-black/50 hover:bg-black/70 md:bg-transparent md:hover:bg-transparent p-2 md:p-0 rounded-full md:rounded-none transition-colors"
              >
                <X className="w-5 h-5 text-white md:text-gray-700 md:hover:text-black" />
              </button>

              {/* Mobile View */}
              <div className="md:hidden">
                <div className="flex flex-col">
                  <img
                    src="/images/section.jpg"
                    alt="Today's Event"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-bold mb-3 text-[#2D6A4F]">
                      🎶 Live Music Tonight
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Join us at 4 Donkeys Bar for an unforgettable jazz night.
                      Enjoy signature cocktails and a live band from 7PM till
                      late. Be there early to grab your favorite spot!
                    </p>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="mt-4 w-full bg-[#2D6A4F] text-white py-3 rounded-lg font-semibold hover:bg-[#235040] transition-colors"
                    >
                      Reserve Your Spot
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <img
                  src="/images/section.jpg"
                  alt="Today's Event"
                  className="w-full h-[600px] object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 text-[#2D6A4F]">
                    🎶 Live Music Tonight!
                  </h2>
                  <p className="text-base text-gray-700 mb-4">
                    Join us at 4 Donkeys Bar for an unforgettable jazz night.
                    Enjoy signature cocktails and a live band from 7PM till
                    late. Be there early to grab your favorite spot!
                  </p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-[#2D6A4F] text-white py-3 rounded-lg font-semibold hover:bg-[#235040] transition-colors"
                  >
                    Reserve Your Spot
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
