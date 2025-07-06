// components/Popup.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

function Popup({ show, onClose }) {
  const [events, setEvents] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const currentEvent = events[slideIndex];

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      const data = response.data.map((item) => ({
        id: item._id,
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
    if (show) fetchEvents();
  }, [show]);

  const handleRSVP = async (event) => {
    try {
      const rsvpData = JSON.parse(localStorage.getItem(`rsvp_${event.id}`));
      if (rsvpData && Date.now() - rsvpData.timestamp < 24 * 60 * 60 * 1000) {
        toast.error(
          `You have already RSVP'd for ${event.title} within the last 24 hours.`
        );
        return;
      }
      const response = await axiosInstance.put(`/events/rsvp/${event.id}`);
      console.log("RSVP response:", response.data);
      localStorage.setItem(
        `rsvp_${event.id}`,
        JSON.stringify({ eventId: event.id, timestamp: Date.now() })
      );
      toast.success(
        `Thanks for your interest in ${event.title}! We'll be in touch soon.`
      );
      onClose();
    } catch (error) {
      console.error("RSVP failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () =>
    setSlideIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));

  return (
    <AnimatePresence>
      {show && events.length > 0 && (
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
            <button
              onClick={onClose}
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
                  className="w-full h-72 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-[#2D6A4F]">
                    {currentEvent.title}
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {currentEvent.description}
                  </p>
                  <button
                    onClick={() => handleRSVP(currentEvent)}
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
                  onClick={() => handleRSVP(currentEvent)}
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
  );
}

export default Popup;
