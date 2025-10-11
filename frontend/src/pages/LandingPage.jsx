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
import toast from "react-hot-toast";
import Popup from "@/components/Popup";
import EventLogoButton from "@/components/EventLogoButton";
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

  const [slideIndex, setSlideIndex] = useState(0);
  const currentEvent = events[slideIndex];

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
      {/* <BrandSection /> */}
      <Footer />

      {/* Cocktail Floating Button */}
      <EventLogoButton onClick={() => setShowPopup(true)} />

      {/* Popup Component */}
      <Popup show={showPopup} onClose={() => setShowPopup(false)} />
      {/* Popup Modal */}
    </div>
  );
}

export default LandingPage;
