import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import LandingPage from "./pages/LandingPage";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPageNew";
import MenuPage from "./pages/MenuPage";
import GalleryPage from "./pages/GalleryPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import MoreGallery from "./pages/[section]";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:section" element={<MoreGallery />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
