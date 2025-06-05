import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Heart, Share2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

// Sample events data - in a real app, this would come from an API
const events = [
  {
    id: 1,
    title: "Jazz Night with The Blue Notes",
    date: "2024-04-15",
    time: "20:00",
    description:
      "Join us for an evening of smooth jazz and signature cocktails. The Blue Notes bring their unique blend of classic and contemporary jazz to our intimate venue.",
    image: "/images/events/jazz-night.jpg",
    location: "Main Bar Area",
    category: "Music",
    price: "Free Entry",
    capacity: 120,
    rsvpCount: 85,
  },
  {
    id: 2,
    title: "Wine Tasting Experience",
    date: "2024-04-20",
    time: "18:30",
    description:
      "Discover exceptional wines from around the world, paired with carefully selected appetizers. Our sommelier will guide you through six premium wines.",
    image: "/images/events/wine-tasting.jpg",
    location: "Private Tasting Room",
    category: "Tasting",
    price: "$45 per person",
    capacity: 30,
    rsvpCount: 22,
  },
  {
    id: 3,
    title: "Cocktail Masterclass",
    date: "2024-04-25",
    time: "19:00",
    description:
      "Learn the art of mixology from our expert bartenders. Create three signature cocktails and take home recipes to impress your friends.",
    image: "/images/events/cocktail-class.jpg",
    location: "Bar Workshop Area",
    category: "Workshop",
    price: "$65 per person",
    capacity: 20,
    rsvpCount: 12,
  },
  {
    id: 4,
    title: "Saturday Night Live Band",
    date: "2024-04-27",
    time: "21:00",
    description:
      "Experience the electrifying performance of local favorite 'The Night Owls' as they bring their unique blend of rock and soul to our stage.",
    image: "/images/events/live-band.jpg",
    location: "Main Stage",
    category: "Music",
    price: "$10 Cover",
    capacity: 150,
    rsvpCount: 98,
  },
];

const EventCard = ({ event, onRSVP }) => {
  const [isInterested, setIsInterested] = useState(false);
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
      <div className="relative group">
        <img
          src={event.image}
          alt={event.title}
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
            {event.price}
          </span>
          {isAlmostFull && (
            <span className="text-sm text-red-500 font-medium">
              Only {spotsLeft} spots left!
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
  const handleRSVP = (event) => {
    // In a real app, this would make an API call to handle the RSVP
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
