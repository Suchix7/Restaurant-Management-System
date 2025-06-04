import React from "react";

const Hero = () => {
  return (
    <div>
      {" "}
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between px-16">
          <div className="text-white z-10">
            <h1 className="text-8xl font-bold mb-8 tracking-wider">EMBRACE</h1>
            <button className="bg-gray-800 text-white px-8 py-3 text-sm font-medium hover:bg-gray-700 transition-colors">
              BROWSE & VISIT
            </button>
          </div>

          <div className="relative">
            <img
              src="/placeholder.svg?height=400&width=300"
              alt="Cocktail Glass"
              className="w-80 h-96 object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
