import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Heart, X } from "lucide-react"; // Import X icon
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance.js";
import Spinner from "@/components/Spinner";

const EventCard = ({ event, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const spotsLeft = event.capacity - event.rsvpCount;
  const isAlmostFull = spotsLeft <= event.capacity * 0.2;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => onClick(event)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-transform"
    >
      <div className="relative group overflow-hidden">
        <img
          src={
            imageError
              ? "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"
              : event.posterImage?.imageUrl
          }
          alt={event.title}
          onError={() => setImageError(true)}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-[#2D6A4F] text-white text-sm font-medium rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>

        <div className="space-y-3 mb-4 text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-2">{event.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold text-gray-900">
            ${event.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      const data = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setEvents(data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Add click outside functionality
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    const handleOutsideClick = (event) => {
      if (selectedEvent && !event.target.closest(".modal-content")) {
        setSelectedEvent(null);
      }
    };

    if (selectedEvent) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [selectedEvent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar forceSolid={true} />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-gray-600">
              Join us for exciting events, live music, and unforgettable
              experiences
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Spinner color="green" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={setSelectedEvent}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No upcoming events found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content bg-white rounded-2xl shadow-lg p-6 max-w-2xl w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-300 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              <img
                src={selectedEvent.posterImage?.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
              <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
              <div className="space-y-2 text-gray-600">
                <div>
                  <strong>Date:</strong> {selectedEvent.date}
                </div>
                <div>
                  <strong>Time:</strong> {selectedEvent.time}
                </div>
                <div>
                  <strong>Location:</strong> {selectedEvent.location}
                </div>
                <div>
                  <strong>Price:</strong> ${selectedEvent.price}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default EventsPage;
