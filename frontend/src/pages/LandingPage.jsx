import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";

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

      {/* Sticky Vertical Center Right Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 left-20 -translate-y-1/2 z-50 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <span>See Daily Special</span>
      </button>

      {/* Centered Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
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
                className="absolute top-4 right-4 text-gray-700 hover:text-black z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Event Poster Content */}
              <img
                src="/images/section.jpg"
                alt="Today's Event"
                className="w-full h-[600px] object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-[#2D6A4F]">
                  🎶 Live Music Tonight
                </h2>
                <p className="text-base text-gray-700">
                  Join us at 4 Donkeys Bar for an unforgettable jazz night.
                  Enjoy signature cocktails and a live band from 7PM till late.
                  Be there early to grab your favorite spot!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
