import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Heart, Share2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance.js";
import Popup from "@/components/Popup";
import EventLogoButton from "@/components/EventLogoButton";
import Spinner from "@/components/Spinner";

const EventCard = ({ event, onRSVP }) => {
  const [isInterested, setIsInterested] = useState(false);
  const [imageError, setImageError] = useState(false);
  const spotsLeft = event.capacity - event.rsvpCount;
  const isAlmostFull = spotsLeft <= event.capacity * 0.2; // 20% or less spots remaining

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: `Check out ${event.title} at 4 Donkeys Bar!`,
        url: window.location.href,
      });
    } catch (error) {
      toast.error("Sharing failed. Try copying the URL instead.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
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
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsInterested(!isInterested)}
            className={`p-2 rounded-full ${
              isInterested ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
            } backdrop-blur-sm transition-colors duration-300`}
          >
            <Heart
              className={`w-5 h-5 ${
                isInterested ? "text-white fill-current" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-[#2D6A4F] text-white text-sm font-medium rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{event.description}</p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-gray-900">
            $ {event.price}
          </span>
          {isAlmostFull && (
            <span className="text-sm text-red-500 font-medium">
              Only {spotsLeft} spots left
            </span>
          )}
        </div>

        <button
          onClick={() => onRSVP(event)}
          className="w-full py-3 px-4 bg-[#2D6A4F] text-white font-medium rounded-lg hover:bg-[#235340] transition-colors duration-300 flex items-center justify-center gap-2"
        >
          RSVP Now
        </button>
      </div>
    </motion.div>
  );
};

const EventsPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      console.log("Fetched events:", response.data);
      const data = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false); // ✅ add this
    }
  };

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
      `Thanks for your interest in ${event.title}! We'll be in touch soon.`
    );
  };

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
                  <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
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
      {/* Show only on medium (md) and up */}
      <div className="hidden md:block">
        <EventLogoButton onClick={() => setShowPopup(true)} />
        <Popup show={showPopup} onClose={() => setShowPopup(false)} />
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
