import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance.js";
import EventLogoButton from "@/components/EventLogoButton";

const dayAbbrev = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const to12h = (hhmm) => {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = Number(mStr || 0);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const formatHourRow = (row) => {
  const days = (row.days || []).map((d) => dayAbbrev[d] || d).join(", ");
  if (row.closed) return `${days}: Closed`;
  const open = to12h(row.open);
  const close = to12h(row.close);
  return `${days}: ${open} – ${close}${row.note ? ` (${row.note})` : ""}`;
};

const oneLineAddress = (address) =>
  [
    address?.street,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

const buildMapEmbedSrc = (address) => {
  // Prefer coordinates if present; falls back to encoded address
  const lng = address?.geo?.coordinates?.[0];
  const lat = address?.geo?.coordinates?.[1];
  if (typeof lng === "number" && typeof lat === "number") {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }
  const q = encodeURIComponent(oneLineAddress(address));
  return `https://www.google.com/maps?q=${q}&z=15&output=embed`;
};

/* -------------------- CONTACT INFO (dynamic) -------------------- */
const ContactInfo = ({ contact }) => {
  const address = contact?.address;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h3>
      {contact?.blurb && <p className="text-gray-600 mb-6">{contact.blurb}</p>}

      <div className="space-y-6">
        {/* Location */}
        <div className="flex items-start space-x-4">
          <div className="bg-[#2D6A4F] p-3 rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
            <p className="text-gray-600">
              {address ? (
                <>
                  {address.street && (
                    <>
                      {address.street}
                      <br />
                    </>
                  )}
                  {[address.city, address.state, address.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {address.country}
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-4">
          <div className="bg-[#2D6A4F] p-3 rounded-lg">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
            <p className="text-gray-600">{contact?.phone || "—"}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-4">
          <div className="bg-[#2D6A4F] p-3 rounded-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
            <p className="text-gray-600">{contact?.email || "—"}</p>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start space-x-4">
          <div className="bg-[#2D6A4F] p-3 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
            <div className="text-gray-600 space-y-1">
              {(contact?.openingHours?.length
                ? contact.openingHours
                : [
                    {
                      days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
                      open: "16:00",
                      close: "23:00",
                    },
                    {
                      days: ["Friday", "Saturday"],
                      open: "16:00",
                      close: "01:00",
                    },
                    { days: ["Sunday"], closed: true },
                  ]
              ).map((row, i) => (
                <p key={i}>{formatHourRow(row)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- CONTACT FORM (unchanged API) -------------------- */
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
    try {
      await axiosInstance.post("/contact", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

/* -------------------- GOOGLE MAP (dynamic) -------------------- */
const GoogleMap = ({ address }) => (
  <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
    <iframe
      src={buildMapEmbedSrc(address)}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Location Map"
    />
  </div>
);

/* -------------------- PAGE -------------------- */
const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/contactus");
        setContact(data);
      } catch (err) {
        // If 404, show page with placeholders
        if (err?.response?.status !== 404) {
          console.error("Failed to fetch contact:", err);
          toast.error("Failed to load contact info");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
              {contact?.locationLabel
                ? `Reach us at ${contact.locationLabel}`
                : "Get in touch or visit our bar"}
            </p>
          </motion.div>

          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : (
            <>
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
                  <ContactInfo contact={contact} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GoogleMap address={contact?.address} />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
