import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  User,
  Upload,
  Building,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ReserveVenuePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bookingType: "",
    eventType: "",
    guestCount: "",
    date: "",
    startTime: "",
    endTime: "",
    specialRequests: "",
    file: null,
  });

  const bookingTypes = [
    { value: "venue", label: "Full Venue Hire" },
    { value: "large", label: "Large Booking (10+ People)" },
  ];

  const eventTypes = [
    "Birthday Party",
    "Corporate Event",
    "Wedding Reception",
    "Anniversary",
    "Business Meeting",
    "Social Gathering",
    "Other",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      toast.success("File uploaded successfully!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    toast.success(
      "Venue reservation request submitted! We'll get back to you shortly."
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <NavBar forceSolid={true} />

      {/* Sophisticated background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(45, 106, 79, 0.15), rgba(45, 106, 79, 0.25)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 16.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 18c-7.5 0-13.5-6-13.5-13.5S22.5 7.5 30 7.5s13.5 6 13.5 13.5S37.5 34.5 30 34.5zm0-27C19.5 7.5 11.25 15.75 11.25 26.25s8.25 18.75 18.75 18.75 18.75-8.25 18.75-18.75S40.5 7.5 30 7.5z' fill='%232D6A4F' fill-opacity='0.1'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2V6c0-1.1.9-2 2-2zm0 32c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4c0-1.1.9-2 2-2zm-12-16c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2zm32 0c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2zm-16 0c1.1 0 2-.9 2-2V18c0-1.1-.9-2-2-2s-2 .9-2 2v4c0 1.1.9 2 2 2z' fill='%232D6A4F' fill-opacity='0.08'/%3E%3C/svg%3E")
          `,
          backgroundSize: "60px 60px, 48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4">
                Reserve Our Venue
              </h1>
              <p className="text-xl text-gray-200">
                Perfect for private events, corporate functions, and special
                celebrations
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Booking Type and Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#2D6A4F]" />
                    Booking Type
                  </label>
                  <Select
                    value={formData.bookingType}
                    onValueChange={(value) =>
                      handleChange("bookingType", value)
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20">
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {bookingTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-gray-900"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PartyPopper className="w-4 h-4 text-[#2D6A4F]" />
                    Event Type
                  </label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => handleChange("eventType", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {eventTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-gray-900"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2D6A4F]" />
                    Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#2D6A4F]" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#2D6A4F]" />
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#2D6A4F]" />
                    Date
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2D6A4F]" />
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2D6A4F]" />
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2D6A4F]" />
                    Estimated Guests
                  </label>
                  <Input
                    type="number"
                    min="10"
                    value={formData.guestCount}
                    onChange={(e) => handleChange("guestCount", e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    placeholder="Number of guests"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Special Requests or Additional Information
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleChange("specialRequests", e.target.value)
                  }
                  className="w-full h-32 px-3 py-2 text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 bg-white"
                  placeholder="Tell us about your event, any special requirements, or specific arrangements needed..."
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2D6A4F]" />
                  Upload Additional Documents (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <span className="text-sm text-gray-500">Max size: 5MB</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2D6A4F] hover:bg-[#235c41] text-white font-medium py-3 text-lg transition-all duration-200"
              >
                Submit Venue Reservation Request
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ReserveVenuePage;
