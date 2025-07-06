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
import axiosInstance from "@/lib/axiosInstance.js";

function LandingPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);
  const [events, setEvents] = useState([]);
  // Carousel state (moved out of conditional rendering)
  // const events = [
  //   {
  //     title: "🎶 Live Music Tonight",
  //     description:
  //       "Join us at 4 Donkeys Bar for an unforgettable jazz night. Enjoy signature cocktails and a live band from 7PM till late. Be there early to grab your favorite spot!",
  //     image: "/images/section.jpg",
  //   },
  //   {
  //     title: "🍹 Ladies Night Thursday",
  //     description:
  //       "Free cocktails for ladies from 6PM to 9PM. Dance, laugh, and enjoy the best beats from our live DJ all evening!",
  //     image: "/images/cocktail1.jpg",
  //   },
  //   {
  //     title: "🎉 Weekend Bash",
  //     description:
  //       "Don’t miss our weekend bash this Friday! Fire shows, drink specials, and guest DJs to turn the night into a memory.",
  //     image: "/images/cocktail4.jpg",
  //   },
  // ];

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      const data = response.data.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.posterImage.imageUrl,
      }));
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (event) => {
    // In a real app, this would make an API call to handle the RSVP
    try {
      const rsvpData = JSON.parse(localStorage.getItem(`rsvp_${event._id}`));
      if (rsvpData && Date.now() - rsvpData.timestamp < 24 * 60 * 60 * 1000) {
        toast.error(
          `You have already RSVP'd for ${event.title} within the last 24 hours.`
        );
        return;
      }
      const response = await axiosInstance.put(`/events/rsvp/${event._id}`);
      console.log("RSVP response:", response.data);
      localStorage.setItem(
        `rsvp_${event._id}`,
        JSON.stringify({ eventId: event._id, timestamp: Date.now() })
      );
    } catch (error) {
      console.error("RSVP failed:", error);
    }

    toast.success(
      `Thanks for your interest ingi ${event.title}! We'll be in touch soon.`
    );
  };

  const [slideIndex, setSlideIndex] = useState(0);
  const currentEvent = events[slideIndex];

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () =>
    setSlideIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));

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
        className="fixed bottom-6 left-4 md:left-20 md:-translate-y-1/2 z-50 transition-all hover:scale-105 active:scale-95"
        style={{
          width: "160px",
          background: "transparent",
          padding: 0,
          border: "none",
        }}
      >
        <img
          src="/images/cocktaillogo.png"
          alt="Cocktail Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))", // Glow that follows transparency
          }}
        />
      </button>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && events.length > 0 && (
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
                    src={currentEvent.image}
                    alt={currentEvent.title}
                    className="w-full h-72 object-cover" // Increased height
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#2D6A4F]">
                      {currentEvent.title}
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {currentEvent.description}
                    </p>
                    <button
                      onClick={() => {
                        handleRSVP(currentEvent);
                        setShowPopup(false);
                      }}
                      className="mt-5 w-full bg-[#2D6A4F] text-white py-3 rounded-lg font-semibold hover:bg-[#235040] transition-colors"
                    >
                      Reserve Your Spot
                    </button>
                    <div className="flex justify-between mt-5 text-base text-[#2D6A4F] font-semibold">
                      <button onClick={prevSlide}>← Previous</button>
                      <button onClick={nextSlide}>Next →</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="w-full h-[600px] object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 text-[#2D6A4F]">
                    {currentEvent.title}
                  </h2>
                  <p className="text-base text-gray-700 mb-4">
                    {currentEvent.description}
                  </p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-[#2D6A4F] text-white py-3 rounded-lg font-semibold hover:bg-[#235040] transition-colors"
                  >
                    Reserve Your Spot
                  </button>
                  <div className="flex justify-between mt-4 text-[#2D6A4F] font-semibold">
                    <button onClick={prevSlide}>← Previous</button>
                    <button onClick={nextSlide}>Next →</button>
                  </div>
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
