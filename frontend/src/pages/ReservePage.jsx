import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Phone, Mail, User } from "lucide-react";
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
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ReservePage = ({ onSwitchToVenue }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const availableTimes = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  const partySizes = Array.from({ length: 8 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log(formData);
    toast.success("Reservation request submitted! We'll confirm shortly.");
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
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reserve a Table
            </h1>
            <p className="text-lg text-gray-600">
              Book your table for up to 8 guests. For large groups, see our
              venue reservation option.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
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

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2D6A4F]" />
                    Time
                  </label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => handleChange("time", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/80">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Party Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2D6A4F]" />
                    Party Size
                  </label>
                  <Select
                    value={formData.partySize}
                    onValueChange={(value) => handleChange("partySize", value)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20">
                      <SelectValue placeholder="Number of guests" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {partySizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleChange("specialRequests", e.target.value)
                  }
                  className="w-full h-24 px-3 py-2 text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 bg-white"
                  placeholder="Any special requests or dietary requirements?"
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#2D6A4F] hover:bg-[#235c41] text-white font-medium py-2.5 transition-all duration-200"
                >
                  Confirm Reservation
                </Button>

                <p className="text-center text-gray-600">
                  Larger event or private function?{" "}
                  <button
                    onClick={onSwitchToVenue}
                    className="text-[#2D6A4F] hover:underline font-medium"
                  >
                    Click here to book the full venue
                  </button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReservePage;
