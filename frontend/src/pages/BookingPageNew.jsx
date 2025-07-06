import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ReserveVenuePage from "./ReserveVenuePage";
import Popup from "@/components/Popup";
import EventLogoButton from "@/components/EventLogoButton";

const BookingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const currentEvent = events[slideIndex];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <NavBar forceSolid={true} />

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book with Us
            </h1>
            <p className="text-lg text-gray-600">
              Book our venue for your special events!
            </p>
          </div>

          <ReserveVenuePage />
        </motion.div>
      </div>
      <div className="hidden md:block">
        <EventLogoButton onClick={() => setShowPopup(true)} />
        <Popup show={showPopup} onClose={() => setShowPopup(false)} />
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
