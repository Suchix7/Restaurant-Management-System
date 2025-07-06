import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance.js";
import Popup from "@/components/Popup";
import EventLogoButton from "@/components/EventLogoButton";
const ContactInfo = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>

    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="bg-[#2D6A4F] p-3 rounded-lg">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
          <p className="text-gray-600">
            123 Bar Street
            <br />
            Sydney, NSW 2000
            <br />
            Australia
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-[#2D6A4F] p-3 rounded-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
          <p className="text-gray-600">+61 2 1234 5678</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-[#2D6A4F] p-3 rounded-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
          <p className="text-gray-600">hello@4donkeysbar.com</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-[#2D6A4F] p-3 rounded-lg">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
          <div className="text-gray-600 space-y-1">
            <p>Monday - Thursday: 4PM - 11PM</p>
            <p>Friday - Saturday: 4PM - 1AM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      const response = await axiosInstance.post("/contact", formData);

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      return;
    }

    // In a real app, this would be an API call
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Send us a Message
      </h3>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors duration-300"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors duration-300"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors duration-300 resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#2D6A4F] text-white font-medium rounded-lg hover:bg-[#235340] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <CheckCircle className="w-5 h-5 animate-pulse" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const GoogleMap = () => (
  <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.8673831863824!2d151.20544631521252!3d-33.86882728065589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae401e8b983f%3A0x8f0a3069a0b10b0!2sThe%20Rocks%2C%20Sydney%20NSW%202000!5e0!3m2!1sen!2sau!4v1645123456789!5m2!1sen!2sau"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="4 Donkeys Bar Location"
    />
  </div>
);

const ContactPage = () => {
  const [showPopup, setShowPopup] = useState(false);

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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              Get in touch with us or visit our bar in The Rocks, Sydney
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GoogleMap />
          </motion.div>
        </div>
      </div>
      {/* Show only on medium (md) and up */}
      <div className="hidden md:block">
        <EventLogoButton onClick={() => setShowPopup(true)} />
        <Popup show={showPopup} onClose={() => setShowPopup(false)} />
      </div>
    </div>
  );
};

export default ContactPage;
