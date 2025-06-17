import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ReservePage from "./ReservePage";
import ReserveVenuePage from "./ReserveVenuePage";

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("table");

  const handleTabChange = (value) => {
    setActiveTab(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <NavBar forceSolid={true} />

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book with Us
            </h1>
            <p className="text-lg text-gray-600">
              Choose between reserving a table or booking our venue for your
              special events
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-sm h-[60px]">
              <TabsTrigger
                value="table"
                className="text-lg h-full rounded-lg font-medium
                  data-[state=active]:bg-white 
                  data-[state=active]:text-[#2D6A4F] 
                  data-[state=active]:shadow-sm
                  data-[state=active]:border-b-2
                  data-[state=active]:border-[#2D6A4F]
                  hover:bg-gray-100
                  transition-all duration-200
                  focus-visible:ring-2
                  focus-visible:ring-[#2D6A4F]/20
                  focus-visible:outline-none"
              >
                Reserve a Table
              </TabsTrigger>
              <TabsTrigger
                value="venue"
                className="text-lg h-full rounded-lg font-medium
                  data-[state=active]:bg-white 
                  data-[state=active]:text-[#2D6A4F] 
                  data-[state=active]:shadow-sm
                  data-[state=active]:border-b-2
                  data-[state=active]:border-[#2D6A4F]
                  hover:bg-gray-100
                  transition-all duration-200
                  focus-visible:ring-2
                  focus-visible:ring-[#2D6A4F]/20
                  focus-visible:outline-none"
              >
                Book the Venue
              </TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <ReservePage onSwitchToVenue={() => handleTabChange("venue")} />
            </TabsContent>
            <TabsContent value="venue">
              <ReserveVenuePage />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
