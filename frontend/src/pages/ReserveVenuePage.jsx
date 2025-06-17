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
import axiosInstance from "@/lib/axiosInstance.js";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/reserve-venue", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(
        "Venue reservation request submitted! We'll get back to you shortly."
      );
      setFormData({
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
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Failed to submit reservation request. Please try again later."
      );
      return;
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200"
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
    </div>
  );
};

export default ReserveVenuePage;
